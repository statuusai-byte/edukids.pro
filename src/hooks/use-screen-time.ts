import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_LIMIT_KEY = "edukids_screen_time_limit_minutes";
const STORAGE_BLOCK_KEY = "edukids_screen_time_block_enabled";
const STORAGE_TODAY_USAGE_KEY = "edukids_screen_time_today_minutes";
const STORAGE_LAST_DAY_KEY = "edukids_screen_time_last_day";

/**
 * Simple screen-time hook:
 * - Persist limit and block flag in localStorage
 * - Track today's usage in minutes (persisted)
 * - Provide startSession / stopSession to accumulate usage (call from app when lesson/game starts/stops)
 * - Provide resetToday and helpers to check blocked state
 */

export function useScreenTime() {
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

  const persistUsage = useCallback((minutes: number) => {
    try {
      localStorage.setItem(STORAGE_TODAY_USAGE_KEY, String(minutes));
      const today = new Date().toDateString();
      localStorage.setItem(STORAGE_LAST_DAY_KEY, today);
    } catch (e) {
      console.error("Failed to persist usage:", e);
    }
  }, []);

  const persistLimit = useCallback((minutes: number | null) => {
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

  const persistBlockFlag = useCallback((enabled: boolean) => {
    try {
      localStorage.setItem(STORAGE_BLOCK_KEY, enabled ? "true" : "false");
    } catch (e) {
      console.error("Failed to persist block flag:", e);
    }
  }, []);

  // API
  const setLimitMinutes = useCallback((minutes: number | null) => {
    setLimitMinutesState(minutes);
    persistLimit(minutes);
  }, [persistLimit]);

  const setBlockEnabled = useCallback((enabled: boolean) => {
    setBlockEnabledState(enabled);
    persistBlockFlag(enabled);
  }, [persistBlockFlag]);

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
        // add one minute to usage (but don't exceed large numbers)
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