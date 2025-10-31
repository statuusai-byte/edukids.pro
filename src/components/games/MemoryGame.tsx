import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

interface MemoryGameProps {
  difficulty: Difficulty;
}

interface MemoryCard {
  id: number;
  value: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ALL_CARD_PAIRS = [
  { value: 'Maçã', emoji: '🍎' },
  { value: 'Banana', emoji: '🍌' },
  { value: 'Uva', emoji: '🍇' },
  { value: 'Laranja', emoji: '🍊' },
  { value: 'Morango', emoji: '🍓' },
  { value: 'Pera', emoji: '🍐' },
  { value: 'Abacaxi', emoji: '🍍' },
  { value: 'Melancia', emoji: '🍉' },
];

const difficultyConfig = {
  easy: { pairs: 4, grid: 'grid-cols-4' },
  medium: { pairs: 6, grid: 'grid-cols-4' },
  hard: { pairs: 8, grid: 'grid-cols-4' },
};

const MemoryGame = ({ difficulty }: MemoryGameProps) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [turns, setTurns] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { pairs: numPairs, grid: gridClass } = difficultyConfig[difficulty];
  const gamePairs = useMemo(() => ALL_CARD_PAIRS.slice(0, numPairs), [numPairs]);

  const initializeGame = useCallback(() => {
    const shuffledPairs = gamePairs
      .flatMap((pair, index) => [
        { ...pair, id: index * 2, isFlipped: false, isMatched: false },
        { ...pair, id: index * 2 + 1, isFlipped: false, isMatched: false },
      ])
      .sort(() => Math.random() - 0.5);

    setCards(shuffledPairs);
    setFlippedCards([]);
    setMatches(0);
    setTurns(0);
    setIsProcessing(false);
  }, [gamePairs]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = useCallback((clickedCard: MemoryCard) => {
    if (isProcessing || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards(prev => [...prev, clickedCard.id]);
  }, [cards, isProcessing]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      setTurns(prev => prev + 1);

      const [id1, id2] = flippedCards;
      const card1 = cards.find(c => c.id === id1);
      const card2 = cards.find(c => c.id === id2);

      if (card1 && card2 && card1.value === card2.value) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === id1 || card.id === id2 ? { ...card, isMatched: true } : card
          )
        );
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        setIsProcessing(false);
        showSuccess("Parabéns! Você encontrou um par!");
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === id1 || card.id === id2 ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
          showError("Ops! Não é um par. Tente novamente.");
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const isGameComplete = useMemo(() => matches === numPairs, [matches, numPairs]);

  return (
    <Card className="glass-card p-6">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Jogo da Memória</CardTitle>
        <p className="text-muted-foreground">Encontre os pares de frutas!</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-around items-center text-lg font-semibold">
          <span>Pares: {matches}/{numPairs}</span>
          <span>Tentativas: {turns}</span>
        </div>

        <div className={cn("grid gap-4", gridClass)}>
          {cards.map(card => (
            <Button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={card.isFlipped || isProcessing || isGameComplete}
              className={cn(
                "relative h-24 w-full flex items-center justify-center text-4xl rounded-lg transition-all duration-300",
                card.isMatched ? "bg-green-600 text-white" :
                card.isFlipped ? "bg-primary text-primary-foreground" :
                "bg-secondary/40 hover:bg-secondary/60 border border-white/10"
              )}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
              {card.isMatched && <CheckCircle className="absolute right-2 bottom-2 h-5 w-5 text-white" />}
            </Button>
          ))}
        </div>

        {isGameComplete && (
          <div className="text-center mt-6">
            <h3 className="text-3xl font-bold text-green-500 mb-3">Parabéns! Você venceu!</h3>
            <p className="text-xl text-muted-foreground">Você completou o jogo em {turns} tentativas.</p>
            <Button onClick={initializeGame} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Jogar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryGame;