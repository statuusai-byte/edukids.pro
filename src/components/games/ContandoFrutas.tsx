import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

const MAX_FRUITS = 10;

const ContandoFrutas = () => {
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isCorrect === null) return;

    const newAnimationClass = isCorrect
      ? 'animate-correct-answer-pop'
      : 'animate-incorrect-answer-shake';
    
    setAnimationClass(newAnimationClass);

    const timer = setTimeout(() => {
      setAnimationClass('');
    }, 500); // Duração da animação

    return () => clearTimeout(timer);
  }, [isCorrect, selectedAnswer]);

  const generateProblem = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    
    const answer = Math.floor(Math.random() * MAX_FRUITS) + 1;
    setCorrectAnswer(answer);

    const wrongOptions = new Set<number>();
    while (wrongOptions.size < 3) {
      const option = Math.floor(Math.random() * MAX_FRUITS) + 1;
      if (option !== answer) {
        wrongOptions.add(option);
      }
    }
    
    const shuffledOptions = [...wrongOptions, answer].sort(() => Math.random() - 0.5);
    setOptions(shuffledOptions);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    if (answer === correctAnswer) {
      setIsCorrect(true);
      showSuccess("Muito bem! Resposta correta!");
    } else {
      setIsCorrect(false);
      showError("Ops! Tente novamente.");
    }
  };

  const fruits = useMemo(() => Array(correctAnswer).fill('🍎'), [correctAnswer]);

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardContent>
        <p className="text-xl text-center text-muted-foreground mb-6">Quantas maçãs você vê?</p>
        <div className="flex justify-center items-center flex-wrap gap-4 text-6xl min-h-[150px] mb-8">
          {fruits.map((fruit, index) => (
            <span key={index} role="img" aria-label="maçã">{fruit}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map(option => {
            const isSelected = selectedAnswer === option;
            const buttonVariant = isSelected ? (isCorrect ? 'default' : 'destructive') : 'outline';
            
            return (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className="h-20 text-3xl"
                variant={buttonVariant}
              >
                {option}
                {isSelected && isCorrect && <CheckCircle className="ml-3 h-8 w-8" />}
                {isSelected && !isCorrect && <XCircle className="ml-3 h-8 w-8" />}
              </Button>
            );
          })}
        </div>
        {selectedAnswer !== null && (
          <div className="mt-6 text-center">
            <Button onClick={generateProblem} size="lg">
              Próxima Pergunta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContandoFrutas;