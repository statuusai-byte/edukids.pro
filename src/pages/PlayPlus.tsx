import { useMemo, useState, lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAge } from "@/context/AgeContext";
import { usePremium } from "@/context/PremiumContext";
import {
  playPlusGames,
  buildCatalogSummary,
  type PlayPlusGame,
} from "@/data/playPlusData";
import { Sparkles, Gamepad2, Lock, Star, Clock, ShieldCheck } from "lucide-react";

type GameComponentMap = Record<
  PlayPlusGame["component"],
  LazyExoticComponent<ComponentType>
>;

const gameComponentMap: GameComponentMap = {
  "memory-match": lazy(() => import("@/components/games/MemoryMatch")),
  "mission-math": lazy(() => import("@/components/games/MissionMath")),
};

const PlayPlus = () => {
  const { ageGroup } = useAge();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<PlayPlusGame | null>(null);

  const filteredGames = useMemo(
    () => playPlusGames.filter((game) => !ageGroup || game.ageGroups.includes(ageGroup)),
    [ageGroup],
  );

  const catalogSummary = useMemo(() => buildCatalogSummary(ageGroup ?? null), [ageGroup]);

  const handlePlayGame = (game: PlayPlusGame) => {
    if (game.premium && !isPremium) {
      navigate("/store");
      return;
    }
    setActiveGame(game);
  };

  if (!ageGroup) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">Escolha uma faixa etária para explorar o Play+</h1>
        <p className="mt-2 text-muted-foreground">
          Vá até as configurações ou use o seletor inicial para definir a idade da criança.
        </p>
        <Button className="mt-6" onClick={() => navigate("/settings")}>
          Abrir Configurações
        </Button>
      </div>
    );
  }

  const SelectedGameComponent = activeGame ? gameComponentMap[activeGame.component] : null;

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Play+ — Aprender brincando</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Jogos educativos pensados para a faixa <strong>{ageGroup}</strong>, testados para rodar suave em computadores modestos.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/store")}
            className="w-full sm:w-auto"
          >
            Ver planos e benefícios Premium
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Jogos</span>
              <strong className="text-3xl font-bold">{catalogSummary.totalGames}</strong>
              <span className="text-xs text-muted-foreground">Atividades interativas alinhadas à idade</span>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-400">Prontos</span>
              <strong className="text-3xl font-bold text-emerald-400">{catalogSummary.totalGames}</strong>
              <span className="text-xs text-muted-foreground">Carregamento sob demanda para poupar memória</span>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-400">Premium</span>
              <strong className="text-3xl font-bold text-yellow-400">{catalogSummary.totalPremium}</strong>
              <span className="text-xs text-muted-foreground">Experiências exclusivas para assinantes</span>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-sky-400">Destaques</span>
              <strong className="text-3xl font-bold text-sky-400">{catalogSummary.recommended}</strong>
              <span className="text-xs text-muted-foreground">Favoritos da comunidade EDUKIDS+</span>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Jogos interativos</h2>
            <p className="text-sm text-muted-foreground">
              Tudo foi revisado pelo time pedagógico. Sem vídeos externos, sem consumo extra de RAM desnecessário.
            </p>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            Ainda não temos jogos cadastrados para a faixa etária selecionada.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredGames.map((game) => {
              const canAccess = !game.premium || isPremium;

              return (
                <Card
                  key={game.id}
                  className="glass-card flex flex-col overflow-hidden border-white/10 transition hover:-translate-y-1"
                >
                  <div className="relative h-40 w-full">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        {game.difficulty}
                      </span>
                      {game.recommended && (
                        <span className="flex items-center gap-1 rounded-full bg-sky-400/90 px-3 py-1 text-xs font-semibold text-black">
                          <Star className="h-3 w-3" />
                          Recomendado
                        </span>
                      )}
                      <span className="flex items-center gap-1 rounded-full bg-emerald-400/85 px-3 py-1 text-xs font-semibold text-black">
                        <ShieldCheck className="h-3 w-3" />
                        Testado
                      </span>
                    </div>
                    {game.premium && !isPremium && (
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-yellow-400/90 px-3 py-1 text-xs font-semibold text-black">
                        <Lock className="h-3.5 w-3.5" />
                        Premium
                      </div>
                    )}
                  </div>

                  <CardHeader className="space-y-1">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                      {game.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{game.tagline}</p>
                  </CardHeader>

                  <CardContent className="flex flex-grow flex-col justify-between text-sm text-muted-foreground">
                    <p>{game.description}</p>
                    <ul className="mt-4 space-y-1 text-xs text-foreground/80">
                      {game.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-primary/80" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {game.estimatedTime} por sessão
                      </span>
                      <span>
                        Faixa ideal:{" "}
                        <strong className="text-foreground">{game.ageGroups.join(" • ")}</strong>
                      </span>
                    </div>
                    <Button
                      onClick={() => handlePlayGame(game)}
                      className="w-full"
                    >
                      {canAccess ? "Jogar agora" : "Assine para jogar"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Dialog open={!!activeGame} onOpenChange={(isOpen) => !isOpen && setActiveGame(null)}>
        <DialogContent className="sm:max-w-lg md:max-w-2xl glass-card p-0">
          {activeGame && (
            <>
              <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-2xl">{activeGame.title}</DialogTitle>
                <DialogDescription>{activeGame.tagline}</DialogDescription>
              </DialogHeader>
              <div className="p-6 pt-0">
                {SelectedGameComponent ? (
                  <Suspense
                    fallback={
                      <div className="flex h-40 items-center justify-center rounded-xl bg-secondary/50 text-sm text-muted-foreground">
                        Carregando jogo…
                      </div>
                    }
                  >
                    <SelectedGameComponent />
                  </Suspense>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-muted-foreground">
                    Esse jogo estará disponível em breve dentro do EDUKIDS+.
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayPlus;