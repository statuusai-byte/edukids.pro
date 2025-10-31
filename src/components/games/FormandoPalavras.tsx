import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

type Difficulty = 'easy' | 'medium' | 'hard';

interface WordData {
  word: string;
  syllables: string[];
  image: string;
}

const WORDS: Record<Difficulty, WordData[]> = {
  easy: [
    { word: "BOLA", syllables: ["BO", "LA"], image: "⚽" },
    { word: "CASA", syllables: ["CA", "SA"], image: "🏠" },
    { word: "PATO", syllables: ["PA", "TO"], image: "🦆" },
    { word: "GATO", syllables: ["GA", "TO"], image: "🐈" },
    { word: "FOCA", syllables: ["FO", "CA"], image: "🦭" },
    { word: "SAPO", syllables: ["SA", "PO"], image: "🐸" },
    { word: "FLOR", syllables: ["FLOR"], image: "🌸" },
    { word: "SOL", syllables: ["SOL"], image: "☀️" },
  ],
  medium: [
    { word: "MACACO", syllables: ["MA", "CA", "CO"], image: "🐒" },
    { word: "ARVORE", syllables: ["AR", "VO", "RE"], image: "🌳" },
    { word: "PEIXE", syllables: ["PEI", "XE"], image: "🐠" },
    { word: "JANELA", syllables: ["JA", "NE", "LA"], image: "🪟" },
    { word: "CADEIRA", syllables: ["CA", "DEI", "RA"], image: "🪑" },
  ],
  hard: [
    { word: "ELEFANTE", syllables: ["E", "LE", "FAN", "TE"], image: "🐘" },
    { word: "CACHORRO", syllables: ["CA", "CHO", "RRO"], image: "🐶" },
    { word: "BORBOLETA", syllables: ["BOR", "BO", "LE", "TA"], image: "🦋" },
    { word: "COMPUTADOR", syllables: ["COM", "PU", "TA", "DOR"], image: "💻" },
  ],
};

interface FormandoPalavrasProps {
  difficulty: Difficulty;
  triggerHint?: boolean;
}

const FormandoPalavras = ({ difficulty, triggerHint }: FormandoPalavrasProps) => {
  const wordList = useMemo(() => WORDS[difficulty], [difficulty]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animationClass, setAnimationClass] = useState('');
  const [hintUsed, setHintUsed] = useState(false);

  const currentWordData = useMemo(() => wordList[currentWordIndex], [wordList, currentWordIndex]);

  const setupGame = useCallback(() => {
    setSelectedSyllables([]);
    setIsCorrect(null);
    setAnimationClass('');
    setHintUsed(false);
    
    const options = [...currentWordData.syllables].sort(() => Math.random() - 0.5);
    setShuffledOptions(options);
  }, [currentWordData]);

  useEffect(() => {
    setCurrentWordIndex(0); // Reset index when difficulty changes
  }, [difficulty]);

  useEffect(() => {
    setupGame();
  }, [currentWordIndex, setupGame]);

  useEffect(() => {
    if (triggerHint && !hintUsed) {
      const firstSyllable = currentWordData.syllables[0];
      setSelectedSyllables([firstSyllable]);
      setHintUsed(true);
    }
  }, [triggerHint, hintUsed, currentWordData.syllables]);

  const handleSyllableClick = (syllable: string) => {
    if (isCorrect !== null) return;

    const nextSelection = [...selectedSyllables, syllable];
    setSelectedSyllables(nextSelection);

    const formedWord = nextSelection.join('');

    if (formedWord.length === currentWordData.word.length) {
      if (formedWord === currentWordData.word) {
        setIsCorrect(true);
        showSuccess("Parabéns! Palavra formada corretamente!");
      } else {
        setIsCorrect(false);
        showError("Ops! Tente novamente.");
      }
    }
  };

  const handleNext = () => {
    setCurrentWordIndex((prev) => (prev + 1) % wordList.length);
  };

  const handleReset = () => {
    setSelectedSyllables([]);
    setIsCorrect(null);
  };

  useEffect(() => {
    if (isCorrect === null) return;
    const newAnimationClass = isCorrect ? 'animate-correct-answer-pop' : 'animate-incorrect-answer-shake';
    setAnimationClass(newAnimationClass);
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [isCorrect]);

  const currentAttempt = selectedSyllables.join('');

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forme a palavra: {currentWordData.image}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="min-h-[80px] flex justify-center items-center border-b-2 border-primary/50 pb-4">
          <div className="text-5xl font-extrabold tracking-widest text-primary">
            {currentAttempt || '...'}
          </div>
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          {shuffledOptions.map((syllable, index) => {
            const isUsed = selectedSyllables.includes(syllable);
            return (
              <Button
                key={index}
                onClick={() => handleSyllableClick(syllable)}
                disabled={isUsed || isCorrect !== null}
                className={cn("h-16 text-2xl transition-all duration-200", isUsed ? "opacity-50 cursor-default" : "hover:scale-105")}
                variant="outline"
              >
                {syllable}
              </Button>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center gap-4">
          {isCorrect === false && (
            <Button onClick={handleReset} variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          )}
          {isCorrect === true && (
            <Button onClick={handleNext} size="lg" className="bg-green-600 hover:bg-green-700">
              Próxima Palavra
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormandoPalavras;