import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

const WORDS = ["BOLA", "CASA", "PATO", "GATO", "FOCA", "LIVRO", "ESCOLA", "BANANA", "MACACO"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const MAX_GUESSES = 6;

const Hangman = () => {
  const [secretWord, setSecretWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  
  const wrongGuesses = guessedLetters.filter(letter => !secretWord.includes(letter));
  const isWinner = secretWord && secretWord.split('').every(letter => guessedLetters.includes(letter));
  const isLoser = wrongGuesses.length >= MAX_GUESSES;

  const startNewGame = useCallback(() => {
    setSecretWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessedLetters([]);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || isWinner || isLoser) return;
    setGuessedLetters(prev => [...prev, letter]);
  };

  return (
    <Card className="glass-card p-4 sm:p-6">
      <CardContent className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Adivinhe a palavra secreta!</p>
          <p className="text-sm text-muted-foreground">Tentativas restantes: {MAX_GUESSES - wrongGuesses.length}</p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-4 text-3xl sm:text-4xl font-bold tracking-widest min-h-[40px]">
          {secretWord.split('').map((letter, index) => (
            <span key={index} className="border-b-4 border-primary/50 w-8 sm:w-10 text-center">
              {guessedLetters.includes(letter) ? letter : '_'}
            </span>
          ))}
        </div>

        {isWinner && <p className="text-2xl font-bold text-green-400">Você venceu! 🎉</p>}
        {isLoser && <p className="text-2xl font-bold text-red-400">Você perdeu! A palavra era: {secretWord}</p>}

        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {ALPHABET.map(letter => (
            <Button
              key={letter}
              variant="outline"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12 text-lg"
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter) || isWinner || isLoser}
            >
              {letter}
            </Button>
          ))}
        </div>

        <Button onClick={startNewGame} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Nova Palavra
        </Button>
      </CardContent>
    </Card>
  );
};

export default Hangman;