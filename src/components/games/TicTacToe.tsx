import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const Square = ({ value, onSquareClick }: { value: 'X' | 'O' | null, onSquareClick: () => void }) => (
  <button 
    className={cn(
      "h-20 w-20 sm:h-24 sm:w-24 text-4xl sm:text-5xl font-bold flex items-center justify-center rounded-lg transition-colors",
      value === 'X' ? 'text-cyan-400' : 'text-amber-400',
      "bg-secondary/50 hover:bg-secondary/80"
    )}
    onClick={onSquareClick}
  >
    {value}
  </button>
);

const calculateWinner = (squares: Array<'X' | 'O' | null>) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  const handleClick = (i: number) => {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  let status;
  if (winner) {
    status = `Vencedor: ${winner}!`;
  } else if (isDraw) {
    status = "Empate!";
  } else {
    status = `Próximo a jogar: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <Card className="glass-card p-4 sm:p-6">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-xl font-semibold text-center h-8">{status}</div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {squares.map((_, i) => (
            <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
          ))}
        </div>
        <Button onClick={handleReset} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Jogar Novamente
        </Button>
      </CardContent>
    </Card>
  );
};

export default TicTacToe;