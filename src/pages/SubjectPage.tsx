import { useParams, Link as RouterLink, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";
import { subjectsData } from "@/data/activitiesData";
import { useAge } from "@/context/AgeContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useProgress } from "@/hooks/use-progress";
import { Icon } from "@/components/Icon";
import { useScreenTime } from "@/hooks/use-screen-time";

const SubjectPage = () => {
  const { subject: subjectSlug } = useParams();
  const { ageGroup } = useAge();
  const { isLessonCompleted } = useProgress();
  const { isBlocked, limitMinutes } = useScreenTime();

  const subject = subjectsData.find(s => s.slug === subjectSlug);

  if (!subject) {
    return <Navigate to="/activities" replace />;
  }

  const filteredActivities = ageGroup
    ? subject.activities.filter(activity => activity.ageGroups.includes(ageGroup))
    : [];

  if (isBlocked) {
    return (
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
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <RouterLink to="/activities">
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
        <h1 className="text-4xl font-bold tracking-tighter">Atividades de {subject.name}</h1>
      </div>
      
      {filteredActivities.length > 0 ? (
        <Accordion type="multiple" defaultValue={filteredActivities.map(a => a.id)} className="w-full space-y-4">
          {filteredActivities.map(activity => (
            <AccordionItem value={activity.id} key={activity.id} className="glass-card px-6 rounded-2xl border-none">
              <AccordionTrigger className="text-2xl font-bold hover:no-underline">
                <div className="flex items-center gap-4">
                  <Icon name={activity.icon} className="h-8 w-8 text-primary" />
                  {activity.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <p className="text-muted-foreground mb-6">{activity.description}</p>
                <div className="space-y-3">
                  {activity.modules.flatMap(module => module.lessons.map(lesson => (
                    <RouterLink 
                      key={lesson.id} 
                      to={`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${lesson.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                        <div>
                          <h4 className="font-semibold text-lg">{lesson.title}</h4>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          )}
                        </div>
                        {isLessonCompleted(subject.slug, activity.id, module.id, lesson.id) && (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Concluído</span>
                          </div>
                        )}
                      </div>
                    </RouterLink>
                  )))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-16 glass-card rounded-lg">
          <h2 className="text-2xl font-bold">Nenhuma atividade encontrada!</h2>
          <p className="text-muted-foreground mt-2">
            Não há atividades de {subject.name} para esta faixa etária no momento.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubjectPage;