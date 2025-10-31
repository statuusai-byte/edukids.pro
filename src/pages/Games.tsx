import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import ContandoFrutas from '@/components/games/ContandoFrutas';
import FormandoPalavras from '@/components/games/FormandoPalavras';
import MemoryGame from '@/components/games/MemoryGame';
import { TiltCard } from '@/components/TiltCard';
import { Icon } from '@/components/Icon';

type GameId = 'contando-frutas' | 'formando-palavras' | 'jogo-da-memoria';

const gamesList: { id: GameId; title: string; description: string; icon: any }[] = [
  { id: 'contando-frutas', title: 'Contando Frutas', description: 'Conte as frutas e escolha o número certo.', icon: 'Apple' },
  { id: 'formando-palavras', title: 'Formando Palavras', description: 'Junte as sílabas para formar a palavra.', icon: 'BookOpen' },
  { id: 'jogo-da-memoria', title: 'Jogo da Memória', description: 'Encontre os pares de cartas iguais.', icon: 'Brain' },
];

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case 'contando-frutas':
        return <ContandoFrutas />;
      case 'formando-palavras':
        return <FormandoPalavras />;
      case 'jogo-da-memoria':
        return <MemoryGame />;
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
            <Gamepad2 className="h-10 w-10 text-yellow-400" />
            Central de Jogos
          </h1>
          {selectedGame && (
            <Button variant="outline" onClick={() => setSelectedGame(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a seleção
            </Button>
          )}
        </div>

        {selectedGame ? (
          <div className="max-w-2xl mx-auto">
            {renderGame()}
          </div>
        ) : (
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
                  <Button onClick={() => setSelectedGame(game.id)} className="mt-4 w-full">
                    Jogar Agora
                  </Button>
                </CardContent>
              </TiltCard>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Games;