export interface DailyChallenge {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
}

export const dailyChallenges: DailyChallenge[] = [
  { id: 'd001', question: 'Qual animal faz "Miau"?', options: ['Cachorro', 'Gato', 'Pato', 'Leão'], correctAnswer: 'Gato', subject: 'Ciências' },
  { id: 'd002', question: 'Quanto é 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4', subject: 'Matemática' },
  { id: 'd003', question: 'Qual a cor do céu em um dia de sol?', options: ['Verde', 'Vermelho', 'Azul', 'Amarelo'], correctAnswer: 'Azul', subject: 'Ciências' },
  { id: 'd004', question: 'Qual é a primeira letra do alfabeto?', options: ['B', 'C', 'D', 'A'], correctAnswer: 'A', subject: 'Português' },
  { id: 'd005', question: 'Quantos dias tem uma semana?', options: ['5', '6', '7', '8'], correctAnswer: '7', subject: 'Matemática' },
  { id: 'd006', question: 'O que o Sol nos dá?', options: ['Frio e escuridão', 'Chuva e vento', 'Luz e calor', 'Neve e gelo'], correctAnswer: 'Luz e calor', subject: 'Ciências' },
  { id: 'd007', question: 'Qual destes objetos é usado para escrever?', options: ['Bola', 'Lápis', 'Copo', 'Cadeira'], correctAnswer: 'Lápis', subject: 'Geral' },
  { id: 'd008', question: 'Qual o contrário de "grande"?', options: ['Alto', 'Largo', 'Pequeno', 'Forte'], correctAnswer: 'Pequeno', subject: 'Português' },
  { id: 'd009', question: 'Qual planeta nós vivemos?', options: ['Marte', 'Vênus', 'Júpiter', 'Terra'], correctAnswer: 'Terra', subject: 'Ciências' },
  { id: 'd010', question: 'Quanto é 5 - 3?', options: ['1', '2', '3', '4'], correctAnswer: '2', subject: 'Matemática' },
  // Adicione mais desafios conforme necessário
];