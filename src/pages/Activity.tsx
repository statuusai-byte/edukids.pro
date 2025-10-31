import { useParams, useNavigate } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { ArrowLeft, BookOpen, ClipboardCheck, Gamepad2, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { showError } from "@/utils/toast";
import type { Lesson } from "@/data/activitiesData";
import { Icon } from "@/components/Icon"; // Corrigido: importação nomeada

const getLessonActionDetails = (type: Lesson['type']) => {
  switch (type) {
    case 'exercise':
      return { text: 'Praticar', icon: <ClipboardCheck className="ml-2 h-4 w-4" /> };
    case 'reading':
      return { text: 'Ler', icon: <BookOpen className="ml-2 h-4 w-4" /> };
    case 'game':
      return { text: 'Jogar', icon: <Gamepad2 className="ml-2 h-4 w-4" /> };
    case 'video':
      return { text: 'Assistir', icon: <Play className="ml-2 h-4 w-4" /> };
    default:
      return { text: 'Ver', icon: <Eye className="ml-2 h-4 w-4" /> };
  }
};

const ActivityPage = () => {
  const { slug, activityId } = useParams();
  const navigate = useNavigate();

  const subject = subjectsData.find((s) => s.slug === slug);
  const activity = subject?.activities.find((a) => a.id === activityId);

  if (!subject || !activity) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A atividade que você está procurando não foi encontrada.
        </p>
        <Button onClick={() => navigate("/activities")}>Voltar para Atividades</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <Button variant="ghost" onClick={() => navigate(`/activities/${slug}`)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para {subject.name}
      </Button>

      <Card className="mb-8 border-2" style={{ borderColor: `var(--${subject.color})` }}>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className={`rounded-lg p-3 bg-${subject.color}-500/20`}>
            <Icon name={activity.icon} className={`h-8 w-8 text-${subject.color}-500`} />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">{activity.title}</CardTitle>
            <CardDescription className="text-lg">{activity.description}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Módulos de Aprendizagem</h2>
      
      {activity.modules.length > 0 ? (
        <Accordion type="single" collapsible defaultValue={activity.modules[0].id} className="w-full">
          {activity.modules.map((module) => (
            <AccordionItem value={module.id} key={module.id}>
              <AccordionTrigger className="text-xl font-medium">{module.title}</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 pt-4">
                  {module.lessons.map((lesson) => {
                    const { text, icon } = getLessonActionDetails(lesson.type);
                    const isAvailable = lesson.content || lesson.videoUrl;

                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                      >
                        <div>
                          <h4 className="font-semibold text-lg">{lesson.title}</h4>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => {
                            if (isAvailable) {
                              navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${lesson.id}`);
                            } else {
                              showError("Conteúdo indisponível no momento.");
                            }
                          }}
                          disabled={!isAvailable}
                          size="sm"
                        >
                          {text}
                          {icon}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-muted-foreground">Nenhum módulo disponível para esta atividade ainda.</p>
      )}
    </div>
  );
};

export default ActivityPage;