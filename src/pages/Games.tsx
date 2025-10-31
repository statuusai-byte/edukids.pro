import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gamepad2, Star, Shield, Brain } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ContandoFrutas from '@/components/games/ContandoFrutas';
import FormandoPalavras from '@/components/games/FormandoPalavras';
import MemoryGame from '@/components/games/MemoryGame';
import { TiltCard } from '@/components/TiltCard';
import { Icon } from '@/components/Icon';

type GameId = 'contando-frutas' | 'formando-palavras' | 'jogo-da-memoria';
type Difficulty = 'easy' | 'medium' | 'hard';

const gamesList: { id: GameId; title: string; description: string; icon: any }[] = [
  { id: 'contando-frutas', title: 'Contando Frutas', description: 'Conte as frutas e escolha o número certo.', icon: 'Apple' },
  { id: 'formando-palavras', title: 'Formando Palavras', description: 'Junte as sílabas para formar a palavra.', icon: 'BookOpen' },
  { id: 'jogo-da-memoria', title: 'Jogo da Memória', description: 'Encontre os pares de cartas iguais.', icon: 'Brain' },
];

const difficultyLevels: { id: Difficulty; label: string; icon: React.ElementType }[] = [
  { id: 'easy', label: 'Fácil', icon: Star },
  { id: 'medium', label: 'Médio', icon: Shield },
  { id: 'hard', label: 'Difícil', icon: Brain },
];

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleGameSelect = (gameId: GameId) => {
    setSelectedGame(gameId);
    setSelectedDifficulty(null); // Reset difficulty when a new game is chosen
  };

  const handleBack = () => {
    if (selectedDifficulty) {
      setSelectedDifficulty(null);
    } else if (selectedGame) {
      setSelectedGame(null);
    }
  };

  const renderGame = () => {
    if (!selectedGame || !selectedDifficulty) return null;
    switch (selectedGame) {
      case 'contando-frutas':
        return <ContandoFrutas difficulty={selectedDifficulty} />;
      case 'formando-palavras':
        return <FormandoPalavras difficulty={selectedDifficulty} />;
      case 'jogo-da-memoria':
        return <MemoryGame difficulty={selectedDifficulty} />;
      default:
        return null;
    }
  };

  const currentGame = gamesList.find(g => g.id === selectedGame);

  return (
    <PageTransition>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
            <Gamepad2 className="h-10 w-10 text-yellow-400" />
            Central de Jogos
          </h1>
          {selectedGame && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          )}
        </div>

        {!selectedGame && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesList.map((game) => (
              <TiltCard key={game.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary rounded-full">
                      <Icon name={game.icon} className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{game.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <p className="text-muted-foreground flex-grow">{game.description}</p>
                  <Button onClick={() => handleGameSelect(game.id)} className="mt-4 w-full">
                    Jogar Agora
                  </Button>
                </CardContent>
              </TiltCard>
            ))}
          </div>
        )}

        {selectedGame && !selectedDifficulty && (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-2">Selecione a Dificuldade</h2>
            <p className="text-muted-foreground mb-8">Jogo selecionado: {currentGame?.title}</p>
            <div className="grid grid-cols-1 gap-4">
              {difficultyLevels.map(level => (
                <Button key={level.id} onClick={() => setSelectedDifficulty(level.id)} className="h-20 text-2xl" variant="outline">
                  <level.icon className="mr-4 h-8 w-8" />
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {selectedGame && selectedDifficulty && (
          <div className="max-w-2xl mx-auto">
            {renderGame()}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Games;