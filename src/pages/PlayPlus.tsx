import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAge } from "@/context/AgeContext";
import { usePremium } from "@/context/PremiumContext";
import {
  playPlusGames,
  playPlusVideos,
  buildCatalogSummary,
  isGamePlayableNow,
  type PlayPlusGame,
  type PlayPlusVideo,
} from "@/data/playPlusData";
import { Sparkles, Gamepad2, Lock, Clock, Star, PlayCircle, ExternalLink } from "lucide-react";
import ContandoFrutas from "@/components/games/ContandoFrutas";
import FormandoPalavras from "@/components/games/FormandoPalavras";

const PlayPlus = () => {
  const { ageGroup } = useAge();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const filteredGames = useMemo(
    () => playPlusGames.filter((game) => !ageGroup || game.ageGroups.includes(ageGroup)),
    [ageGroup],
  );

  const filteredVideos = useMemo(
    () => playPlusVideos.filter((video) => !ageGroup || video.ageGroups.includes(ageGroup)),
    [ageGroup],
  );

  const catalogSummary = useMemo(() => buildCatalogSummary(ageGroup ?? null), [ageGroup]);

  const activeGame = useMemo(
    () => filteredGames.find((game) => game.id === activeGameId) ?? null,
    [filteredGames, activeGameId],
  );

  const handlePlayGame = (game: PlayPlusGame) => {
    if (game.premium && !isPremium) {
      navigate("/store");
      return;
    }

    if (!isGamePlayableNow(game.component)) {
      return;
    }

    setActiveGameId(game.id);
  };

  const handleWatchVideo = (video: PlayPlusVideo) => {
    if (video.premium && !isPremium) {
      navigate("/store");
      return;
    }

    window.open(video.url, "_blank", "noopener,noreferrer");
  };

  const renderSelectedGame = (game: PlayPlusGame) => {
    switch (game.component) {
      case "contando-frutas":
        return <ContandoFrutas />;
      case "formando-palavras":
        return <FormandoPalavras />;
      default:
        return (
          <div className="rounded-xl border border-dashed border-white/20 p-6 text-center text-muted-foreground">
            Esse jogo estará disponível em breve dentro do EDUKIDS+. Fique de olho nas próximas atualizações!
          </div>
        );
    }
  };

  if (!ageGroup) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">Escolha uma faixa etária para explorar o Play+</h1>
        <p className="mt-2 text-muted-foreground">
          Vá até as configurações ou use o seletor inicial para definir a idade da criança. Assim, mostramos apenas os conteúdos mais adequados.
        </p>
        <Button className="mt-6" onClick={() => navigate("/settings")}>
          Abrir Configurações
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">Play+ — Aprender brincando</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Jogos educativos e desafios rápidos pensados para a faixa etária <strong>{ageGroup}</strong>. Aqui você encontra experiências que desenvolvem lógica, leitura, criatividade e muito mais.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/store")} className="w-full sm:w-auto">
            Ver planos Premium
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">Experiências</span>
              <strong className="text-3xl font-bold">{catalogSummary.totalExperiences}</strong>
              <span className="text-xs text-muted-foreground">Jogos e vídeos alinhados à idade selecionada</span>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-yellow-400">Premium</span>
              <strong className="text-3xl font-bold text-yellow-400">{catalogSummary.totalPremium}</strong>
              <span className="text-xs text-muted-foreground">Conteúdos exclusivos para assinantes EDUKIDS+</span>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-400">Grátis</span>
              <strong className="text-3xl font-bold text-emerald-400">{catalogSummary.totalFree}</strong>
              <span className="text-xs text-muted-foreground">Experiências liberadas para todos os exploradores</span>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10">
            <CardContent className="flex flex-col gap-2 p-4">
              <span className="text-xs uppercase tracking-[0.3em] text-sky-400">Recomendados</span>
              <strong className="text-3xl font-bold text-sky-400">{catalogSummary.recommended}</strong>
              <span className="text-xs text-muted-foreground">Sugestões que combinam com a etapa atual de aprendizado</span>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Jogos interativos</h2>
            <p className="text-sm text-muted-foreground">
              Ganhe experiência resolvendo desafios rápidos. Alguns jogos podem ser acessados agora mesmo aqui na plataforma.
            </p>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            Ainda não temos jogos cadastrados para a faixa etária selecionada. 🌟
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredGames.map((game) => {
              const canAccess = !game.premium || isPremium;
              const playableNow = isGamePlayableNow(game.component);

              return (
                <Card key={game.id} className="glass-card flex flex-col overflow-hidden border-white/10 transition hover:-translate-y-1">
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
                      <span>{game.estimatedTime} por sessão</span>
                      <span>
                        Faixa etária:{" "}
                        <strong className="text-foreground">{game.ageGroups.join(" • ")}</strong>
                      </span>
                    </div>
                    <Button
                      onClick={() => (canAccess ? handlePlayGame(game) : navigate("/store"))}
                      disabled={!playableNow}
                      className="w-full"
                    >
                      {canAccess
                        ? playableNow
                          ? "Jogar agora"
                          : "Em breve no EDUKIDS+"
                        : "Assine para jogar"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {activeGame && (
        <section className="space-y-4">
          <Card className="glass-card border-primary/30">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl">{activeGame.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{activeGame.tagline}</p>
              </div>
              <Button variant="outline" onClick={() => setActiveGameId(null)}>
                Fechar jogo
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderSelectedGame(activeGame)}
            </CardContent>
          </Card>
        </section>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Vídeos para aprender e praticar</h2>
          <p className="text-sm text-muted-foreground">
            Conteúdos selecionados para assistir no YouTube com segurança. Clique para abrir em uma nova aba.
          </p>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            Ainda não temos vídeos recomendados para esta faixa etária.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => {
              const canWatch = !video.premium || isPremium;

              return (
                <Card key={video.id} className="glass-card flex h-full flex-col border-white/10">
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs text-white/85">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {video.duration}
                      </div>
                    </div>
                  </div>

                  <CardHeader className="flex-1 space-y-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-white/5 px-3 py-1">Canal: {video.channel}</span>
                      <span className="rounded-full bg-white/5 px-3 py-1">
                        Faixa: {video.ageGroups.join(" • ")}
                      </span>
                      {video.premium && (
                        <span className="flex items-center gap-1 rounded-full bg-yellow-400/80 px-3 py-1 text-black">
                          <Lock className="h-3 w-3" />
                          Premium
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      variant={canWatch ? "default" : "outline"}
                      onClick={() => handleWatchVideo(video)}
                    >
                      {canWatch ? (
                        <>
                          Assistir no YouTube
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Assine para assistir
                          <Lock className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default PlayPlus;