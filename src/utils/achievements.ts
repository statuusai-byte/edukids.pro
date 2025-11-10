import { supabase } from "@/integrations/supabase/client";
import { subjectsData } from "@/data/activitiesData";

export type ProgressMap = Record<string, boolean>;

const LOCAL_KEY = "edukids_achievements_unlocked_v1";

function saveLocal(ids: string[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {}
}

export function readLocal(): Set<string> {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

// Helper: coletar todas as keys de lições de uma atividade específica
function getLessonKeysForActivity(subjectSlug: string, activityId: string): string[] {
  const subject = subjectsData.find((s) => s.slug === subjectSlug);
  if (!subject) return [];
  const activity = subject.activities.find((a) => a.id === activityId);
  if (!activity) return [];
  const keys: string[] = [];
  activity.modules.forEach((m) => {
    m.lessons.forEach((l) => {
      keys.push(`${subjectSlug}::${activityId}::${m.id}::${l.id}`);
    });
  });
  return keys;
}

// Calcula conquistas com base no progresso atual
export function computeAchievements(progress: ProgressMap): Set<string> {
  const unlocked = new Set<string>();
  const completedKeys = Object.keys(progress).filter((k) => progress[k]);

  if (completedKeys.length >= 1) unlocked.add("first_step");
  if (completedKeys.length >= 10) unlocked.add("ten_lessons");
  if (completedKeys.length >= 50) unlocked.add("fifty_lessons");

  // Polímata: completar pelo menos 1 lição em 5 matérias diferentes
  const subjectsCompleted = new Set<string>();
  completedKeys.forEach((k) => {
    const subject = k.split("::")[0];
    if (subject) subjectsCompleted.add(subject);
  });
  if (subjectsCompleted.size >= 5) unlocked.add("polymath");

  // Mestres por trilha (atividades específicas)
  const mathActivityKeys = getLessonKeysForActivity("matematica", "m1");
  if (mathActivityKeys.length > 0 && mathActivityKeys.every((k) => progress[k])) {
    unlocked.add("math_master_1");
  }

  const ptActivityKeys = getLessonKeysForActivity("portugues", "p1");
  if (ptActivityKeys.length > 0 && ptActivityKeys.every((k) => progress[k])) {
    unlocked.add("portuguese_master_1");
  }

  return unlocked;
}

// Sincroniza conquistas com Supabase (inserindo as que faltam) e salva localmente
export async function persistAchievements(userId: string | null | undefined, unlockedIds: Set<string>) {
  saveLocal(Array.from(unlockedIds));

  if (!userId) return;

  const { data, error } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch user achievements for sync:", error);
    return;
  }

  const remoteSet = new Set<string>(data?.map((r: any) => r.achievement_id) ?? []);
  const missing = Array.from(unlockedIds).filter((id) => !remoteSet.has(id));

  if (missing.length > 0) {
    const rows = missing.map((id) => ({ user_id: userId, achievement_id: id }));
    const { error: insertError } = await supabase.from("user_achievements").insert(rows);
    if (insertError) {
      console.error("Failed to insert achievements:", insertError);
    }
  }
}