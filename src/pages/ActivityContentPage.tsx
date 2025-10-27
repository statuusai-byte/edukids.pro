import { useParams, Link as RouterLink } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import { useProgress } from "@/hooks/use-progress";

const ActivityContentPage = () => {
  const { subject: subjectSlug, activityId } = useParams();
  const { isLessonCompleted } = useProgress();

  const { subject, activity } = useMemo(() => {
    const s = subjectsData.find(sub => sub.slug === subjectSlug);
    if (!s) return { subject: null, activity: null };
    const a = s.activities.find(act => act.id === activityId);
    return { subject: s, activity: a };
  }, [subjectSlug, activityId]);

  if (!subject || !activity) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Atividade não encontrada</h1>
        <Button asChild variant="link">
          <RouterLink to="/activities">Voltar para Atividades</RouterLink>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <RouterLink to={`/activities/${subject.slug}`}>
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
        <h1 className="text-4xl font-bold tracking-tighter">{activity.title}</h1>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Pastas de Estudo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activity.modules.map((mod) => {
            const total = mod.lessons.length;
            const completed = mod.lessons.reduce((acc, l) => {
              if (isLessonCompleted(subject.slug, activity.id, mod.id, l.id)) return acc + 1;
              return acc;
            }, 0);

            return (
              <div key={mod.id} className="glass-card p-4 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-md">
                      <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{mod.title}</h3>
                      {mod.description && <p className="text-sm text-muted-foreground">{mod.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{completed} de {total} lições concluídas</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Link to={`/activities/${subject.slug}/${activity.id}/modules/${mod.id}/lessons/${mod.lessons[0].id}`}>
                      <Button size="sm" className="mb-2">Abrir Pasta</Button>
                    </Link>
                    <details className="text-sm text-muted-foreground">
                      <summary className="cursor-pointer">Ver Lições</summary>
                      <div className="mt-2 space-y-1">
                        {mod.lessons.map(l => (
                          <Link key={l.id} to={`/activities/${subject.slug}/${activity.id}/modules/${mod.id}/lessons/${l.id}`}>
                            <div className="py-1 px-2 rounded-md hover:bg-white/5 flex justify-between items-center">
                              <div>
                                <div className="font-medium">{l.title}</div>
                                <div className="text-xs text-muted-foreground">{l.description}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {isLessonCompleted(subject.slug, activity.id, mod.id, l.id) ? "Concluída" : "Aberta"}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActivityContentPage;