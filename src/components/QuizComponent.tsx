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
  onHintSuggested?: () => void; // New prop to notify parent when a hint is suggested
}

const QuizComponent = ({ questions, onQuizComplete, triggerHint, onHintSuggested }: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0); // New state
  const [showHintSuggestion, setShowHintSuggestion] = useState(false); // New state

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const isQuizFinished = currentQuestionIndex >= questions.length;

  // Reset hint and confirmed answer when question changes
  useEffect(() => {
    setEliminatedOptions([]);
    setConfirmedAnswer(null);
    setIsCorrect(null);
    setSelectedAnswer(null);
    setIncorrectAttempts(0); // Reset attempts on new question
    setShowHintSuggestion(false); // Reset hint suggestion
  }, [currentQuestionIndex]);

  // Logic to eliminate two wrong answers when hint is triggered
  useEffect(() => {
    if (triggerHint && eliminatedOptions.length === 0 && !confirmedAnswer) {
      const incorrectOptions = currentQuestion.options.filter(
        (option) => option !== currentQuestion.correctAnswer
      );
      // Shuffle and pick two to eliminate
      const toEliminate = incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      setEliminatedOptions(toEliminate);
    }
  }, [triggerHint, currentQuestion, eliminatedOptions, confirmedAnswer]);

  const handleOptionSelect = (option: string) => {
    if (confirmedAnswer !== null) return; // Cannot select if already confirmed
    setSelectedAnswer(option);
  };

  const handleConfirmAnswer = useCallback(() => {
    if (selectedAnswer === null) {
      showError("Por favor, selecione uma resposta antes de confirmar.");
      return;
    }

    setConfirmedAnswer(selectedAnswer);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      showSuccess("Resposta correta! Muito bem!");
      setIncorrectAttempts(0); // Reset attempts on correct answer
      setShowHintSuggestion(false);
    } else {
      showError("Ops! Resposta incorreta. Tente a próxima.");
      setIncorrectAttempts(prev => prev + 1); // Increment attempts
      if (incorrectAttempts + 1 >= 2 && !showHintSuggestion) { // Suggest hint after 2 incorrect attempts
        setShowHintSuggestion(true);
        onHintSuggested?.(); // Notify parent
      }
    }
  }, [selectedAnswer, currentQuestion.correctAnswer, incorrectAttempts, onHintSuggested, showHintSuggestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setConfirmedAnswer(null);
      setIsCorrect(null);
      setAnimationClass('');
    } else {
      if (onQuizComplete) {
        onQuizComplete(score); // Pass the final score
      }
      setCurrentQuestionIndex(questions.length); // Mark quiz as finished
    }
  }, [currentQuestionIndex, questions.length, onQuizComplete, score]);

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

  const progressValue = ((currentQuestionIndex + (confirmedAnswer !== null ? 1 : 0)) / questions.length) * 100;

  return (
    <Card className={cn("glass-card p-6", animationClass)}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl text-muted-foreground">
            Pergunta {currentQuestionIndex + 1} de {questions.length}
          </CardTitle>
          <span className="text-lg font-bold text-primary">{score} pontos</span>
        </div>
        {/* Apply gradient directly to the Progress component's indicator */}
        <Progress value={progressValue} className="h-2 bg-white/10 [&>*]:bg-gradient-to-r [&>*]:from-green-400 [&>*]:to-yellow-400" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-2xl font-semibold text-foreground text-center">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 gap-4"> {/* Changed to single column */}
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = currentQuestion.correctAnswer === option;
            const isEliminated = eliminatedOptions.includes(option);
            
            let buttonClasses = "h-16 text-lg transition-all duration-200 justify-center"; // Centered text
            let buttonVariant: 'default' | 'outline' | 'destructive' = 'outline';

            if (confirmedAnswer !== null) { // After confirmation
              if (isCorrectOption) {
                buttonVariant = 'default';
                buttonClasses = cn(buttonClasses, 'bg-green-600 hover:bg-green-700');
              } else if (isSelected && !isCorrectOption) {
                buttonVariant = 'destructive';
                buttonClasses = cn(buttonClasses, 'bg-red-600 hover:bg-red-700');
              } else {
                buttonClasses = cn(buttonClasses, 'opacity-50'); // Dim unselected wrong answers
              }
            } else { // Before confirmation
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

            return (
              <Button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={confirmedAnswer !== null || isEliminated}
                className={buttonClasses}
                variant={buttonVariant}
              >
                {option}
                {confirmedAnswer !== null && isCorrectOption && <CheckCircle className="ml-3 h-5 w-5" />}
                {confirmedAnswer !== null && isSelected && !isCorrectOption && <XCircle className="ml-3 h-5 w-5" />}
              </Button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          {selectedAnswer !== null && confirmedAnswer === null && (
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
              {currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {/* Hint suggestion */}
          {showHintSuggestion && confirmedAnswer === null && (
            <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm flex items-center justify-between">
              <span>Parece que você precisa de uma dica!</span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => { onHintSuggested?.(); setShowHintSuggestion(false); }} // Trigger hint and hide suggestion
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