import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContandoFrutas from "@/components/games/ContandoFrutas";

const LessonPage = () => {
  const { subject: subjectSlug, activityId, lessonId } = useParams();
  const navigate = useNavigate();

  const { subject, activity, lesson, lessonIndex } = useMemo(() => {
    const s = subjectsData.find(sub => sub.slug === subjectSlug);
    if (!s) return { subject: null, activity: null, lesson: null, lessonIndex: -1 };
    const a = s.activities.find(act => act.id === activityId);
    if (!a) return { subject: s, activity: null, lesson: null, lessonIndex: -1 };
    const li = a.lessons.findIndex(l => l.id === lessonId);
    const l = li >= 0 ? a.lessons[li] : null;
    return { subject: s, activity: a, lesson: l, lessonIndex: li };
  }, [subjectSlug, activityId, lessonId]);

  if (!subject || !activity || !lesson) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Lição não encontrada</h1>
        <Button asChild variant="link">
          <RouterLink to={`/activities/${subjectSlug}/${activityId}`}>Voltar para Atividade</RouterLink>
        </Button>
      </div>
    );
  }

  const goNext = () => {
    const nextIndex = lessonIndex + 1;
    if (nextIndex < activity.lessons.length) {
      const next = activity.lessons[nextIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/lessons/${next.id}`);
    }
  };

  const goPrev = () => {
    const prevIndex = lessonIndex - 1;
    if (prevIndex >= 0) {
      const prev = activity.lessons[prevIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/lessons/${prev.id}`);
    } else {
      navigate(`/activities/${subject.slug}/${activity.id}`);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon">
          <RouterLink to={`/activities/${subject.slug}/${activity.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground">{activity.title} • {subject.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-card p-6">
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.type === 'game' && activity.id === 'm1' ? (
                <>
                  <p className="text-muted-foreground mb-4">{lesson.description}</p>
                  <ContandoFrutas />
                </>
              ) : lesson.videoUrl ? (
                <div className="aspect-video rounded-2xl overflow-hidden border border-primary/50 shadow-lg shadow-primary/20">
                  <iframe
                    width="100%"
                    height="100%"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <>
                  <p className="text-foreground/90 mb-4">{lesson.content}</p>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={goPrev}>Anterior</Button>
            <Button onClick={goNext} className="ml-auto">Próxima Lição</Button>
          </div>
        </div>

        <aside>
          <Card className="glass-card p-4">
            <CardHeader>
              <CardTitle>Índice da Atividade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activity.lessons.map((l, idx) => (
                <div key={l.id} className={`p-2 rounded-md ${l.id === lesson.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{idx + 1}. {l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.description}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{l.type}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default LessonPage;