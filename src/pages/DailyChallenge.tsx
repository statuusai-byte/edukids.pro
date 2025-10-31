import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dailyChallenges } from '@/data/dailyChallengesData';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useHintsContext } from '@/context/HintsContext';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const DailyChallengePage = () => {
  const { addHints } = useHintsContext();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const challengeIndex = useMemo(() => getDayOfYear() % dailyChallenges.length, []);
  const challenge = useMemo(() => dailyChallenges[challengeIndex], [challengeIndex]);

  useEffect(() => {
    const completedDate = localStorage.getItem('edukids_daily_challenge_completed');
    if (completedDate === today) {
      setIsCompleted(true);
    }
  }, [today]);

  const handleAnswer = (answer: string) => {
    if (isCompleted) return;
    setSelectedAnswer(answer);
    const correct = answer === challenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      showSuccess('Parabéns! Você acertou e ganhou 1 dica!');
      addHints(1);
      localStorage.setItem('edukids_daily_challenge_completed', today);
      setIsCompleted(true);
    } else {
      showError('Ops! Tente novamente amanhã.');
    }
  };

  return (
    <PageTransition>
      <div>
        <h1 className="text-4xl font-bold tracking-tighter mb-8">Desafio do Dia</h1>
        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              {isCompleted ? "Desafio Concluído!" : "Pergunta de Hoje"}
            </CardTitle>
            <CardDescription>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            {isCompleted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold">Você já completou o desafio de hoje.</p>
                <p className="text-muted-foreground">Volte amanhã para uma nova pergunta!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-2xl font-semibold text-center">{challenge.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {challenge.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const buttonVariant = isSelected ? (isCorrect ? 'default' : 'destructive') : 'outline';
                    
                    return (
                      <Button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={cn("h-16 text-lg", isSelected && isCorrect && "bg-green-600 hover:bg-green-700")}
                        variant={buttonVariant}
                      >
                        {option}
                        {isSelected && isCorrect && <CheckCircle className="ml-3 h-6 w-6" />}
                        {isSelected && !isCorrect && <XCircle className="ml-3 h-6 w-6" />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default DailyChallengePage;