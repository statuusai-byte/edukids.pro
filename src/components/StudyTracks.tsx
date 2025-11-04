import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subjectsData } from "@/data/activitiesData";
import { useAge } from "@/context/AgeContext";
import { useProgress } from "@/hooks/use-progress";
import { Icon } from "@/components/Icon";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

function makeKey(subject: string, activity: string, moduleId: string, lessonId: string) {
  return `${subject}::${activity}::${moduleId}::${lessonId}`;
}

const colorClass: Record<string, string> = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  green: "text-green-400",
  orange: "text-orange-400",
  teal: "text-teal-400",
  indigo: "text-indigo-400",
  yellow: "text-yellow-400",
  red: "text-red-400",
  pink: "text-pink-400",
  slate: "text-slate-400",
  rose: "text-rose-400",
  lime: "text-lime-400",
};

const StudyTracks = () => {
  const { ageGroup } = useAge();
  const { progress } = useProgress();

  const tracks = subjectsData
    .filter((s) => !ageGroup || s.ageGroups.includes(ageGroup))
    .map((s) => {
      let total = 0;
      let done = 0;

      s.activities
        .filter((a) => !ageGroup || a.ageGroups.includes(ageGroup))
        .forEach((a) => {
          a.modules.forEach((m) => {
            m.lessons.forEach((l) => {
              total += 1;
              const key = makeKey(s.slug, a.id, m.id, l.id);
              if (progress[key]) done += 1;
            });
          });
        });

      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      // find a next lesson to continue
      let nextUrl: string | null = null;
      outer: for (const a of s.activities) {
        if (ageGroup && !a.ageGroups.includes(ageGroup)) continue;
        for (const m of a.modules) {
          for (const l of m.lessons) {
            const key = makeKey(s.slug, a.id, m.id, l.id);
            if (!progress[key]) {
              nextUrl = `/activities/${s.slug}/${a.id}/modules/${m.id}/lessons/${l.id}`;
              break outer;
            }
          }
        }
      }

      return {
        subject: s,
        total,
        done,
        pct,
        nextUrl,
      };
    })
    .filter((t) => t.total > 0);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tracks.map(({ subject, pct, done, total, nextUrl }) => (
        <Card key={subject.slug} className="glass-card">
          <CardHeader className="flex items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-secondary p-3">
                <Icon
                  name={subject.icon}
                  className={cn("h-8 w-8", colorClass[subject.color] || "text-primary")}
                />
              </div>
              <CardTitle className="text-xl">{subject.name}</CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {done}/{total}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progresso: {pct}%</span>
              {nextUrl ? (
                <Button asChild size="sm">
                  <Link to={nextUrl}>Continuar trilha</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="secondary">
                  <Link to={`/activities/${subject.slug}`}>Rever conteúdo</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudyTracks;