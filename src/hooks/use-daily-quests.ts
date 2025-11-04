import { useCallback, useEffect, useMemo, useState } from "react";

type DailyBaseline = {
  date: string;
  lessonsCompletedBaseline: number;
  reviewsDone: number;
};

const STORAGE_KEY = "edukids_daily_quests_v1";

function todayKey() {
  return new Date().toDateString();
}

export function useDailyQuests(totalLessonsCompleted: number, todayUsageMinutes: number) {
  const [baseline, setBaseline] = useState<DailyBaseline>({
    date: todayKey(),
    lessonsCompletedBaseline: totalLessonsCompleted,
    reviewsDone: 0,
  });

  // Load or initialize baseline for today
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: DailyBaseline = JSON.parse(raw);
        if (data.date === todayKey()) {
          setBaseline(data);
          return;
        }
      }
    } catch {
      // ignore
    }
    // initialize for today
    const fresh: DailyBaseline = {
      date: todayKey(),
      lessonsCompletedBaseline: totalLessonsCompleted,
      reviewsDone: 0,
    };
    setBaseline(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // ignore
    }
  }, [totalLessonsCompleted]);

  const lessonsDoneToday = Math.max(0, totalLessonsCompleted - baseline.lessonsCompletedBaseline);
  const studiedEnough = todayUsageMinutes >= 10;
  const reviewedEnough = baseline.reviewsDone >= 1;

  const markReviewDone = useCallback(() => {
    const next = { ...baseline, reviewsDone: baseline.reviewsDone + 1 };
    setBaseline(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [baseline]);

  const quests = useMemo(() => {
    return [
      {
        id: "q1",
        title: "Concluir 1 lição hoje",
        description: "Finalize qualquer lição para ganhar impulso diário.",
        completed: lessonsDoneToday >= 1,
        progress: Math.min(1, lessonsDoneToday),
        total: 1,
        actionType: "auto" as const,
      },
      {
        id: "q2",
        title: "Estudar por 10 minutos",
        description: "Some 10 minutos de estudo hoje.",
        completed: studiedEnough,
        progress: Math.min(10, todayUsageMinutes),
        total: 10,
        actionType: "auto" as const,
      },
      {
        id: "q3",
        title: "Revisar 1 lição",
        description: "Revise qualquer lição concluída recentemente.",
        completed: reviewedEnough,
        progress: Math.min(1, baseline.reviewsDone),
        total: 1,
        actionType: "manual" as const,
      },
    ];
  }, [lessonsDoneToday, studiedEnough, todayUsageMinutes, reviewedEnough, baseline.reviewsDone]);

  const completedCount = quests.filter(q => q.completed).length;

  return {
    quests,
    completedCount,
    totalCount: quests.length,
    markReviewDone,
  };
}