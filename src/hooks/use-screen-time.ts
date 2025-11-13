import { useCallback, useEffect, useRef, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_LIMIT_KEY = "edukids_screen_time_limit_minutes";
const STORAGE_BLOCK_KEY = "edukids_screen_time_block_enabled";
const STORAGE_TODAY_USAGE_KEY = "edukids_screen_time_today_minutes";
const STORAGE_LAST_DAY_KEY = "edukids_screen_time_last_day";

/**
 * Screen-time hook:
 * - Persist limit and block flag in localStorage for offline use
 * - When logged in, sync limit/block with user's profile on Supabase so parents cannot just flip localStorage
 * - Track today's usage in minutes (persisted locally)
 * - Provide startSession / stopSession to accumulate usage
 */

export function useScreenTime() {
  const { user } = useSupabase();
  const [limitMinutes, setLimitMinutesState] = useState<number | null>(null);
  const [blockEnabled, setBlockEnabledState] = useState<boolean>(false);
  const [todayUsage, setTodayUsage] = useState<number>(0);

  const sessionStartRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // load persisted state and reset daily usage when day changes
  useEffect(() => {
    try {
      const rawLimit = localStorage.getItem(STORAGE_LIMIT_KEY);
      setLimitMinutesState(rawLimit ? Number(rawLimit) : null);

      const rawBlock = localStorage.getItem(STORAGE_BLOCK_KEY);
      setBlockEnabledState(rawBlock === "true");

      const lastDay = localStorage.getItem(STORAGE_LAST_DAY_KEY);
      const today = new Date().toDateString();
      if (lastDay !== today) {
        localStorage.setItem(STORAGE_LAST_DAY_KEY, today);
        localStorage.setItem(STORAGE_TODAY_USAGE_KEY, "0");
        setTodayUsage(0);
      } else {
        const rawUsage = localStorage.getItem(STORAGE_TODAY_USAGE_KEY);
        setTodayUsage(rawUsage ? Number(rawUsage) : 0);
      }
    } catch (e) {
      console.error("Failed to initialize screen time:", e);
    }
  }, []);

  // When user logs in, fetch their profile values for screen time (limit + block flag).
  useEffect(() => {
    let mounted = true;
    const fetchProfileSettings = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("screen_time_limit_minutes, screen_time_block_enabled")
          .eq("id", user.id)
          .single();

        if (!mounted) return;

        if (error) {
          // If RLS prevents the read or other error, we safely ignore and keep local settings.
          console.warn("Failed to fetch screen time settings from profile:", error);
          return;
        }

        // If server has authoritative settings, override local values (and persist locally).
        if (data?.screen_time_limit_minutes !== undefined) {
          const val = data.screen_time_limit_minutes ?? null;
          setLimitMinutesState(val);
          try {
            if (val === null) localStorage.removeItem(STORAGE_LIMIT_KEY);
            else localStorage.setItem(STORAGE_LIMIT_KEY, String(val));
          } catch {}
        }
        if (data?.screen_time_block_enabled !== undefined) {
          const b = Boolean(data.screen_time_block_enabled);
          setBlockEnabledState(b);
          try {
            localStorage.setItem(STORAGE_BLOCK_KEY, b ? "true" : "false");
          } catch {}
        }
      } catch (e) {
        console.error("Error while syncing screen time settings:", e);
      }
    };

    fetchProfileSettings();
    return () => { mounted = false; };
  }, [user]);

  const persistUsage = useCallback((minutes: number) => {
    try {
      localStorage.setItem(STORAGE_TODAY_USAGE_KEY, String(minutes));
      const today = new Date().toDateString();
      localStorage.setItem(STORAGE_LAST_DAY_KEY, today);
    } catch (e) {
      console.error("Failed to persist usage:", e);
    }
  }, []);

  const persistLimitLocal = useCallback((minutes: number | null) => {
    try {
      if (minutes === null) {
        localStorage.removeItem(STORAGE_LIMIT_KEY);
      } else {
        localStorage.setItem(STORAGE_LIMIT_KEY, String(minutes));
      }
    } catch (e) {
      console.error("Failed to persist limit:", e);
    }
  }, []);

  const persistBlockFlagLocal = useCallback((enabled: boolean) => {
    try {
      localStorage.setItem(STORAGE_BLOCK_KEY, enabled ? "true" : "false");
    } catch (e) {
      console.error("Failed to persist block flag:", e);
    }
  }, []);

  // When user sets limit or block, we also update the profile via Supabase (authenticated).
  const updateProfileServer = useCallback(async (payload: { screen_time_limit_minutes?: number | null; screen_time_block_enabled?: boolean } ) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to update profile screen time settings:", error);
      }
    } catch (e) {
      console.error("Failed to update profile on server:", e);
    }
  }, [user]);

  // API
  const setLimitMinutes = useCallback((minutes: number | null) => {
    setLimitMinutesState(minutes);
    persistLimitLocal(minutes);
    // Try to persist on server (best-effort)
    updateProfileServer({ screen_time_limit_minutes: minutes });
  }, [persistLimitLocal, updateProfileServer]);

  const setBlockEnabled = useCallback((enabled: boolean) => {
    setBlockEnabledState(enabled);
    persistBlockFlagLocal(enabled);
    updateProfileServer({ screen_time_block_enabled: enabled });
  }, [persistBlockFlagLocal, updateProfileServer]);

  const resetToday = useCallback(() => {
    setTodayUsage(0);
    persistUsage(0);
  }, [persistUsage]);

  const isBlocked = useCallback(() => {
    if (!blockEnabled || limitMinutes === null) return false;
    return todayUsage >= limitMinutes;
  }, [blockEnabled, limitMinutes, todayUsage]);

  // Start a session: record timestamp and start an interval that adds 1 minute each 60s.
  const startSession = useCallback(() => {
    if (sessionStartRef.current !== null) return; // already started
    sessionStartRef.current = Date.now();

    // also create an interval to persist intermediate minutes each 60s
    if (intervalRef.current === null) {
      const id = window.setInterval(() => {
        setTodayUsage((prev) => {
          const next = prev + 1;
          persistUsage(next);
          return next;
        });
      }, 60_000); // every minute
      intervalRef.current = id;
    }
  }, [persistUsage]);

  // Stop session: compute elapsed minutes from start and add to today's usage, clear interval.
  const stopSession = useCallback(() => {
    if (sessionStartRef.current === null) return;
    const start = sessionStartRef.current;
    sessionStartRef.current = null;

    const elapsedMs = Date.now() - start;
    const elapsedMinutes = Math.max(0, Math.round(elapsedMs / 60_000));

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (elapsedMinutes > 0) {
      setTodayUsage((prev) => {
        const next = prev + elapsedMinutes;
        persistUsage(next);
        return next;
      });
    }
  }, [persistUsage]);

  // Force add minutes (utility)
  const addMinutes = useCallback((minutes: number) => {
    setTodayUsage((prev) => {
      const next = Math.max(0, prev + minutes);
      persistUsage(next);
      return next;
    });
  }, [persistUsage]);

  // ensure interval cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    limitMinutes,
    setLimitMinutes,
    blockEnabled,
    setBlockEnabled,
    todayUsage,
    resetToday,
    isBlocked: isBlocked(),
    startSession,
    stopSession,
    addMinutes,
  };
}