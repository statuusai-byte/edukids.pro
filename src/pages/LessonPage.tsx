import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContandoFrutas from "@/components/games/ContandoFrutas";
import FormandoPalavras from "@/components/games/FormandoPalavras";
import QuizComponent, { QuizQuestion } from "@/components/QuizComponent";
import { useProgress } from "@/hooks/use-progress";
import RewardButton from "@/components/RewardButton";
import { showSuccess, showError } from "@/utils/toast";
import { usePremium } from "@/context/PremiumContext";
import { useHelpPackages } from "@/hooks/useHelpPackages";
import { HelpPackageContent } from "@/components/HelpPackageContent";

const LessonPage = () => {
  const { subject: subjectSlug, activityId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted, markLessonCompleted } = useProgress();
  const { isPremium } = usePremium();
  const { hasPackage } = useHelpPackages();
  
  const [hintsAvailable, setHintsAvailable] = useState(0); // Estado para gerenciar dicas
  const [showHelpContent, setShowHelpContent] = useState(false); // Estado para mostrar o conteúdo do pacote

  const { subject, activity, module, lesson, lessonIndex, moduleIndex } = useMemo(() => {
    const s = subjectsData.find(sub => sub.slug === subjectSlug);
    if (!s) return { subject: null, activity: null, module: null, lesson: null, lessonIndex: -1, moduleIndex: -1 };
    const a = s.activities.find(act => act.id === activityId);
    if (!a) return { subject: s, activity: null, module: null, lesson: null, lessonIndex: -1, moduleIndex: -1 };
    const mi = a.modules.findIndex(m => m.id === moduleId);
    const m = mi >= 0 ? a.modules[mi] : null;
    if (!m) return { subject: s, activity: a, module: null, lesson: null, lessonIndex: -1, moduleIndex: mi };
    const li = m.lessons.findIndex(l => l.id === lessonId);
    const l = li >= 0 ? m.lessons[li] : null;
    return { subject: s, activity: a, module: m, lesson: l, lessonIndex: li, moduleIndex: mi };
  }, [subjectSlug, activityId, moduleId, lessonId]);

  if (!subject || !activity || !module || !lesson) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Lição não encontrada</h1>
        <Button asChild variant="link">
          <RouterLink to={`/activities/${subjectSlug}/${activityId}`}>Voltar para Atividade</RouterLink>
        </Button>
      </div>
    );
  }

  const completed = isLessonCompleted(subject.slug, activity.id, module.id, lesson.id);
  const hasHelpAccess = hasPackage(subject.slug, isPremium);

  const goNext = () => {
    // Next lesson in the same module
    const nextIndex = lessonIndex + 1;
    if (nextIndex < module.lessons.length) {
      const next = module.lessons[nextIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${next.id}`);
      return;
    }

    // Move to the next module's first lesson
    const nextModuleIndex = moduleIndex + 1;
    if (nextModuleIndex < activity.modules.length) {
      const nextModule = activity.modules[nextModuleIndex];
      const nextLesson = nextModule.lessons[0];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${nextModule.id}/lessons/${nextLesson.id}`);
      return;
    }

    // If nothing left, stay and maybe show a message (for now we just stay)
  };

  const goPrev = () => {
    const prevIndex = lessonIndex - 1;
    if (prevIndex >= 0) {
      const prev = module.lessons[prevIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${prev.id}`);
      return;
    }

    // go back to activity page
    navigate(`/activities/${subject.slug}/${activity.id}`);
  };

  const markCompleted = () => {
    markLessonCompleted(subject.slug, activity.id, module.id, lesson.id);

    // Automatically navigate to next after marking complete (if exists)
    const nextIndex = lessonIndex + 1;
    if (nextIndex < module.lessons.length) {
      const next = module.lessons[nextIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${next.id}`);
      return;
    }

    const nextModuleIndex = moduleIndex + 1;
    if (nextModuleIndex < activity.modules.length) {
      const nextModule = activity.modules[nextModuleIndex];
      const nextLesson = nextModule.lessons[0];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${nextModule.id}/lessons/${nextLesson.id}`);
      return;
    }

    // If no next, remain on current (user finished the activity)
  };

  const handleReward = () => {
    setHintsAvailable(prev => prev + 1);
  };

  const handleUseHint = () => {
    if (hasHelpAccess) {
      // Se tiver acesso ao pacote, mostra o conteúdo da ajuda
      setShowHelpContent(true);
      showSuccess(`Pacote de Ajuda de ${subject.name} ativado!`);
    } else if (hintsAvailable > 0) {
      // Se não tiver acesso ao pacote, mas tiver dicas de anúncio
      setHintsAvailable(prev => prev - 1);
      showSuccess("Dica de anúncio usada! Pense bem na sua próxima resposta.");
      // Aqui você implementaria a lógica real da dica (ex: revelar uma letra, eliminar uma opção)
    } else {
      showError(`Você precisa do Pacote de Ajuda de ${subject.name} ou de uma Dica de Anúncio.`);
    }
  };

  const renderLessonContent = () => {
    if (lesson.type === 'game') {
      if (activity.id === 'm1') {
        return <ContandoFrutas />;
      }
      if (activity.id === 'p2') {
        return <FormandoPalavras />;
      }
      return <p className="text-muted-foreground">Jogo interativo em desenvolvimento.</p>;
    }

    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        if (questions.length > 0) {
          return <QuizComponent questions={questions} onQuizComplete={markCompleted} />;
        }
      } catch (e) {
        console.error("Failed to parse quiz content:", e);
        // Fallback to display raw content if JSON parsing fails
        return <p className="text-foreground/90 mb-4">{lesson.content}</p>;
      }
    }

    if (lesson.videoUrl) {
      return (
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
      );
    }

    return (
      <p className="text-foreground/90 mb-4">{lesson.content}</p>
    );
  };

  // Se for um quiz, o botão de 'Marcar como Concluída' será gerenciado pelo QuizComponent.
  const isQuiz = lesson.type === 'exercise' && lesson.content && lesson.content.startsWith('[');

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
          <p className="text-muted-foreground">{activity.title} • {module.title}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          
          {/* Exibir Conteúdo de Ajuda se ativado */}
          {showHelpContent && (
            <HelpPackageContent subjectSlug={subject.slug} lessonTitle={lesson.title} />
          )}

          {renderLessonContent()}

          <div className="flex gap-4 mt-4 items-center">
            <Button variant="outline" onClick={goPrev}>Anterior</Button>
            <Button onClick={goNext}>Próxima</Button>
            
            <div className="ml-auto flex items-center gap-4">
              {/* Botão de Dica/Ajuda */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleUseHint} 
                  variant={hasHelpAccess ? "default" : "secondary"}
                  className={hasHelpAccess ? "bg-yellow-600 hover:bg-yellow-700 text-black" : "bg-primary/20 text-primary hover:bg-primary/30"}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {hasHelpAccess ? `Ajuda ${subject.name}` : `Dica (${hintsAvailable})`}
                </Button>
                
                {!hasHelpAccess && (
                  <RewardButton 
                    onReward={handleReward} 
                    label="Ganhar Dica (Anúncio)" 
                  />
                )}
              </div>

              {!isQuiz && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={markCompleted}>
                  {completed ? "Revisar (Concluído)" : "Marcar como Concluída"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside>
          <Card className="glass-card p-4">
            <CardHeader>
              <CardTitle>Índice da Pasta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {module.lessons.map((l, idx) => (
                <div key={l.id} className={`p-2 rounded-md ${l.id === lesson.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5'}`}>
                  <RouterLink to={`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${l.id}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{idx + 1}. {l.title}</div>
                        <div className="text-xs text-muted-foreground">{l.description}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{isLessonCompleted(subject.slug, activity.id, module.id, l.id) ? 'Concluída' : 'Aberta'}</div>
                    </div>
                  </RouterLink>
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