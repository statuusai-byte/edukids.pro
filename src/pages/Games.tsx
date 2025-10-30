import { useAge } from "@/context/AgeContext";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { TiltCard } from "@/components/TiltCard";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { useScreenTime } from "@/hooks/use-screen-time";
import { Lock } from "lucide-react"; // Removido Gamepad2 daqui
import PageTransition from "@/components/PageTransition";

const iconColorClass: Record<string, string> = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    teal: 'text-teal-400',
    indigo: 'text-indigo-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    pink: 'text-pink-400',
    slate: 'text-slate-400',
    rose: 'text-rose-400',
    lime: 'text-lime-400',
};

const Games = () => {
  const { ageGroup } = useAge();
  const { isBlocked, limitMinutes } = useScreenTime();

  const availableGames = useMemo(() => {
    if (!ageGroup) return [];
    const games: {
      subjectSlug: string;
      activityId: string;
      moduleId: string;
      lessonId: string;
      title: string;
      description?: string;
      icon: string;
      color: string;
    }[] = [];

    subjectsData.forEach(subject => {
      subject.activities.forEach(activity => {
        if (activity.ageGroups.includes(ageGroup)) {
          activity.modules.forEach(module => {
            module.lessons.forEach(lesson => {
              if (lesson.type === 'game') {
                games.push({
                  subjectSlug: subject.slug,
                  activityId: activity.id,
                  moduleId: module.id,
                  lessonId: lesson.id,
                  title: lesson.title,
                  description: lesson.description || activity.description,
                  icon: activity.icon, // Use activity icon for the game card
                  color: subject.color,
                });
              }
            });
          });
        }
      });
    });
    return games;
  }, [ageGroup]);

  if (isBlocked) {
    return (
      <PageTransition>
        <div className="text-center py-16 glass-card rounded-lg">
          <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Tempo de Tela Esgotado</h2>
          <p className="text-muted-foreground mt-2">
            O limite de {limitMinutes} minutos foi atingido. O acesso aos jogos está bloqueado.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Para continuar, um adulto deve desativar o bloqueio ou aumentar o limite no Painel dos Pais.
          </p>
          <Link to="/dashboard" className="mt-4 inline-block text-primary underline">Ir para Painel dos Pais</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div>
        <h1 className="text-4xl font-bold tracking-tighter mb-8">Jogos Educativos</h1>
        {availableGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableGames.map((game) => (
              <Link 
                to={`/activities/${game.subjectSlug}/${game.activityId}/modules/${game.moduleId}/lessons/${game.lessonId}`} 
                key={game.lessonId} 
                className="group"
              >
                <TiltCard className="flex flex-col h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">{game.title}</CardTitle>
                    <div className="p-3 bg-secondary rounded-full transition-transform duration-300 group-hover:scale-110">
                      <Icon name={game.icon as any} className={`h-12 w-12 ${iconColorClass[game.color] || 'text-primary'}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {game.description}
                    </p>
                    <div className="mt-auto">
                      <div className={`h-1 w-10 ${iconColorClass[game.color].replace('text-', 'bg-') || 'bg-primary'} rounded-full mt-4 transition-all duration-300 group-hover:w-20`}></div>
                    </div>
                  </CardContent>
                </TiltCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-lg">
            <h2 className="text-2xl font-bold">Nenhum jogo encontrado!</h2>
            <p className="text-muted-foreground mt-2">
              Não há jogos disponíveis para esta faixa etária no momento. Tente selecionar outra faixa etária.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Games;