import { useParams, Link as RouterLink } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContandoFrutas from "@/components/games/ContandoFrutas";

// A simple placeholder for a game component
const GamePlaceholder = ({ title }: { title: string }) => (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-64 flex items-center justify-center">
        <p className="text-muted-foreground">O jogo para esta atividade será implementado aqui em breve!</p>
      </div>
    </CardContent>
  </Card>
);

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

  const renderGame = () => {
    switch (activity.id) {
      case 'm1':
        return <ContandoFrutas />;
      default:
        return <GamePlaceholder title={activity.title} />;
    }
  };

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
      
      {renderGame()}
    </div>
  );
};

export default GamePage;