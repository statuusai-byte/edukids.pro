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
import { useHintsContext } from "@/context/HintsContext";
import { HelpPackageContent } from "@/components/HelpPackageContent";

const LessonPage = () => {
  const { subject: subjectSlug, activityId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted, markLessonCompleted } = useProgress();
  const { isPremium } = usePremium();
  const { hints, useHint, addHints } = useHintsContext();
  
  const [showHelpContent, setShowHelpContent] = useState(false);

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

  const goNext = () => {
    setShowHelpContent(false);
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
    showSuccess("Você chegou ao fim desta atividade.");
  };

  const goPrev = () => {
    setShowHelpContent(false);
    const prevIndex = lessonIndex - 1;
    if (prevIndex >= 0) {
      const prev = module.lessons[prevIndex];
      navigate(`/activities/${subject.slug}/${activity.id}/modules/${module.id}/lessons/${prev.id}`);
      return;
    }
    navigate(`/activities/${subject.slug}/${activity.id}`);
  };

  const markCompleted = () => {
    markLessonCompleted(subject.slug, activity.id, module.id, lesson.id);
    showSuccess("Lição marcada como concluída.");
  };

  const handleUseHint = () => {
    if (showHelpContent) {
      setShowHelpContent(false);
      return;
    }
    
    if (isPremium) {
      setShowHelpContent(true);
      showSuccess("Dica de Assinante Premium ativada!");
      return;
    }
    if (hints > 0) {
      if (useHint()) {
        setShowHelpContent(true);
        showSuccess("Dica usada! Seu saldo foi atualizado.");
      }
    } else {
      showError("Você não tem dicas. Compre mais na loja ou assista a um anúncio para ganhar uma.");
    }
  };

  const renderLessonContent = () => {
    if (lesson.type === 'game') {
      if (lesson.title.includes("Contando")) return <ContandoFrutas />;
      if (lesson.title.includes("Formando") || lesson.title.includes("Montagem")) return <FormandoPalavras />;
      return <Card className="glass-card p-6"><CardTitle className="text-xl mb-4">Jogo Interativo</CardTitle><p className="text-muted-foreground">O jogo para esta lição está em desenvolvimento.</p></Card>;
    }
    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        if (questions.length > 0) return <QuizComponent questions={questions} onQuizComplete={markCompleted} />;
      } catch (e) { console.error("Failed to parse quiz content:", e); }
    }
    if (lesson.videoUrl) {
      return <div className="aspect-video rounded-2xl overflow-hidden border border-primary/50 shadow-lg shadow-primary/20"><iframe width="100%" height="100%" src={lesson.videoUrl} title={lesson.title} frameBorder="0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>;
    }
    return <p className="text-foreground/90 mb-4">{lesson.content}</p>;
  };

  const isQuiz = lesson.type === 'exercise' && lesson.content?.trim().startsWith('[');
  const isGame = lesson.type === 'game';
  const hasPrev = lessonIndex > 0 || moduleIndex > 0;
  const hasNext = (lessonIndex < module.lessons.length - 1) || (moduleIndex < activity.modules.length - 1);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon"><RouterLink to={`/activities/${subject.slug}/${activity.id}`}><ArrowLeft className="h-4 w-4" /></RouterLink></Button>
        <div><h1 className="text-2xl font-bold">{lesson.title}</h1><p className="text-muted-foreground">{activity.title} • {module.title}</p></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {showHelpContent && <HelpPackageContent subjectSlug={subject.slug} lesson={lesson} />}
          {renderLessonContent()}
          <div className="flex gap-4 mt-4 items-center">
            <Button variant="outline" onClick={goPrev} disabled={!hasPrev}>Anterior</Button>
            <Button onClick={goNext} disabled={!hasNext}>Próxima</Button>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button onClick={handleUseHint} className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {isPremium ? "Usar Dica Premium" : `Usar 1 Dica (Saldo: ${hints})`}
                </Button>
                {!isPremium && <RewardButton onReward={() => addHints(1)} label="Ganhar Dica (Anúncio)" />}
              </div>
              {(!isQuiz || isGame) && <Button className="bg-green-600 hover:bg-green-700" onClick={markCompleted}>{completed ? "Revisar (Concluído)" : "Marcar como Concluída"}</Button>}
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
  );
};

export default LessonPage;