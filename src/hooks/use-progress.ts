import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "@/context/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";
import { syncAchievements } from "@/utils/achievements";
import { useAchievementsContext } from "@/context/AchievementsContext";

const STORAGE_KEY = "edukids_progress_v1";

type ProgressMap = Record<string, boolean>;

function makeKey(subject: string, activity: string, moduleId: string, lessonId: string) {
  return `${subject}::${activity}::${moduleId}::${lessonId}`;
}

export function useProgress() {
  const { user } = useSupabase();
  const { refreshAchievements } = useAchievementsContext();
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
        return;
      }

      setIsSyncing(true);
      
      const { data: remoteData, error: fetchError } = await supabase
        .from("user_progress")
        .select("lesson_key")
        .eq("user_id", user.id);

      if (fetchError) {
        console.error("Failed to fetch progress from Supabase:", fetchError);
        setIsSyncing(false);
        return;
      }

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
        console.error("Failed to parse local progress during sync:", err);
      }

      const mergedProgress = { ...localProgress, ...remoteProgress };
      
      const itemsToUpload = Object.keys(localProgress).filter(key => !remoteProgress[key]);
      if (itemsToUpload.length > 0) {
        const recordsToInsert = itemsToUpload.map(key => ({
          user_id: user.id,
          lesson_key: key,
        }));
        
        const { error: uploadError } = await supabase.from("user_progress").insert(recordsToInsert);
        if (uploadError) {
          console.error("Failed to upload local progress to Supabase:", uploadError);
        }
      }

      setProgress(mergedProgress);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProgress));
      } catch (err) {
        console.error("Failed to save merged progress to localStorage:", err);
      }

      // Sincroniza conquistas após sincronizar progresso
      await syncAchievements(user.id, mergedProgress);
      await refreshAchievements(); // Notifica o contexto para atualizar

      setIsSyncing(false);
    };

    syncWithSupabase();
  }, [user, refreshAchievements]);

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

      await syncAchievements(user?.id, next);
      await refreshAchievements();

      if (user) {
        const { error } = await supabase.from("user_progress").insert({ user_id: user.id, lesson_key: key });
        if (error) {
          console.error("Failed to mark lesson as completed in Supabase:", error);
        }
      }
    },
    [progress, persistLocal, user, refreshAchievements]
  );

  const unmarkLesson = useCallback(
    async (subject: string, activity: string, moduleId: string, lessonId: string) => {
      const key = makeKey(subject, activity, moduleId, lessonId);
      if (!(key in progress)) return;

      const next = { ...progress };
      delete next[key];
      setProgress(next);
      persistLocal(next);

      await syncAchievements(user?.id, next);
      await refreshAchievements();

      if (user) {
        const { error } = await supabase.from("user_progress").delete().match({ user_id: user.id, lesson_key: key });
        if (error) {
          console.error("Failed to unmark lesson in Supabase:", error);
        }
      }
    },
    [progress, persistLocal, user, refreshAchievements]
  );

  const clearAll = useCallback(async () => {
    const next: ProgressMap = {};
    setProgress(next);
    persistLocal(next);

    await syncAchievements(user?.id, next);
    await refreshAchievements();

    if (user) {
      const { error } = await supabase.from("user_progress").delete().match({ user_id: user.id });
      if (error) {
        console.error("Failed to clear all progress in Supabase:", error);
      }
    }
  }, [persistLocal, user, refreshAchievements]);

  return {
    progress,
    isLessonCompleted,
    markLessonCompleted,
    unmarkLesson,
    clearAll,
    isSyncing,
  };
}