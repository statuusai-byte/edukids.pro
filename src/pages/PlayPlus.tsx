import { useState, lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAge } from "@/context/AgeContext";
import { usePremium } from "@/context/PremiumContext";
import { playPlusGames, type PlayPlusGame } from "@/data/playPlusData";
import { journeyNodes, type JourneyNode } from "@/data/journeyData";
import { Sparkles } from "lucide-react";
import JourneyMap from "@/components/JourneyMap";
import { showSuccess } from "@/utils/toast";

// Define the props interface for the game components
interface GameComponentProps {
  onGameComplete: () => void;
}

type GameComponentMap = Record<
  PlayPlusGame["component"],
  LazyExoticComponent<ComponentType<GameComponentProps>>
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
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());

  const handleNodeClick = (node: JourneyNode) => {
    const game = playPlusGames.find(g => g.id === node.gameId);
    if (!game) return;

    if (game.premium && !isPremium) {
      navigate("/store");
      return;
    }
    setActiveGame(game);
  };

  const handleGameComplete = () => {
    const currentNode = journeyNodes.find(n => n.gameId === activeGame?.id);
    if (currentNode) {
      setCompletedNodes(prev => new Set(prev).add(currentNode.id));
      showSuccess(`Desafio "${currentNode.title}" concluído!`);
    }
    setActiveGame(null);
  };

  if (!ageGroup) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">Escolha uma faixa etária para começar a Jornada</h1>
        <p className="mt-2 text-muted-foreground">
          Vá até as configurações para definir a idade e desbloquear o mapa do Play+.
        </p>
        <Button className="mt-6" onClick={() => navigate("/settings")}>
          Abrir Configurações
        </Button>
      </div>
    );
  }

  const SelectedGameComponent = activeGame ? gameComponentMap[activeGame.component] : null;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tighter">Jornada do Conhecimento</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Explore o mapa, complete os desafios e desbloqueie novos caminhos. A aventura de aprender começa agora!
        </p>
      </section>

      <section>
        <JourneyMap completedNodes={completedNodes} onNodeClick={handleNodeClick} />
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
                        Carregando desafio…
                      </div>
                    }
                  >
                    <SelectedGameComponent onGameComplete={handleGameComplete} />
                  </Suspense>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-muted-foreground">
                    Esse desafio estará disponível em breve.
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