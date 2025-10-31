import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { showSuccess } from '@/utils/toast';
import { BrainCircuit, Rocket, Star, Sun, Moon, Cloud, Heart, Diamond, Award, Crown, Gem, Ghost } from 'lucide-react';

const ICONS = [BrainCircuit, Rocket, Star, Sun, Moon, Cloud, Heart, Diamond, Award, Crown, Gem, Ghost];

const generateCards = () => {
  const selectedIcons = ICONS.sort(() => 0.5 - Math.random()).slice(0, 8);
  const cardPairs = [...selectedIcons, ...selectedIcons];
  return cardPairs.sort(() => 0.5 - Math.random()).map((IconComponent, index) => ({
    id: index,
    Icon: IconComponent,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryMatch = () => {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.Icon === secondCard.Icon) {
        // Match
        setCards(prevCards =>
          prevCards.map(card =>
            card.Icon === firstCard.Icon ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    const allMatched = cards.every(card => card.isMatched);
    if (allMatched && cards.length > 0) {
      setIsGameWon(true);
      showSuccess(`Parabéns! Você venceu em ${moves} jogadas!`);
    }
  }, [cards, moves]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    setCards(prevCards =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices(prev => [...prev, index]);
  };

  const resetGame = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMoves(0);
    setIsGameWon(false);
  };

  return (
    <Card className="glass-card p-6">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Jogo da Memória</h3>
          <div className="text-lg">Jogadas: <span className="font-bold">{moves}</span></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="aspect-square cursor-pointer"
              onClick={() => handleCardClick(index)}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={cn("absolute w-full h-full rounded-lg bg-secondary/80 flex items-center justify-center", { 'hidden': card.isFlipped || card.isMatched })} style={{ backfaceVisibility: 'hidden' }}>
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div className={cn("absolute w-full h-full rounded-lg flex items-center justify-center", card.isMatched ? 'bg-green-500/30' : 'bg-primary/30')} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <card.Icon className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
        {isGameWon && (
          <div className="mt-6 text-center">
            <Button onClick={resetGame} size="lg">Jogar Novamente</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryMatch;