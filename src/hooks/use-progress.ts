import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "edukids_progress_v1";

type ProgressMap = Record<string, true>;

function makeKey(subject: string, activity: string, moduleId: string, lessonId: string) {
  return `${subject}::${activity}::${moduleId}::${lessonId}`;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProgress(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to load progress:", err);
    }
  }, []);

  const persist = useCallback((next: ProgressMap) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save progress:", err);
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
    (subject: string, activity: string, moduleId: string, lessonId: string) => {
      const key = makeKey(subject, activity, moduleId, lessonId);
      const next = { ...progress, [key]: true };
      setProgress(next);
      persist(next);
    },
    [progress, persist]
  );

  const unmarkLesson = useCallback(
    (subject: string, activity: string, moduleId: string, lessonId: string) => {
      const key = makeKey(subject, activity, moduleId, lessonId);
      if (!(key in progress)) return;
      const next = { ...progress };
      delete next[key];
      setProgress(next);
      persist(next);
    },
    [progress, persist]
  );

  const clearAll = useCallback(() => {
    setProgress({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear progress:", err);
    }
  }, []);

  return {
    progress,
    isLessonCompleted,
    markLessonCompleted,
    unmarkLesson,
    clearAll,
  };
}