import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress'; // Import Progress component

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  onQuizComplete?: (score: number) => void;
  triggerHint?: boolean;
  onHintSuggested?: () => void; // Notifies parent that suggestion UI appeared (optional)
  onRequestHint?: () => void; // Parent should run the hint flow (consume hint / show ad / open store)
}

const QuizComponent = ({ questions, onQuizComplete, triggerHint, onHintSuggested, onRequestHint }: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [, setIncorrectAttempts] = useState(0); // counts wrong attempts for current question
  const [showHintSuggestion, setShowHintSuggestion] = useState(false); // when true, question is locked until hint is used

  // Handle case where questions might be empty (should be caught by LessonPage, but safe check here)
  const totalQuestions = questions.length;
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const isQuizFinished = currentQuestionIndex >= totalQuestions;

  // Reset per-question transient state
  useEffect(() => {
    setEliminatedOptions([]);
    setConfirmedAnswer(null);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setIncorrectAttempts(0);
    setShowHintSuggestion(false);
  }, [currentQuestionIndex]);

  // Apply hint elimination when parent triggers it
  useEffect(() => {
    if (triggerHint && eliminatedOptions.length === 0 && !confirmedAnswer && currentQuestion) {
      const incorrectOptions = currentQuestion.options.filter(
        (option) => option !== currentQuestion.correctAnswer
      );
      const toEliminate = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setEliminatedOptions(toEliminate);
      // Allow user to try again after a hint; reset attempts so the user can use the remaining logic
      setIncorrectAttempts(0);
      setShowHintSuggestion(false);
    }
  }, [triggerHint, currentQuestion, eliminatedOptions, confirmedAnswer]);

  const handleOptionSelect = (option: string) => {
    if (confirmedAnswer !== null) return; // already finalized for this question
    if (showHintSuggestion) return; // locked until hint is used
    if (eliminatedOptions.includes(option)) return;
    setSelectedAnswer(option);
  };

  const handleConfirmAnswer = useCallback(() => {
    if (selectedAnswer === null) {
      showError("Por favor, selecione uma resposta antes de confirmar.");
      return;
    }
    
    if (!currentQuestion) return; // Safety check

    // If correct, finalize as before
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setConfirmedAnswer(selectedAnswer);
      setIsCorrect(true);
      setScore(prev => prev + 1);
      showSuccess("Resposta correta! Muito bem!");
      setIncorrectAttempts(0);
      setShowHintSuggestion(false);
      return;
    }

    // Incorrect answer: increment attempts but DO NOT reveal the correct answer yet
    setIsCorrect(false); // used for animation feedback
    setIncorrectAttempts(prev => {
      const next = prev + 1;
      if (next >= 2) {
        // After 2 incorrect attempts, suggest using a hint and lock the question.
        setShowHintSuggestion(true);
        setSelectedAnswer(null); // clear selection to avoid confusion
        // Notify parent that suggestion is available (optional)
        onHintSuggested?.();
      }
      return next;
    });

    showError("Ops! Resposta incorreta. Tente novamente.");
  }, [selectedAnswer, currentQuestion, onHintSuggested]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setConfirmedAnswer(null);
      setIsCorrect(null);
      setAnimationClass('');
    } else {
      if (onQuizComplete) {
        onQuizComplete(score);
      }
      setCurrentQuestionIndex(totalQuestions); // mark quiz as finished
    }
  }, [currentQuestionIndex, totalQuestions, onQuizComplete, score]);

  useEffect(() => {
    if (isCorrect === null) return;
    const newAnimationClass = isCorrect ? 'animate-correct-answer-pop' : 'animate-incorrect-answer-shake';
    setAnimationClass(newAnimationClass);
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [isCorrect, selectedAnswer]);

  if (totalQuestions === 0) {
    // This case should ideally be handled by LessonPage, but we ensure safety here.
    return (
      <Card className="glass-card p-6 text-center">
        <CardTitle className="text-3xl text-red-400 mb-4">Erro de Conteúdo</CardTitle>
        <p className="text-xl">Nenhuma pergunta encontrada para este quiz.</p>
      </Card>
    );
  }

  if (isQuizFinished) {
    return (
      <Card className="glass-card p-6 text-center">
        <CardTitle className="text-3xl text-primary mb-4">Quiz Concluído!</CardTitle>
        <p className="text-xl">Você acertou {score} de {totalQuestions} perguntas.</p>
        <p className="text-muted-foreground mt-2">Ótimo trabalho! Marque a lição como concluída para continuar.</p>
      </Card>
    );
  }

  const progressValue = ((currentQuestionIndex + (confirmedAnswer !== null ? 1 : 0)) / totalQuestions) * 100;

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl text-muted-foreground">
            Pergunta {currentQuestionIndex + 1} de {totalQuestions}
          </CardTitle>
          <span className="text-lg font-bold text-primary">{score} pontos</span>
        </div>
        <Progress value={progressValue} className="h-2 bg-white/10 [&>*]:bg-gradient-to-r [&>*]:from-green-400 [&>*]:to-yellow-400" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-2xl font-semibold text-foreground text-center">{currentQuestion.question}</p>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = currentQuestion.correctAnswer === option;
            const isEliminated = eliminatedOptions.includes(option);

            let buttonClasses = "h-16 text-lg transition-all duration-200 justify-center";
            let buttonVariant: 'default' | 'outline' | 'destructive' = 'outline';

            // If the question was finalized (confirmedAnswer set because user got it right),
            // reveal correct/incorrect as before.
            if (confirmedAnswer !== null) {
              if (isCorrectOption) {
                buttonVariant = 'default';
                buttonClasses = cn(buttonClasses, 'bg-green-600 hover:bg-green-700');
              } else if (confirmedAnswer === option && !isCorrectOption) {
                buttonVariant = 'destructive';
                buttonClasses = cn(buttonClasses, 'bg-red-600 hover:bg-red-700');
              } else {
                buttonClasses = cn(buttonClasses, 'opacity-50');
              }
            } else {
              // Before finalization: normal interactive states
              if (isSelected) {
                buttonVariant = 'default';
                buttonClasses = cn(buttonClasses, 'bg-primary hover:bg-primary/90');
              } else {
                buttonClasses = cn(buttonClasses, 'bg-secondary/40 hover:bg-secondary/60 border-white/10');
              }
            }

            if (isEliminated) {
              buttonClasses = cn(buttonClasses, 'opacity-30 pointer-events-none line-through');
            }

            // If the question is locked waiting for a hint, disable interaction
            const disabled = confirmedAnswer !== null || isEliminated || showHintSuggestion;

            return (
              <Button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={disabled}
                className={buttonClasses}
                variant={buttonVariant}
              >
                {option}
                {confirmedAnswer !== null && isCorrectOption && <CheckCircle className="ml-3 h-5 w-5" />}
                {confirmedAnswer !== null && confirmedAnswer === option && !isCorrectOption && <XCircle className="ml-3 h-5 w-5" />}
              </Button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          {selectedAnswer !== null && confirmedAnswer === null && !showHintSuggestion && (
            <Button
              onClick={handleConfirmAnswer}
              size="lg"
              className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold hover:from-green-600 hover:to-yellow-600"
            >
              Confirmar Resposta
            </Button>
          )}

          {confirmedAnswer !== null && (
            <Button onClick={handleNextQuestion} size="lg" className="w-full">
              {currentQuestionIndex < totalQuestions - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {/* After 2 incorrect attempts, suggest using a hint and lock the question */}
          {showHintSuggestion && confirmedAnswer === null && (
            <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm flex items-center justify-between">
              <span>Você esgotou as tentativas gratuitas. Use uma dica para continuar.</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  // Request the parent to run the hint flow (consume a hint, show ad, or open store)
                  onRequestHint?.();
                  // hide suggestion UI while parent handles hint flow
                  setShowHintSuggestion(false);
                }}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Usar Dica
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizComponent;