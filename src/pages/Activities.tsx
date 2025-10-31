import { useAge } from "@/context/AgeContext";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { TiltCard } from "@/components/TiltCard";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { useScreenTime } from "@/hooks/use-screen-time";
import { Lock } from "lucide-react";
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

const bgColorClass: Record<string, string> = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    green: 'bg-green-400',
    orange: 'bg-orange-400',
    teal: 'bg-teal-400',
    indigo: 'bg-indigo-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    pink: 'bg-pink-400',
    slate: 'bg-slate-400',
    rose: 'bg-rose-400',
    lime: 'bg-lime-400',
};

const Activities = () => {
  const { ageGroup } = useAge();
  const { isBlocked, limitMinutes } = useScreenTime();

  const subjects = useMemo(() => {
    if (!ageGroup) return [];
    return subjectsData
      .map(subject => {
        const availableActivities = subject.activities.filter(activity => 
          activity.ageGroups.includes(ageGroup)
        );
        return {
          ...subject,
          availableActivitiesCount: availableActivities.length,
          activitySamples: availableActivities.slice(0, 2).map(a => a.title)
        };
      })
      .filter(subject => subject.availableActivitiesCount > 0);
  }, [ageGroup]);

  if (isBlocked) {
    return (
      <PageTransition>
        <div className="text-center py-16 glass-card rounded-lg">
          <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Tempo de Tela Esgotado</h2>
          <p className="text-muted-foreground mt-2">
            O limite de {limitMinutes} minutos foi atingido. O acesso às atividades está bloqueado.
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
        <h1 className="text-4xl font-bold tracking-tighter mb-8">Áreas de Estudo</h1>
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link to={`/activities/${subject.slug}`} key={subject.slug} className="group">
                <TiltCard className="flex flex-col h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">{subject.name}</CardTitle>
                    <div className="p-3 bg-secondary rounded-full transition-transform duration-300 group-hover:scale-110">
                      <Icon name={subject.icon} className={`h-12 w-12 ${iconColorClass[subject.color] || 'text-primary'}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {subject.availableActivitiesCount} {subject.availableActivitiesCount === 1 ? 'atividade disponível' : 'atividades disponíveis'}.
                    </p>
                    <div className="space-y-2 mb-4">
                      {subject.activitySamples.map(sample => (
                        <div key={sample} className="text-xs text-foreground/80 flex items-center">
                          <span className={`inline-block w-1.5 h-1.5 ${bgColorClass[subject.color] || 'bg-primary'} rounded-full mr-2`}></span>
                          {sample}
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className={`h-1 w-10 ${bgColorClass[subject.color] || 'bg-primary'} rounded-full mt-4 transition-all duration-300 group-hover:w-20`}></div>
                    </div>
                  </CardContent>
                </TiltCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-lg">
            <h2 className="text-2xl font-bold">Nenhuma área de estudo encontrada!</h2>
            <p className="text-muted-foreground mt-2">
              Não há atividades para esta faixa etária no momento. Tente selecionar outra faixa etária.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Activities;