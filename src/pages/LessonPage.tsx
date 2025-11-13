import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { subjectsData } from "@/data/activitiesData";
import { useMemo, useState, useEffect, useCallback, lazy, Suspense, ComponentType, LazyExoticComponent } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lightbulb, Lock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuizComponent, { QuizQuestion } from "@/components/QuizComponent";
import { useProgress } from "@/hooks/use-progress";
import RewardButton from "@/components/RewardButton";
import { showSuccess, showError } from "@/utils/toast";
import { usePremium } from "@/context/PremiumContext";
import { useHintsContext } from "@/context/HintsContext";
import { useScreenTime } from "@/hooks/use-screen-time";
import LocalErrorBoundary from "@/components/LocalErrorBoundary";
import { cn } from "@/lib/utils";
import DOMPurify from 'dompurify';
import { supabase } from "@/integrations/supabase/client"; // NEW: fetch premium content server-side

// Lazy load game components for better performance
const gameComponentMap: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  ContandoFrutas: lazy(() => import("@/components/games/ContandoFrutas")),
  FormandoPalavras: lazy(() => import("@/components/games/FormandoPalavras")),
};

const LessonPage = () => {
  const { subject: subjectSlug, activityId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted, markLessonCompleted } = useProgress();
  const { isPremium } = usePremium();
  const { hints, useHint, addHints } = useHintsContext();
  const { isBlocked, limitMinutes, startSession, stopSession } = useScreenTime();
  
  const [hintTriggered, setHintTriggered] = useState(false);
  // key to force remount of lazy game components on retry
  const [gameResetKey, setGameResetKey] = useState(0);

  // New state for premium content fetch
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [premiumFetchError, setPremiumFetchError] = useState<string | null>(null);
  const [premiumJson, setPremiumJson] = useState<any | null>(null);
  const [premiumHtml, setPremiumHtml] = useState<string | null>(null);

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
    if (lesson && !isBlocked) {
      startSession();
    }
    return () => {
      stopSession();
    };
  }, [lesson, isBlocked, startSession, stopSession]);

  useEffect(() => {
    setHintTriggered(false);
    // clear premium content state when lesson changes
    setPremiumJson(null);
    setPremiumHtml(null);
    setPremiumFetchError(null);
  }, [lessonId]);

  // Fetch premium content if lesson is premium
  useEffect(() => {
    if (!lesson || !lesson.premium) return;

    let mounted = true;
    const fetchPremium = async () => {
      setIsPremiumLoading(true);
      setPremiumFetchError(null);
      try {
        // Build the same key used by progress sync: subject::activity::module::lesson
        const lessonKey = `${subject?.slug ?? ""}::${activityId}::${moduleId}::${lessonId}`;

        const { data, error } = await supabase
          .from('premium_content')
          .select('content_json, content_html')
          .eq('lesson_key', lessonKey)
          .single();

        if (!mounted) return;

        if (error) {
          // If error arises because of RLS (not premium or unauthenticated), surface a friendly message
          console.error("Failed to fetch premium content:", error);
          setPremiumFetchError("Conteúdo Premium indisponível. Faça login e assine para acessar.");
          setPremiumJson(null);
          setPremiumHtml(null);
          setIsPremiumLoading(false);
          return;
        }

        if (!data) {
          setPremiumFetchError("Conteúdo Premium não encontrado. Tente novamente mais tarde.");
          setIsPremiumLoading(false);
          return;
        }

        // content_json is used for structured exercises/quizzes; content_html for reading lessons.
        setPremiumJson(data.content_json ?? null);
        setPremiumHtml(data.content_html ?? null);
        setIsPremiumLoading(false);
      } catch (e) {
        console.error("Unexpected error fetching premium content:", e);
        setPremiumFetchError("Erro ao carregar conteúdo Premium. Tente novamente mais tarde.");
        setIsPremiumLoading(false);
      }
    };

    fetchPremium();

    return () => { mounted = false; };
  }, [lesson, subject?.slug, activityId, moduleId, lessonId]);

  if (!subject || !activity || !module || !lesson) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Lição não encontrada</h1>
        <Button asChild variant="link">
          <RouterLink to={`/activities/${subjectSlug}`}>Voltar para Atividades</RouterLink>
        </Button>
      </div>
    );
  }

  if (lesson.premium && !isPremium && !premiumFetchError) {
    // If user is not premium and we have no explicit fetch error from the server yet,
    // show a brief loading state while server denies access; otherwise show locked message.
    if (isPremiumLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card p-8 text-center">
            <Sparkles className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <div>Carregando conteúdo Premium...</div>
          </div>
        </div>
      );
    }
    // If not premium and fetch didn't return data, show locked card (fetch error will be set after attempt)
  }

  if (lesson.premium && premiumFetchError) {
    // Show a friendly locked view (user may be unauthenticated or not premium).
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-xl glass-card p-8 text-center">
          <Lock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Conteúdo Premium</h1>
          <p className="text-muted-foreground mb-4">
            {premiumFetchError}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Button onClick={() => navigate('/store')} className="bg-yellow-400 text-black">
              Assinar Premium
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Entrar / Criar Conta
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Assinantes têm acesso a exercícios avançados, lições extras e dicas ilimitadas.
          </p>
        </div>
      </div>
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
    navigate(`/activities/${subject.slug}`);
  };

  const markCompleted = () => {
    markLessonCompleted(subject.slug, activity.id, module.id, lesson.id);
    showSuccess("Lição marcada como concluída.");
  };

  const handleUseHint = useCallback(async () => {
    if (isPremium) {
      setHintTriggered(true);
      showSuccess("Dica de Assinante Premium ativada!");
      return;
    }
    if (hints > 0) {
      const hintUsedSuccessfully = await useHint();
      if (hintUsedSuccessfully) {
        setHintTriggered(true);
        showSuccess("Dica usada! Seu saldo foi atualizado.");
        return;
      }
    }
    showError("Você não tem dicas. Compre mais na loja ou assista a um anúncio para ganhar uma.");
  }, [isPremium, hints, useHint]);

  const renderLessonContent = () => {
    // PREMIUM lesson -> prefer database content that was fetched
    if (lesson.premium) {
      if (isPremiumLoading) {
        return (
          <div className="flex h-40 items-center justify-center">
            <Sparkles className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      }

      if (premiumJson) {
        // premiumJson expected to be an array of QuizQuestion objects
        try {
          const questions: QuizQuestion[] = premiumJson as QuizQuestion[];
          if (questions.length > 0) {
            return (
              <QuizComponent
                questions={questions}
                onQuizComplete={markCompleted}
                triggerHint={hintTriggered}
                onRequestHint={handleUseHint}
              />
            );
          }
          return (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold">Conteúdo Premium indisponível</h3>
              <p className="text-sm text-muted-foreground mt-2">O conteúdo desta lição não contém perguntas no momento.</p>
            </div>
          );
        } catch (e) {
          console.error("Failed to parse premium JSON content:", e);
          return (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold">Erro ao carregar conteúdo</h3>
              <p className="text-sm text-muted-foreground mt-2">Não foi possível carregar as perguntas desta lição. Tente recarregar ou volte mais tarde.</p>
            </div>
          );
        }
      }

      if (premiumHtml) {
        const cleanHtml = DOMPurify.sanitize(premiumHtml);
        return (
          <Card className="glass-card p-6">
            <CardContent>
              <div className={cn("prose prose-invert max-w-none", "prose-p:text-foreground/90 prose-strong:text-primary prose-li:text-foreground/90 prose-ul:list-disc prose-ul:pl-5")}>
                <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
              </div>
            </CardContent>
          </Card>
        );
      }

      // If premium and we have neither JSON nor HTML (but no explicit error), show placeholder
      return (
        <div className="glass-card p-6 text-center">
          <h3 className="text-xl font-semibold">Carregando conteúdo Premium...</h3>
        </div>
      );
    }

    // Non-premium logic remains unchanged:
    if (lesson.type === 'game' && lesson.component) {
      const GameComponent = gameComponentMap[lesson.component];
      if (GameComponent) {
        return (
          <LocalErrorBoundary key={gameResetKey} onReset={() => setGameResetKey(k => k + 1)}>
            <Suspense fallback={<div className="flex h-40 items-center justify-center"><Sparkles className="h-8 w-8 animate-spin text-primary" /></div>}>
              <GameComponent triggerHint={hintTriggered} />
            </Suspense>
          </LocalErrorBoundary>
        );
      }
    }
    if (lesson.type === 'exercise' && lesson.content) {
      try {
        const questions: QuizQuestion[] = JSON.parse(lesson.content);
        if (questions.length > 0) {
          return (
            <QuizComponent
              questions={questions}
              onQuizComplete={markCompleted}
              triggerHint={hintTriggered}
              onRequestHint={handleUseHint}
            />
          );
        } else {
          return (
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold">Conteúdo indisponível</h3>
              <p className="text-sm text-muted-foreground mt-2">
                O quiz foi carregado, mas não contém perguntas. Tente recarregar ou volte mais tarde.
              </p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => window.location.reload()}>Recarregar</Button>
                <Button variant="outline" onClick={() => navigate(`/activities/${subject.slug}`)}>Voltar</Button>
              </div>
            </div>
          );
        }
      } catch (e) { 
        console.error("Failed to parse quiz content:", e);
        return (
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold">Conteúdo indisponível</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Não foi possível carregar as perguntas desta lição. Tente recarregar ou volte mais tarde.
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => window.location.reload()}>Recarregar</Button>
              <Button variant="outline" onClick={() => navigate(`/activities/${subject.slug}`)}>Voltar</Button>
            </div>
          </div>
        );
      }
    }
    
    // Handle 'reading' type content
    if (lesson.type === 'reading' && lesson.content) {
      const cleanHtml = DOMPurify.sanitize(lesson.content);
      return (
        <Card className="glass-card p-6">
          <CardContent>
            <div className={cn("prose prose-invert max-w-none", "prose-p:text-foreground/90 prose-strong:text-primary prose-li:text-foreground/90 prose-ul:list-disc prose-ul:pl-5")}>
              <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
            </div>
          </CardContent>
        </Card>
      );
    }

    // Fallback for empty content
    return (
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold">Conteúdo em construção</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Esta lição de leitura ainda não tem conteúdo. Volte mais tarde!
        </p>
      </div>
    );
  };

  const isInteractive = lesson.type === 'game' || lesson.type === 'exercise';
  const hasPrev = lessonIndex > 0 || moduleIndex > 0;
  const hasNext = (lessonIndex < module.lessons.length - 1) || (moduleIndex < activity.modules.length - 1);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="icon"><RouterLink to={`/activities/${subject.slug}`}><ArrowLeft className="h-4 w-4" /></RouterLink></Button>
        <div><h1 className="text-2xl font-bold">{lesson.title}</h1><p className="text-muted-foreground">{activity.title} • {module.title}</p></div>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderLessonContent()}
          <div className="flex gap-4 mt-4 items-center">
            <Button variant="outline" onClick={goPrev} disabled={!hasPrev}>Anterior</Button>
            <Button onClick={goNext} disabled={!hasNext}>Próxima</Button>
            <div className="ml-auto flex items-center gap-4">
              {isInteractive && (
                <div className="flex items-center gap-2">
                  <Button onClick={handleUseHint} className="bg-yellow-600 hover:bg-yellow-700 text-black" disabled={hintTriggered}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {isPremium ? "Usar Dica Premium" : `Usar 1 Dica (Saldo: ${hints})`}
                  </Button>
                  {!isPremium && (
                    <RewardButton onReward={() => addHints(1)} label="Ganhar Dica (Anúncio)" />
                  )}
                </div>
              )}
              {!isInteractive && <Button className="bg-green-600 hover:bg-green-700" onClick={markCompleted}>{completed ? "Revisar (Concluído)" : "Marcar como Concluída"}</Button>}
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