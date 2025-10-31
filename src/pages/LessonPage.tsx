import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Lock, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContandoFrutas from "@/components/games/ContandoFrutas";
import FormandoPalavras from "@/components/games/FormandoPalavras";
import MemoryGame from "@/components/games/MemoryGame";
import QuizComponent, { QuizQuestion } from "@/components/QuizComponent";
import { useProgress } from "@/hooks/use-progress";
import { showSuccess, showError } from "@/utils/toast";
import { usePremium } from "@/context/PremiumContext";
import { useHintsContext } from "@/context/HintsContext";
import { useScreenTime } from "@/hooks/use-screen-time";
import PageTransition from "@/components/PageTransition";
import { useStudyAssistant } from "@/context/StudyAssistantContext";

const LessonPage = () => {
  const { subject: subjectSlug, activityId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted, markLessonCompleted } = useProgress();
  const { isPremium } = usePremium();
  const { hints } = useHintsContext();
  const { isBlocked, limitMinutes, startSession, stopSession } = useScreenTime();
  const { requestLessonHint } = useStudyAssistant();
  
  const [hintTriggered, setHintTriggered] = useState(false);
  const [quizCurrentQuestionIndex, setQuizCurrentQuestionIndex] = useState(0);

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

  useEffect(() => {
    if (lesson && !isBlocked) startSession();
    return () => stopSession();
  }, [lesson, isBlocked, startSession, stopSession]);

  useEffect(() => {
    setHintTriggered(false);
    setQuizCurrentQuestionIndex(0);
  }, [lessonId]);

  if (!subject || !activity || !module || !lesson) {
    return <PageTransition><div><h1>Lição não encontrada</h1></div></PageTransition>;
  }

  if (isBlocked) {
    return (
      <PageTransition>
        <div className="text-center py-16 glass-card rounded-lg">
          <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Tempo de Tela Esgotado</h2>
          <p className="text-muted-foreground mt-2">O limite de {limitMinutes} minutos foi atingido.</p>
          <RouterLink to="/dashboard" className="mt-4 inline-block text-primary underline">Ir para Painel dos Pais</RouterLink>
        </div>
      </PageTransition>
    );
  }

  const goNext = () => {
    const nextIndex = lessonIndex + 1;
    if (nextIndex < module.lessons.length) {
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${module.lessons[nextIndex].id}`);
      return;
    }
    showSuccess("Você chegou ao fim desta atividade.");
  };

  const markCompleted = () => {
    markLessonCompleted(subject.slug, activity.id, module.id, lesson.id);
    showSuccess("Lição marcada como concluída.");
  };

  const handleRequestLessonHint = useCallback(() => {
    let questionText = lesson.title;
    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        if (questions[quizCurrentQuestionIndex]) {
          questionText = questions[quizCurrentQuestionIndex].question;
        }
      } catch (e) { console.error("Failed to parse quiz content for hint:", e); }
    }
    requestLessonHint(questionText, () => setHintTriggered(true));
  }, [lesson, requestLessonHint, quizCurrentQuestionIndex]);

  const renderLessonContent = () => {
    if (lesson.type === 'game') {
      if (lesson.title.includes("Contando")) return <ContandoFrutas difficulty="easy" triggerHint={hintTriggered} />;
      if (lesson.title.includes("Formando")) return <FormandoPalavras difficulty="easy" triggerHint={hintTriggered} />;
      if (lesson.title.includes("Jogo da Memória")) return <MemoryGame difficulty="medium" />;
      return <Card className="glass-card p-6"><p>Jogo em desenvolvimento.</p></Card>;
    }
    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        return <QuizComponent 
          questions={questions} 
          onQuizComplete={markCompleted} 
          triggerHint={hintTriggered} 
          onHintSuggested={handleRequestLessonHint}
          onQuestionChange={setQuizCurrentQuestionIndex}
        />;
      } catch (e) { console.error("Failed to parse quiz content:", e); }
    }
    return (
      <Card className="glass-card p-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" />{lesson.title}</CardTitle></CardHeader>
        <CardContent><p className="whitespace-pre-wrap">{lesson.content}</p></CardContent>
      </Card>
    );
  };

  const isQuizOrGame = lesson.type === 'exercise' || lesson.type === 'game';

  return (
    <PageTransition>
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline" size="icon"><RouterLink to={`/activities/${subject.slug}`}><ArrowLeft className="h-4 w-4" /></RouterLink></Button>
          <div><h1 className="text-2xl font-bold">{lesson.title}</h1><p className="text-muted-foreground">{activity.title}</p></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderLessonContent()}
            <div className="flex gap-4 mt-4 items-center flex-wrap">
              <Button onClick={goNext} disabled={lessonIndex >= module.lessons.length - 1}>Próxima</Button>
              <div className="ml-auto flex items-center gap-4 flex-wrap justify-end">
                {isQuizOrGame && (
                  <Button onClick={handleRequestLessonHint} className="bg-yellow-600 hover:bg-yellow-700 text-black" disabled={hintTriggered}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {isPremium ? "Usar Dica Premium" : `Usar 1 Dica (Saldo: ${hints})`}
                  </Button>
                )}
                {!isQuizOrGame && <Button className="bg-green-600 hover:bg-green-700" onClick={markCompleted}>Marcar como Concluída</Button>}
              </div>
            </div>
          </div>
          <aside>
            <Card className="glass-card p-4">
              <CardHeader><CardTitle>Índice da Atividade</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {activity.modules.flatMap(m => m.lessons).map((l, idx) => (
                  <div key={l.id} className={`p-2 rounded-md ${l.id === lesson.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-white/5'}`}>
                    <RouterLink to={`/activities/${subject.slug}/${activity.id}/modules/${l.id.split('-')[0]}-mod${l.id.split('-')[1].substring(0,1)}/lessons/${l.id}`}>
                      <div className="font-medium">{idx + 1}. {l.title}</div>
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