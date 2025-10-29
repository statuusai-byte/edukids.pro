import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  onQuizComplete?: (score: number) => void;
  triggerHint?: boolean;
}

const QuizComponent = ({ questions, onQuizComplete, triggerHint }: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const isQuizFinished = currentQuestionIndex >= questions.length;

  // Reset hint when question changes
  useEffect(() => {
    setEliminatedOptions([]);
  }, [currentQuestionIndex]);

  // Logic to eliminate two wrong answers when hint is triggered
  useEffect(() => {
    if (triggerHint && eliminatedOptions.length === 0) {
      const incorrectOptions = currentQuestion.options.filter(
        (option) => option !== currentQuestion.correctAnswer
      );
      // Shuffle and pick two to eliminate
      const toEliminate = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setEliminatedOptions(toEliminate);
    }
  }, [triggerHint, currentQuestion, eliminatedOptions]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      showSuccess("Resposta correta! Muito bem!");
    } else {
      showError("Ops! Resposta incorreta. Tente a próxima.");
    }
  };

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setAnimationClass('');
    } else {
      if (onQuizComplete) {
        onQuizComplete(score + (isCorrect ? 1 : 0));
      }
      setCurrentQuestionIndex(questions.length);
    }
  }, [currentQuestionIndex, questions.length, onQuizComplete, score, isCorrect]);

  useEffect(() => {
    if (isCorrect === null) return;
    const newAnimationClass = isCorrect ? 'animate-correct-answer-pop' : 'animate-incorrect-answer-shake';
    setAnimationClass(newAnimationClass);
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [isCorrect]);

  if (isQuizFinished) {
    return (
      <Card className="glass-card p-6 text-center">
        <CardTitle className="text-3xl text-primary mb-4">Quiz Concluído!</CardTitle>
        <p className="text-xl">Você acertou {score} de {questions.length} perguntas.</p>
        <p className="text-muted-foreground mt-2">Ótimo trabalho! Marque a lição como concluída para continuar.</p>
      </Card>
    );
  }

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardHeader>
        <CardTitle className="text-xl">
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-2xl font-semibold text-foreground">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = currentQuestion.correctAnswer === option;
            const isEliminated = eliminatedOptions.includes(option);
            
            let variant: 'default' | 'outline' | 'destructive' = 'outline';
            let icon = null;

            if (isSelected) {
              variant = isCorrect ? 'default' : 'destructive';
              icon = isCorrect ? <CheckCircle className="ml-3 h-5 w-5" /> : <XCircle className="ml-3 h-5 w-5" />;
            } else if (selectedAnswer !== null && isCorrectOption) {
              variant = 'default';
              icon = <CheckCircle className="ml-3 h-5 w-5" />;
            }

            return (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null || isEliminated}
                className={cn(
                  "h-16 text-lg justify-start transition-all duration-200",
                  variant === 'default' && 'bg-green-600 hover:bg-green-700',
                  variant === 'destructive' && 'bg-red-600 hover:bg-red-700',
                  variant === 'outline' && selectedAnswer !== null && 'opacity-50',
                  isEliminated && 'opacity-30 pointer-events-none'
                )}
                variant={variant === 'default' || variant === 'destructive' ? 'default' : 'outline'}
              >
                {option}
                {icon}
              </Button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-6 text-center">
            <Button onClick={handleNext} size="lg">
              {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizComponent;