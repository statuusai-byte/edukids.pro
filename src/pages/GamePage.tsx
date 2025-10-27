import { useParams, Link as RouterLink } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContandoFrutas from "@/components/games/ContandoFrutas";
import { Link } from "react-router-dom";

const GamePage = () => {
  const { subject: subjectSlug, activityId } = useParams();

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

  // If activity is "Contando Frutas" and user visits root activity page, show a hero game preview + lessons
  const isContandoFrutas = activity.id === 'm1';

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

      {isContandoFrutas && (
        <div className="mb-8">
          <Card className="glass-card p-6">
            <CardHeader>
              <CardTitle>Mini Jogo: {activity.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Experimente um problema rápido do jogo antes de começar as lições.</p>
              <ContandoFrutas />
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Lições</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activity.lessons.map((lesson) => (
            <Link to={`/activities/${subject.slug}/${activity.id}/lessons/${lesson.id}`} key={lesson.id}>
              <div className="glass-card p-4 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                  </div>
                  <div className="text-sm text-primary">Abrir</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;