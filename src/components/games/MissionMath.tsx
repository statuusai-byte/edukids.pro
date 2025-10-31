import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/utils/toast';
import { useAge } from '@/context/AgeContext';

const GAME_DURATION = 60; // seconds

const generateProblem = (ageGroup: '4-6' | '7-9' | '10-12' | null) => {
  let maxNum = 10;
  const operations = ['+'];
  if (ageGroup === '7-9') {
    maxNum = 20;
    operations.push('-');
  } else if (ageGroup === '10-12') {
    maxNum = 50;
    operations.push('-', '*');
  }

  const op = operations[Math.floor(Math.random() * operations.length)];
  let a = Math.floor(Math.random() * maxNum) + 1;
  let b = Math.floor(Math.random() * maxNum) + 1;
  let answer = 0;
  let question = '';

  switch (op) {
    case '+':
      answer = a + b;
      question = `${a} + ${b} = ?`;
      break;
    case '-':
      if (a < b) [a, b] = [b, a]; // ensure positive result
      answer = a - b;
      question = `${a} - ${b} = ?`;
      break;
    case '*':
      a = Math.floor(Math.random() * 10) + 1; // smaller numbers for multiplication
      b = Math.floor(Math.random() * 10) + 1;
      answer = a * b;
      question = `${a} × ${b} = ?`;
      break;
  }

  return { question, answer };
};

const MissionMath = () => {
  const { ageGroup } = useAge();
  const [problem, setProblem] = useState(generateProblem(ageGroup));
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      showSuccess(`Tempo esgotado! Sua pontuação final é ${score}.`);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive, timeLeft, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsGameActive(true);
    setProblem(generateProblem(ageGroup));
    setUserAnswer('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGameActive) return;

    if (parseInt(userAnswer, 10) === problem.answer) {
      setScore(prev => prev + 1);
      setTimeLeft(prev => prev + 3); // Add 3 seconds for correct answer
      showSuccess('Correto! +3 segundos!');
    } else {
      showError('Incorreto. Tente o próximo!');
    }
    setUserAnswer('');
    setProblem(generateProblem(ageGroup));
  };

  if (!isGameActive) {
    return (
      <Card className="glass-card p-6 text-center">
        <CardContent>
          <h3 className="text-2xl font-bold mb-2">Missão Matemática</h3>
          {timeLeft === 0 ? (
            <>
              <p className="text-lg mb-4">Sua pontuação final foi: <strong className="text-primary text-2xl">{score}</strong></p>
              <Button onClick={startGame} size="lg">Jogar Novamente</Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">Resolva o máximo de problemas que puder em {GAME_DURATION} segundos. Cada acerto adiciona 3 segundos ao relógio!</p>
              <Button onClick={startGame} size="lg">Começar Missão</Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg">Pontuação: <span className="font-bold text-primary">{score}</span></div>
          <div className="text-lg">Tempo: <span className="font-bold text-yellow-400">{timeLeft}s</span></div>
        </div>
        <div className="text-center mb-6">
          <p className="text-5xl font-bold tracking-widest">{problem.question}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="text-2xl h-14 text-center"
            placeholder="Sua resposta"
            autoFocus
          />
          <Button type="submit" size="lg" className="h-14">Enviar</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MissionMath;