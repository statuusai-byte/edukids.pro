import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  onQuizComplete?: (score: number) => void;
  triggerHint?: boolean;
  onHintSuggested?: () => void;
  onQuestionChange?: (questionIndex: number) => void;
}

const QuizComponent = ({ questions, onQuizComplete, triggerHint, onHintSuggested, onQuestionChange }: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showHintSuggestion, setShowHintSuggestion] = useState(false);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const isQuizFinished = currentQuestionIndex >= questions.length;

  useEffect(() => {
    onQuestionChange?.(currentQuestionIndex);
    setEliminatedOptions([]);
    setConfirmedAnswer(null);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setIncorrectAttempts(0);
    setShowHintSuggestion(false);
  }, [currentQuestionIndex, onQuestionChange]);

  useEffect(() => {
    if (triggerHint && eliminatedOptions.length === 0 && !confirmedAnswer) {
      const incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.correctAnswer);
      const toEliminate = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setEliminatedOptions(toEliminate);
    }
  }, [triggerHint, currentQuestion, eliminatedOptions, confirmedAnswer]);

  const handleConfirmAnswer = useCallback(() => {
    if (!selectedAnswer) {
      showError("Por favor, selecione uma resposta.");
      return;
    }
    setConfirmedAnswer(selectedAnswer);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
      showSuccess("Resposta correta!");
    } else {
      showError("Ops! Resposta incorreta.");
      const newAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newAttempts);
      if (newAttempts >= 2) {
        setShowHintSuggestion(true);
      }
    }
  }, [selectedAnswer, currentQuestion.correctAnswer, incorrectAttempts]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onQuizComplete?.(score);
      setCurrentQuestionIndex(questions.length);
    }
  }, [currentQuestionIndex, questions.length, onQuizComplete, score]);

  useEffect(() => {
    if (isCorrect === null) return;
    setAnimationClass(isCorrect ? 'animate-correct-answer-pop' : 'animate-incorrect-answer-shake');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [isCorrect]);

  if (isQuizFinished) {
    return (
      <Card className="glass-card p-6 text-center">
        <CardTitle className="text-3xl text-primary mb-4">Quiz Concluído!</CardTitle>
        <p className="text-xl">Você acertou {score} de {questions.length} perguntas.</p>
      </Card>
    );
  }

  const progressValue = (currentQuestionIndex / questions.length) * 100;

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl text-muted-foreground">Pergunta {currentQuestionIndex + 1} de {questions.length}</CardTitle>
          <span className="text-lg font-bold text-primary">{score} pontos</span>
        </div>
        <Progress value={progressValue} className="h-2 bg-white/10 [&>*]:bg-gradient-to-r [&>*]:from-green-400 [&>*]:to-yellow-400" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-2xl font-semibold text-center">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = currentQuestion.correctAnswer === option;
            const isEliminated = eliminatedOptions.includes(option);
            let buttonClasses = "h-16 text-lg justify-center";
            let buttonVariant: 'default' | 'outline' | 'destructive' = 'outline';

            if (confirmedAnswer) {
              if (isCorrectOption) buttonClasses = cn(buttonClasses, 'bg-green-600 hover:bg-green-700');
              else if (isSelected) buttonVariant = 'destructive';
              else buttonClasses = cn(buttonClasses, 'opacity-50');
            } else if (isSelected) {
              buttonVariant = 'default';
            }

            return (
              <Button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                disabled={confirmedAnswer !== null || isEliminated}
                className={cn(buttonClasses, isEliminated && 'opacity-30 pointer-events-none line-through')}
                variant={buttonVariant}
              >
                {option}
                {confirmedAnswer && isCorrectOption && <CheckCircle className="ml-3 h-5 w-5" />}
                {confirmedAnswer && isSelected && !isCorrectOption && <XCircle className="ml-3 h-5 w-5" />}
              </Button>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          {!confirmedAnswer ? (
            <Button onClick={handleConfirmAnswer} size="lg" className="w-full">Confirmar Resposta</Button>
          ) : (
            <Button onClick={handleNextQuestion} size="lg" className="w-full">
              {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {showHintSuggestion && !confirmedAnswer && (
            <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
              <span>Precisa de uma dica?</span>
              <Button variant="secondary" size="sm" onClick={() => { onHintSuggested?.(); setShowHintSuggestion(false); }} className="ml-4 bg-yellow-500 text-black hover:bg-yellow-600">Usar Dica</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;