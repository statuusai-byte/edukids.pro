import {
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { playPlusGames, type PlayPlusGame } from "@/data/playPlusData";
import { Sparkles, ArrowLeft, Clock, Star, ShieldCheck, Lock } from "lucide-react";
import { usePremium } from "@/context/PremiumContext";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

type GameComponentMap = Record<
  PlayPlusGame["component"],
  LazyExoticComponent<ComponentType>
>;

const gameComponentMap: GameComponentMap = {
  "memory-match": lazy(() => import("@/components/games/MemoryMatch")),
  "mission-math": lazy(() => import("@/components/games/MissionMath")),
  "contando-frutas": lazy(() => import("@/components/games/ContandoFrutas")),
  "formando-palavras": lazy(() => import("@/components/games/FormandoPalavras")),
};

const FloatingBubble = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute h-24 w-24 rounded-full border border-white/10 bg-white/10 blur-md"
    style={{
      top: `${20 + delay * 15}%`,
      left: `${20 + delay * 20}%`,
    }}
    animate={{
      y: [0, -18, 0],
      x: [0, 12, 0],
    }}
    transition={{
      duration: 12,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const AnimatedBackdrop = ({ reduceMotion }: { reduceMotion: boolean }) => {
  if (reduceMotion) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.4),transparent_60%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),transparent_55%),#050312]" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.35),transparent_60%),radial-gradient(circle_at_bottom,_rgba(250,204,21,0.3),transparent_55%),linear-gradient(135deg,_rgba(99,102,241,0.55),_rgba(244,114,182,0.45)_40%,_rgba(34,197,94,0.35)_80%)]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          filter: ["hue-rotate(0deg)", "hue-rotate(25deg)", "hue-rotate(0deg)"],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      {[0.2, 0.55, 0.85].map((delay) => (
        <FloatingBubble key={delay} delay={delay} />
      ))}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 via-transparent to-transparent"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const GameInfoCard = ({ game }: { game: PlayPlusGame }) => (
  <Card className="glass-card border-2 border-white/20 bg-white/15 backdrop-blur-3xl shadow-[0_25px_45px_rgba(79,70,229,0.45)]">
    <CardHeader className="space-y-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary-foreground">
        <Sparkles className="h-4 w-4 text-yellow-300" />
        Especial Play+
      </div>
      <CardTitle className="text-3xl font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
        {game.title}
      </CardTitle>
      <p className="text-sm text-white/80">{game.tagline}</p>
    </CardHeader>
    <CardContent className="space-y-6 text-white/85">
      <div className="space-y-4 text-sm leading-relaxed">
        <p>{game.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/75">
          <span className="flex items-center gap-1 rounded-full bg-black/25 px-3 py-1">
            <Clock className="h-3.5 w-3.5 text-sky-200" />
            Sessões de {game.estimatedTime}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/25 px-3 py-1">
            <Star className="h-3.5 w-3.5 text-yellow-200" />
            Dificuldade {game.difficulty.toLowerCase()}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/25 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
            Conteúdo validado
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-[0.35em] text-white/50">Superpoderes</h3>
        <ul className="space-y-2 text-sm">
          {game.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

const PlayPlusGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const reduceMotion = usePrefersReducedMotion();

  const game = useMemo(() => playPlusGames.find((g) => g.id === gameId), [gameId]);

  if (!game) {
    navigate("/play-plus", { replace: true });
    return null;
  }

  const GameContent = gameComponentMap[game.component];
  const isLocked = game.premium && !isPremium;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden rounded-3xl lg:min-h-[calc(100vh-6rem)]">
      <AnimatedBackdrop reduceMotion={reduceMotion} />
      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="flex-1 space-y-6">
            <Button
              onClick={() => navigate("/play-plus")}
              variant="outline"
              size="lg"
              className="w-fit border-white/30 bg-black/40 text-white hover:bg-black/60"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Escolher outro jogo
            </Button>
            <motion.div
              className="relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-[0_20px_60px_rgba(30,64,175,0.45)]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={game.coverImage}
                alt={game.title}
                className="h-64 w-full object-cover md:h-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/40" />
              <div className="absolute bottom-6 left-6 flex flex-col gap-2 text-white drop-shadow">
                <span className="text-xs uppercase tracking-[0.35em] text-white/80">
                  {game.premium ? "Aventura Premium" : "Aventura Free"}
                </span>
                <h1 className="text-3xl font-black md:text-4xl">{game.title}</h1>
                <p className="max-w-xl text-sm text-white/80">{game.tagline}</p>
              </div>
            </motion.div>
          </div>

          <div className="w-full max-w-md">
            <GameInfoCard game={game} />
          </div>
        </div>

        <motion.div
          className="mt-8 flex-1 rounded-3xl border-2 border-white/15 bg-black/30 p-4 shadow-[0_18px_45px_rgba(30,64,175,0.35)] md:p-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {isLocked ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-white">
              <motion.div
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-200/60 bg-yellow-300/25"
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lock className="h-9 w-9 text-yellow-200" />
              </motion.div>
              <h2 className="text-3xl font-black">Conteúdo Premium</h2>
              <p className="max-w-sm text-sm text-white/85">
                Esta aventura é exclusiva para assinantes EDUKIDS+. Em breve, o plano Premium também
                contará com uma IA de voz de alta qualidade para guiar os estudos.
              </p>
              <Button
                onClick={() => navigate("/store")}
                className="bg-yellow-300 text-black hover:bg-yellow-200"
              >
                Conferir planos Premium
              </Button>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/30 bg-white/5 text-sm text-white/80">
                  Carregando jogo…
                </div>
              }
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-white/12 via-white/6 to-white/10 p-4 md:p-6">
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/15" />
                <div className="pointer-events-none absolute -top-16 right-10 h-32 w-32 rounded-full bg-white/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-amber-200/35 blur-3xl" />
                <GameContent />
              </div>
            </Suspense>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PlayPlusGame;