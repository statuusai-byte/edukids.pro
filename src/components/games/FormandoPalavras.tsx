import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

interface WordData {
  word: string;
  syllables: string[];
  image: string; // Placeholder for image URL
}

const WORDS: WordData[] = [
  { word: "BOLA", syllables: ["BO", "LA"], image: "⚽" },
  { word: "CASA", syllables: ["CA", "SA"], image: "🏠" },
  { word: "PATO", syllables: ["PA", "TO"], image: "🦆" },
  { word: "GATO", syllables: ["GA", "TO"], image: "🐈" },
  { word: "FOCA", syllables: ["FO", "CA"], image: "🦭" },
];

const FormandoPalavras = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animationClass, setAnimationClass] = useState('');

  const currentWordData = useMemo(() => WORDS[currentWordIndex], [currentWordIndex]);

  const setupGame = useCallback(() => {
    setSelectedSyllables([]);
    setIsCorrect(null);
    setAnimationClass('');
    
    // Shuffle syllables for options
    const options = [...currentWordData.syllables].sort(() => Math.random() - 0.5);
    setShuffledOptions(options);
  }, [currentWordData]);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  const handleSyllableClick = (syllable: string) => {
    if (isCorrect !== null) return; // Game over for this round

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
    const nextIndex = (currentWordIndex + 1) % WORDS.length;
    setCurrentWordIndex(nextIndex);
    setupGame();
  };

  const handleReset = () => {
    setSelectedSyllables([]);
    setIsCorrect(null);
  };

  const currentAttempt = selectedSyllables.join('');

  useEffect(() => {
    if (isCorrect === null) return;

    const newAnimationClass = isCorrect
      ? 'animate-correct-answer-pop'
      : 'animate-incorrect-answer-shake';
    
    setAnimationClass(newAnimationClass);

    const timer = setTimeout(() => {
      setAnimationClass('');
    }, 500);

    return () => clearTimeout(timer);
  }, [isCorrect]);

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forme a palavra: {currentWordData.image}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Display Area */}
        <div className="min-h-[80px] flex justify-center items-center border-b-2 border-primary/50 pb-4">
          <div className="text-5xl font-extrabold tracking-widest text-primary">
            {currentAttempt || '...'}
          </div>
        </div>

        {/* Syllable Options */}
        <div className="flex justify-center gap-4 flex-wrap">
          {shuffledOptions.map((syllable, index) => {
            const isUsed = selectedSyllables.includes(syllable);
            
            return (
              <Button
                key={index}
                onClick={() => handleSyllableClick(syllable)}
                disabled={isUsed || isCorrect !== null}
                className={cn(
                  "h-16 text-2xl transition-all duration-200",
                  isUsed ? "opacity-50 cursor-default" : "hover:scale-105"
                )}
                variant="outline"
              >
                {syllable}
              </Button>
            );
          })}
        </div>

        {/* Feedback and Navigation */}
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