import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";
import { syncAchievements } from "@/utils/achievements";

const STORAGE_KEY = "edukids_progress_v1";
const UPLOAD_BATCH_SIZE = 100; // Enviar progresso em lotes de 100

type ProgressMap = Record<string, boolean>;

function makeKey(subject: string, activity: string, moduleId: string, lessonId: string) {
  return `${subject}::${activity}::${moduleId}::${moduleId}::${lessonId}`;
}

export function useProgress() {
  const { user } = useSupabase();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isSyncing, setIsSyncing] = useState(true);

  // Load from local storage initially
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProgress(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to load progress from localStorage:", err);
    }
    setIsSyncing(false); // Initial load done
  }, []);

  // Sync with Supabase when user is available
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!user) {
        console.log("[Sync] User not logged in, skipping Supabase sync.");
        return;
      }

      console.log("[Sync] Starting synchronization with Supabase for user:", user.id);
      setIsSyncing(true);
      
      console.log("[Sync] Fetching remote progress...");
      const { data: remoteData, error: fetchError } = await supabase
        .from("user_progress")
        .select("lesson_key")
        .eq("user_id", user.id);

      if (fetchError) {
        console.error("[Sync] Failed to fetch progress from Supabase:", fetchError);
        setIsSyncing(false);
        return;
      }
      console.log(`[Sync] Successfully fetched ${remoteData.length} remote progress items.`);

      const remoteProgress: ProgressMap = {};
      remoteData.forEach(item => {
        remoteProgress[item.lesson_key] = true;
      });

      let localProgress: ProgressMap = {};
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          localProgress = JSON.parse(raw);
        }
      } catch (err) {
        console.error("[Sync] Failed to parse local progress during sync:", err);
      }

      const mergedProgress = { ...localProgress, ...remoteProgress };
      
      const itemsToUpload = Object.keys(localProgress).filter(key => !remoteProgress[key]);
      if (itemsToUpload.length > 0) {
        console.log(`[Sync] Found ${itemsToUpload.length} local items to upload in batches.`);
        
        for (let i = 0; i < itemsToUpload.length; i += UPLOAD_BATCH_SIZE) {
          const batch = itemsToUpload.slice(i, i + UPLOAD_BATCH_SIZE);
          const recordsToInsert = batch.map(key => ({
            user_id: user.id,
            lesson_key: key,
          }));

          console.log(`[Sync] Uploading batch ${i / UPLOAD_BATCH_SIZE + 1}...`);
          const { error: uploadError } = await supabase.from("user_progress").insert(recordsToInsert);
          
          if (uploadError) {
            console.error(`[Sync] Failed to upload batch:`, uploadError);
            // Decide se quer parar ou continuar em caso de erro de lote
            break; 
          } else {
            console.log(`[Sync] Batch uploaded successfully.`);
          }
        }
      } else {
        console.log("[Sync] No new local items to upload.");
      }

      setProgress(mergedProgress);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProgress));
      } catch (err) {
        console.error("[Sync] Failed to save merged progress to localStorage:", err);
      }

      console.log("[Sync] Syncing achievements...");
      await syncAchievements(user.id, mergedProgress);
      console.log("[Sync] Achievements sync complete.");

      setIsSyncing(false);
      console.log("[Sync] Synchronization finished.");
    };

    syncWithSupabase();
  }, [user]);

  const persistLocal = useCallback((next: ProgressMap) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save progress to localStorage:", err);
    }
  }, []);

  const isLessonCompleted = useCallback(
    (subject: string, activity: string, moduleId: string, lessonId: string) => {
      const key = makeKey(subject, activity, moduleId, lessonId);
      return progress[key] === true;
    },
    [progress]
  );

  const markLessonCompleted = useCallback(
    async (subject: string, activity: string, moduleId: string, lessonId: string) => {
      const key = makeKey(subject, activity, moduleId, lessonId);
      if (progress[key]) return;

      const next: ProgressMap = { ...progress, [key]: true };
      setProgress(next);
      persistLocal(next);

      if (user) {
        const { error } = await supabase.from("user_progress").insert({ user_id: user.id, lesson_key: key });
        if (error) {
          console.error("Failed to mark lesson as completed in Supabase:", error);
        }
        // Atualiza conquistas após gravar
        await syncAchievements(user.id, next);
      } else {
        // Atualiza conquistas localmente
        await syncAchievements(null, next);
      }
    },
    [progress, persistLocal, user]
  );

  const unmarkLesson = useCallback(
    async (subject: string, activity: string, moduleId: string, lessonId: string) => {
      const key = makeKey(subject, activity, moduleId, lessonId);
      if (!(key in progress)) return;

      const next = { ...progress };
      delete next[key];
      setProgress(next);
      persistLocal(next);

      if (user) {
        const { error } = await supabase.from("user_progress").delete().match({ user_id: user.id, lesson_key: key });
        if (error) {
          console.error("Failed to unmark lesson in Supabase:", error);
        }
        await syncAchievements(user.id, next);
      } else {
        await syncAchievements(null, next);
      }
    },
    [progress, persistLocal, user]
  );

  const clearAll = useCallback(async () => {
    const next: ProgressMap = {};
    setProgress(next);
    persistLocal(next);

    if (user) {
      const { error } = await supabase.from("user_progress").delete().match({ user_id: user.id });
      if (error) {
        console.error("Failed to clear all progress in Supabase:", error);
      }
      await syncAchievements(user.id, next);
    } else {
      await syncAchievements(null, next);
    }
  }, [persistLocal, user]);

  return {
    progress,
    isLessonCompleted,
    markLessonCompleted,
    unmarkLesson,
    clearAll,
    isSyncing,
  };
}