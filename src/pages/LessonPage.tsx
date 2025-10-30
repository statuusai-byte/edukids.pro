import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContandoFrutas from "@/components/games/ContandoFrutas";
import FormandoPalavras from "@/components/games/FormandoPalavras";
import QuizComponent, { QuizQuestion } from "@/components/QuizComponent";
import { useProgress } from "@/hooks/use-progress";
import RewardButton from "@/components/RewardButton";
import { showSuccess, showError } from "@/utils/toast";
import { usePremium } from "@/context/PremiumContext";
import { useHintsContext } from "@/context/HintsContext";
import VideoPlayer from "@/components/VideoPlayer";
import { useScreenTime } from "@/hooks/use-screen-time";
import PageTransition from "@/components/PageTransition";
import { useStudyAssistant } from "@/context/StudyAssistantContext"; // Import useStudyAssistant

const LessonPage = () => {
  const { subject: subjectSlug, activityId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted, markLessonCompleted } = useProgress();
  const { isPremium } = usePremium();
  const { hints, addHints } = useHintsContext(); // Removed useHint
  const { isBlocked, limitMinutes, startSession, stopSession } = useScreenTime();
  const { requestLessonHint } = useStudyAssistant(); // Use the study assistant context
  
  const [hintTriggered, setHintTriggered] = useState(false);
  // Removed quizHintSuggested as it was not directly read in this component

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
    return { subject: s, activity: a, module: m, lesson: l, lessonIndex: li, moduleIndex: li };
  }, [subjectSlug, activityId, moduleId, lessonId]);

  // Screen Time Tracking: Start session when entering lesson, stop when leaving
  useEffect(() => {
    if (lesson && !isBlocked) {
      startSession();
    }
    return () => {
      stopSession();
    };
  }, [lesson, isBlocked, startSession, stopSession]);

  // Reset hint trigger when the lesson changes
  useEffect(() => {
    setHintTriggered(false);
    // setQuizHintSuggested(false); // Removed as quizHintSuggested is removed
  }, [lessonId]);

  if (!subject || !activity || !module || !lesson) {
    return (
      <PageTransition>
        <div>
          <h1 className="text-2xl font-bold">Lição não encontrada</h1>
          <Button asChild variant="link">
            <RouterLink to={`/activities/${subjectSlug}/${activityId}`}>Voltar para Atividade</RouterLink>
          </Button>
        </div>
      </PageTransition>
    );
  }

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
          <RouterLink to="/dashboard" className="mt-4 inline-block text-primary underline">Ir para Painel dos Pais</RouterLink>
        </div>
      </PageTransition>
    );
  }

  const completed = isLessonCompleted(subject.slug, activity.id, module.id, lesson.id);

  const goNext = () => {
    const nextIndex = lessonIndex + 1;
    if (nextIndex < module.lessons.length) {
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${module.lessons[nextIndex].id}`);
      return;
    }
    const nextModuleIndex = moduleIndex + 1;
    if (nextModuleIndex < activity.modules.length) {
      const nextModule = activity.modules[nextModuleIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${nextModule.id}/lessons/${nextModule.lessons[0].id}`);
      return;
    }
    showSuccess("Você chegou ao fim desta atividade.");
  };

  const goPrev = () => {
    const prevIndex = lessonIndex - 1;
    if (prevIndex >= 0) {
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${module.lessons[prevIndex].id}`);
      return;
    }
    navigate(`/activities/${subject.slug}/${activity.id}`);
  };

  const markCompleted = () => {
    markLessonCompleted(subject.slug, activity.id, module.id, lesson.id);
    showSuccess("Lição marcada como concluída.");
  };

  const handleRequestLessonHint = useCallback(() => {
    let questionText = lesson.title; // Default to lesson title
    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        if (questions.length > 0) {
          // For quizzes, use the current question text
          questionText = questions[0].question; // Assuming QuizComponent handles current question internally
        }
      } catch (e) {
        console.error("Failed to parse quiz content for hint:", e);
      }
    }
    // For games, we might need more specific logic if the game has dynamic questions
    // For now, lesson.title is a good fallback.

    requestLessonHint(questionText, () => {
      setHintTriggered(true);
      // setQuizHintSuggested(false); // Removed as quizHintSuggested is removed
    });
  }, [lesson, requestLessonHint]);

  const handleQuizHintSuggested = useCallback(() => {
    // setQuizHintSuggested(true); // Removed as quizHintSuggested is removed
  }, []);

  const renderLessonContent = () => {
    if (lesson.type === 'game') {
      if (lesson.title.includes("Contando")) return <ContandoFrutas triggerHint={hintTriggered} />;
      if (lesson.title.includes("Formando") || lesson.title.includes("Montagem")) return <FormandoPalavras triggerHint={hintTriggered} />;
      return <Card className="glass-card p-6"><CardTitle className="text-xl mb-4">Jogo Interativo</CardTitle><p className="text-muted-foreground">O jogo para esta lição está em desenvolvimento.</p></Card>;
    }
    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        if (questions.length > 0) return <QuizComponent questions={questions} onQuizComplete={markCompleted} triggerHint={hintTriggered} onHintSuggested={handleQuizHintSuggested} />;
      } catch (e) { console.error("Failed to parse quiz content:", e); }
    }
    if (lesson.videoUrl) {
      return <VideoPlayer src={lesson.videoUrl} title={lesson.title} />;
    }
    return <p className="text-foreground/90 mb-4">{lesson.content}</p>;
  };

  const isQuizOrGame = (lesson.type === 'exercise' && lesson.content?.trim().startsWith('[')) || lesson.type === 'game';
  const hasPrev = lessonIndex > 0 || moduleIndex > 0;
  const hasNext = (lessonIndex < module.lessons.length - 1) || (moduleIndex < activity.modules.length - 1);

  return (
    <PageTransition>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="icon"><RouterLink to={`/activities/${subject.slug}/${activity.id}`}><ArrowLeft className="h-4 w-4" /></RouterLink></Button>
          <div><h1 className="text-2xl font-bold">{lesson.title}</h1><p className="text-muted-foreground">{activity.title} • {module.title}</p></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderLessonContent()}
            <div className="flex gap-4 mt-4 items-center flex-wrap">
              <Button variant="outline" onClick={goPrev} disabled={!hasPrev}>Anterior</Button>
              <Button onClick={goNext} disabled={!hasNext}>Próxima</Button>
              <div className="ml-auto flex items-center gap-4 flex-wrap justify-end">
                {isQuizOrGame && (
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* Dedicated hint button for the lesson */}
                    <Button onClick={handleRequestLessonHint} className="bg-yellow-600 hover:bg-yellow-700 text-black" disabled={hintTriggered}>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      {isPremium ? "Pedir Dica Premium" : `Pedir Dica (Saldo: ${hints})`}
                    </Button>
                    {!isPremium && hints <= 0 && (
                      <Button onClick={() => showError("Você está sem dicas! Compre mais na loja ou assista a um vídeo para ganhar uma.")} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Obter Dica
                      </Button>
                    )}
                    {!isPremium && hints > 0 && <RewardButton onReward={() => addHints(1)} label="Ganhar Dica (Anúncio)" />}
                  </div>
                )}
                {!isQuizOrGame && <Button className="bg-green-600 hover:bg-green-700" onClick={markCompleted}>{completed ? "Revisar (Concluído)" : "Marcar como Concluída"}</Button>}
              </div>
            </div>
          </div>
          <aside>
            <Card className="glass-card p-4">
              <CardHeader><CardTitle>Índice da Pasta</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {module.lessons.map((l, idx) => (
                  <div key={l.id} className={`p-2 rounded-md ${l.id === lesson.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5'}`}>
                    <RouterLink to={`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${l.id}`}>
                      <div className="flex items-center justify-between">
                        <div><div className="font-medium">{idx + 1}. {l.title}</div><div className="text-xs text-muted-foreground">{l.description}</div></div>
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
    </PageTransition>
  );
};

export default LessonPage;