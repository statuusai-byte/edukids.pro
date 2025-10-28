import { IconName } from '@/components/Icon';
import { QuizQuestion } from '@/components/QuizComponent'; // Importando o tipo para clareza

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string; // Agora armazena JSON string para QuizQuestions ou texto para leitura
  type?: 'video' | 'reading' | 'exercise' | 'game';
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  icon: IconName;
  modules: Module[];
}

export interface Subject {
  name: string;
  slug: string;
  icon: IconName;
  color: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  activities: Activity[];
}

/*
  Helpers para gerar muitas perguntas de forma controlada.
  Isso permite encher os quizzes com conteúdo variado sem escrever manualmente centenas de perguntas.
*/

function uniqueOptions(correct: string, distractors: string[]) {
  const opts = [correct, ...distractors.slice(0, 2)];
  // garantir que existem 3 opções únicas
  const set = Array.from(new Set(opts));
  while (set.length < 3) {
    set.push((Number(correct || 0) + set.length).toString());
  }
  return set;
}

function generateAdditionQuestions(count: number, minA = 1, maxA = 12, minB = 1, maxB = 12): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  let a = minA;
  let b = minB;
  for (let i = 0; i < count; i++) {
    a = minA + ((i * 3) % (maxA - minA + 1));
    b = minB + ((i * 5) % (maxB - minB + 1));
    const correct = a + b;
    const wrong1 = Math.max(0, correct + ((i % 3) - 1));
    const wrong2 = Math.max(0, correct + ((i % 4) - 2));
    out.push({
      question: `Quanto é ${a} + ${b}?`,
      options: uniqueOptions(String(correct), [String(wrong1), String(wrong2)]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function generateSubtractionQuestions(count: number, minA = 2, maxA = 20, minB = 1, maxB = 10): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = minA + ((i * 4) % (maxA - minA + 1));
    const b = minB + ((i * 3) % (Math.min(maxB, a - 1) - minB + 1));
    const correct = a - b;
    const wrong1 = Math.max(0, correct + 1);
    const wrong2 = Math.max(0, correct - 1);
    out.push({
      question: `Quanto é ${a} - ${b}?`,
      options: uniqueOptions(String(correct), [String(wrong1), String(wrong2)]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function generateMultiplicationQuestions(count: number, min = 1, max = 12): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = min + ((i * 2) % (max - min + 1));
    const b = min + ((i * 3) % (max - min + 1));
    const correct = a * b;
    const wrong1 = correct + (a % 3) + 1;
    const wrong2 = Math.max(1, correct - ((b % 4) + 1));
    out.push({
      question: `Quanto é ${a} × ${b}?`,
      options: uniqueOptions(String(correct), [String(wrong1), String(wrong2)]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function generateNumberRecognitionQuestions(count: number, maxNum = 20): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = 1 + ((i * 7) % maxNum);
    const wrong1 = Math.max(1, n + ((i % 5) === 0 ? 2 : -1));
    const wrong2 = Math.max(1, n + ((i % 4) === 0 ? 3 : 1));
    out.push({
      question: `Quantos objetos você vê (representação): ${'●'.repeat(n)}`,
      options: uniqueOptions(String(n), [String(wrong1), String(wrong2)]),
      correctAnswer: String(n),
    });
  }
  return out;
}

function generateEnglishNumberQuestions(count = 12, maxNum = 20): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const words = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  for (let i = 0; i < count; i++) {
    const n = 1 + ((i * 3) % Math.min(maxNum, words.length));
    const correctWord = words[n - 1];
    const wrong1 = words[Math.max(0, (n + 1) % words.length)];
    const wrong2 = words[Math.max(0, (n + 2) % words.length)];
    out.push({
      question: `How do you say the number ${n} in English?`,
      options: [correctWord, wrong1, wrong2],
      correctAnswer: correctWord,
    });
  }
  return out;
}

function generateColorQuestions(count = 12) : QuizQuestion[] {
  const palette = [
    { en: 'red', pt: 'Vermelho' },
    { en: 'blue', pt: 'Azul' },
    { en: 'green', pt: 'Verde' },
    { en: 'yellow', pt: 'Amarelo' },
    { en: 'black', pt: 'Preto' },
    { en: 'white', pt: 'Branco' },
    { en: 'orange', pt: 'Laranja' },
    { en: 'purple', pt: 'Roxo' },
    { en: 'pink', pt: 'Rosa' },
    { en: 'brown', pt: 'Marrom' },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const idx = i % palette.length;
    const correct = palette[idx];
    const wrong1 = palette[(idx + 1) % palette.length];
    const wrong2 = palette[(idx + 2) % palette.length];
    out.push({
      question: `How do you say "${correct.pt}" in English?`,
      options: [correct.en, wrong1.en, wrong2.en],
      correctAnswer: correct.en,
    });
  }
  return out;
}

/* Construção dos quizzes ampliados usando os geradores acima. 
   Cada quiz terá um número maior de perguntas (10-16), dependendo do tema.
*/

const quizM1L1 = [
  ...generateNumberRecognitionQuestions(8, 8),
  ...generateAdditionQuestions(4, 1, 5, 1, 5)
];

const quizM1L2 = [
  ...generateAdditionQuestions(8, 2, 6, 1, 5),
  ...generateNumberRecognitionQuestions(4, 10)
];

const quizM1L4 = [
  ...generateAdditionQuestions(6, 1, 6, 1, 6),
  ...generateSubtractionQuestions(6, 4, 10, 1, 4),
];

const quizM1L5 = [
  ...generateSubtractionQuestions(8, 3, 10, 1, 5),
  ...generateAdditionQuestions(4, 1, 6, 1, 6),
];

const quizM1L6 = [
  ...generateAdditionQuestions(6, 1, 8, 1, 8),
  ...generateNumberRecognitionQuestions(6, 8),
];

const quizM2L1 = [
  // perguntas descritivas simples para formas
  { question: "Qual forma tem 0 lados e é redonda?", options: ["Quadrado", "Triângulo", "Círculo"], correctAnswer: "Círculo" },
  { question: "Qual forma tem 3 lados?", options: ["Triângulo", "Retângulo", "Círculo"], correctAnswer: "Triângulo" },
  { question: "Quantos lados tem um quadrado?", options: ["2", "3", "4"], correctAnswer: "4" },
  // adicionar variações
  ...[
    { question: "Qual forma tem 4 cantos iguais?", options: ["Quadrado", "Círculo", "Triângulo"], correctAnswer: "Quadrado" },
    { question: "Qual forma parece uma pizza inteira?", options: ["Quadrado", "Círculo", "Triângulo"], correctAnswer: "Círculo" },
    { question: "Qual forma tem 4 lados, mas nem sempre iguais?", options: ["Quadrado", "Retângulo", "Triângulo"], correctAnswer: "Retângulo" },
  ]
];

const quizM2L2 = [
  ...quizM2L1,
  { question: "Qual destas é um retângulo?", options: ["Janela de casa", "Bola", "Triângulo"], correctAnswer: "Janela de casa" },
  { question: "Um losango tem quantos lados?", options: ["3", "4", "5"], correctAnswer: "4" },
];

const quizM2L3 = [
  { question: "Qual forma tem vértices?", options: ["Círculo", "Quadrado", "Nenhuma"], correctAnswer: "Quadrado" },
  { question: "Qual forma não possui vértices?", options: ["Triângulo", "Quadrado", "Círculo"], correctAnswer: "Círculo" },
  { question: "Uma roda tem a forma de:", options: ["Retângulo", "Círculo", "Triângulo"], correctAnswer: "Círculo" },
  ...generateNumberRecognitionQuestions(3, 6),
];

const quizM3L1 = [
  ...generateAdditionQuestions(8, 1, 6, 1, 6),
  ...generateSubtractionQuestions(4, 2, 8, 1, 5)
];

const quizM3L2 = [
  ...generateAdditionQuestions(6, 2, 9, 1, 5),
  ...generateSubtractionQuestions(6, 1, 10, 1, 6),
];

const quizM3L3 = [
  ...generateAdditionQuestions(8, 3, 10, 2, 7),
  ...generateNumberRecognitionQuestions(4, 12)
];

const quizM3L4 = [
  ...generateAdditionQuestions(6, 2, 10, 1, 8),
  ...generateSubtractionQuestions(6, 1, 10, 1, 8),
];

const quizM4L1 = [
  ...generateMultiplicationQuestions(8, 1, 6),
  ...generateAdditionQuestions(4, 1, 10, 1, 10)
];

const quizM4L2 = [
  ...generateMultiplicationQuestions(10, 1, 10),
  ...generateSubtractionQuestions(2, 5, 20, 1, 10)
];

const quizM4L3 = [
  ...generateMultiplicationQuestions(12, 2, 12)
];

const quizM4L4 = [
  ...generateMultiplicationQuestions(12, 2, 12)
];

const quizM5L2 = [
  // questões sobre frações simples e equivalências
  { question: "Qual fração representa metade?", options: ["1/2", "1/3", "1/4"], correctAnswer: "1/2" },
  { question: "2/4 é equivalente a:", options: ["1/2", "1/4", "2/2"], correctAnswer: "1/2" },
  { question: "Se você divide algo em 4 e pega 1, qual fração é essa?", options: ["1/4", "2/4", "3/4"], correctAnswer: "1/4" },
  ...[
    { question: "Qual fração é maior: 1/3 ou 1/4?", options: ["1/3", "1/4", "São iguais"], correctAnswer: "1/3" },
    { question: "Quantos 1/4 cabem em 1?", options: ["2", "4", "8"], correctAnswer: "4" },
    { question: "2/8 é equivalente a:", options: ["1/4", "1/2", "1/8"], correctAnswer: "1/4" }
  ]
];

const quizM5L3 = [
  ...quizM5L2,
  { question: "Metade de 10 é:", options: ["4", "5", "6"], correctAnswer: "5" },
  { question: "2/3 é maior ou menor que 1/2?", options: ["Maior", "Menor", "Iguais"], correctAnswer: "Maior" }
];

const quizM5L4 = [
  ...quizM5L2,
  { question: "Quantos 1/8 existem em 1/2?", options: ["4", "2", "8"], correctAnswer: "4" },
  { question: "Se sobrou 3/4 da pizza, que fração foi comida?", options: ["1/4", "3/4", "2/4"], correctAnswer: "1/4" }
];

const quizM6L1 = [
  ...generateAdditionQuestions(6, 5, 20, 1, 10),
  ...generateSubtractionQuestions(6, 5, 20, 1, 10)
];

const quizM6L2 = [
  ...generateAdditionQuestions(6, 10, 40, 5, 20),
  ...generateSubtractionQuestions(6, 5, 30, 1, 15)
];

const quizM6L3 = [
  { question: "Se o desconto é 10% de R$20, quanto pagamos?", options: ["R$18", "R$19", "R$17"], correctAnswer: "R$18" },
  ...generateMultiplicationQuestions(4, 2, 10),
  ...generateSubtractionQuestions(4, 5, 30, 1, 10)
];

const quizM6L4 = [
  ...generateNumberRecognitionQuestions(6, 20),
  ...generateAdditionQuestions(6, 5, 30, 5, 30)
];

const quizM7L2 = [
  ...generateAdditionQuestions(4, 5, 20, 5, 20),
  { question: "Perímetro é:", options: ["A área", "A soma dos lados", "O centro"], correctAnswer: "A soma dos lados" }
];

const quizM7L3 = [
  ...generateMultiplicationQuestions(6, 2, 12),
  ...generateAdditionQuestions(4, 2, 15, 2, 15)
];

const quizM7L4 = [
  ...generateMultiplicationQuestions(6, 1, 12),
  ...generateAdditionQuestions(6, 1, 20, 1, 20)
];

/* -- Português (aumentando com perguntas geradas simples e variações) */

function generateLetterIdentification(count = 8) {
  const words = ['BOLA','CASA','PATO','GATO','FOCA','MALA','SOL','LUA','RUA','OLHO','PEIXE','CARRO'];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const w = words[i % words.length];
    const correct = w.charAt(0);
    const wrong1 = String.fromCharCode(65 + ((i + 2) % 26));
    const wrong2 = String.fromCharCode(65 + ((i + 5) % 26));
    out.push({
      question: `Qual letra começa a palavra '${w}'?`,
      options: [correct, wrong1, wrong2],
      correctAnswer: correct
    });
  }
  return out;
}

const quizP1L1 = [
  ...generateLetterIdentification(12)
];

const quizP1L2 = [
  ...generateLetterIdentification(10)
];

const quizP1L3 = [
  { question: "Forme a palavra com as letras L-U-A: qual é a palavra?", options: ["LUA","SOL","RUA"], correctAnswer: "LUA" },
  ...generateLetterIdentification(6)
];

const quizP1L4 = [
  { question: "Na frase 'O gato comeu o peixe.', quantas vezes aparece a letra 'O'?", options: ["1","2","3"], correctAnswer: "3" },
  ...generateLetterIdentification(4)
];

const quizP2L1 = [
  { question: "Quantas sílabas tem 'PATO'?", options: ["1","2","3"], correctAnswer: "2" },
  { question: "Quantas sílabas tem 'JANELA'?", options: ["2","3","4"], correctAnswer: "3" },
  { question: "Quantas sílabas tem 'BOLA'?", options: ["1","2","3"], correctAnswer: "2" },
  { question: "Quantas sílabas tem 'GATO'?", options: ["1","2","3"], correctAnswer: "2" },
];

const quizP2L2 = [
  { question: "CA + SA forma qual palavra?", options: ["CASA","CALA","COLA"], correctAnswer: "CASA" },
  { question: "MA + LA forma qual palavra?", options: ["MALA","MULA","MORA"], correctAnswer: "MALA" },
  ...generateLetterIdentification(4)
];

const quizP3L1 = [
  { question: "Qual palavra rima com 'PÃO'?", options: ["MÃO","SOL","GATO"], correctAnswer: "MÃO" },
  { question: "Qual palavra rima com 'LUA'?", options: ["SUA","CÃO","CARRO"], correctAnswer: "SUA" },
  ...generateLetterIdentification(4)
];

const quizP3L2 = [
  { question: "Qual palavra rima com 'CÃO'?", options: ["MÃO","PÃO","SOL"], correctAnswer: "MÃO" },
  { question: "Complete: 'O sapo pulou no ___' (RIO)", options: ["RIO","MAR","LAGO"], correctAnswer: "RIO" },
  ...generateLetterIdentification(3)
];

const quizP4L1 = [
  { question: "Quem é o personagem principal da frase 'O cachorro Rex gosta de correr no parque'?", options: ["O cachorro Rex","O parque","A menina"], correctAnswer: "O cachorro Rex" },
  { question: "Qual é a ideia principal do texto 'O sol nasceu...'? ", options: ["O dia começou","O sol é quente","Os pássaros cantam"], correctAnswer: "O dia começou" },
  ...generateLetterIdentification(3)
];

const quizP4L2 = [
  { question: "Quem ganhou a corrida entre tartaruga e coelho?", options: ["A tartaruga","O coelho","Ninguém"], correctAnswer: "A tartaruga" },
  { question: "Qual é a moral da história?", options: ["A pressa é inimiga da perfeição","Correr é melhor","Dormir é ruim"], correctAnswer: "A pressa é inimiga da perfeição" },
];

const quizP5L1 = [
  { question: "Qual palavra precisa de acento: 'cafe'?", options: ["CAFÉ","MESA","BOLO"], correctAnswer: "CAFÉ" },
  { question: "Que tipo de acento tem a palavra 'VÔO' (tradicional)?", options: ["Circunflexo","Agudo","Til"], correctAnswer: "Circunflexo" },
  { question: "Qual é a forma correta: 'você' ou 'voce'?", options: ["VOCÊ","VOCE","VOCÊS"], correctAnswer: "VOCÊ" },
];

const quizP5L2 = [
  { question: "Como se acentua 'voce' corretamente?", options: ["VOCÊ","VOCE","VÓCE"], correctAnswer: "VOCÊ" },
  { question: "Qual a forma correta: 'arvore'?", options: ["ÁRVORE","ARVORE","ARVÕRE"], correctAnswer: "ÁRVORE" },
  ...generateLetterIdentification(2)
];

const quizP6L1 = [
  { question: "Na frase 'O menino comeu a maçã', qual é o substantivo?", options: ["menino","comeu","maçã"], correctAnswer: "menino" },
  { question: "Qual palavra é verbo: 'cantar'?", options: ["Verbo","Adjetivo","Substantivo"], correctAnswer: "Verbo" },
  ...generateLetterIdentification(2)
];

const quizP6L2 = [
  { question: "Qual é o adjetivo em 'O carro é rápido'?", options: ["rápido","carro","é"], correctAnswer: "rápido" },
  { question: "Qual palavra é um adjetivo: 'feliz'?", options: ["Adjetivo","Substantivo","Verbo"], correctAnswer: "Adjetivo" },
];

const quizP7L1 = [
  { question: "Qual é a primeira parte de uma história?", options: ["Início","Meio","Fim"], correctAnswer: "Início" },
  { question: "O que é o conflito em uma história?", options: ["O problema principal","O desfecho","A ambientação"], correctAnswer: "O problema principal" },
];

const quizP7L2 = [
  { question: "O que um adjetivo faz?", options: ["Descreve um substantivo","Define um verbo","Muda o tempo"], correctAnswer: "Descreve um substantivo" },
  { question: "Qual palavra tem força de verbo mais intensa que 'andou rápido'?", options: ["Disparou","Caminhou","Parou"], correctAnswer: "Disparou" },
];

/* Ciências, História, Geografia, Inglês e demais — aumentar quizzes com geradores e templates. */

const quizC1L2 = [
  { question: "Qual órgão usamos para respirar?", options: ["Pulmões","Coração","Estômago"], correctAnswer: "Pulmões" },
  { question: "O que nós absorvemos do ar?", options: ["Oxigênio","Gás carbônico","Agua"], correctAnswer: "Oxigênio" },
  { question: "Onde acontece a digestão principal?", options: ["Estômago","Coração","Pulmões"], correctAnswer: "Estômago" },
  { question: "Qual destes é bom para os ossos?", options: ["Leite","Refrigerante","Doces"], correctAnswer: "Leite" },
];

const quizC1L3 = [
  { question: "Por que lavar as mãos antes de comer?", options: ["Remover germes","Aparência","Cheirar melhor"], correctAnswer: "Remover germes" },
  { question: "O que ajuda a manter ossos saudáveis?", options: ["Leite","Balas","Refrigerante"], correctAnswer: "Leite" },
];

const quizH1L2 = [
  { question: "Quem comandou a frota que chegou ao Brasil em 1500?", options: ["Pedro Álvares Cabral","Cristóvão Colombo","Vasco da Gama"], correctAnswer: "Pedro Álvares Cabral" },
  { question: "Em que ano chegaram os portugueses ao Brasil (comumente citado)?", options: ["1500","1492","1600"], correctAnswer: "1500" },
  { question: "Os europeus buscavam principalmente:", options: ["Especiarias e lucro","Estudar linguas","Participar de festas"], correctAnswer: "Especiarias e lucro" },
];

const quizH1L3 = [
  { question: "Qual foi uma consequência para os povos indígenas após a colonização?", options: ["Perda de terras","Mais proteção","Aumento populacional"], correctAnswer: "Perda de terras" },
  { question: "O que trouxe o contato com europeus para os indígenas?", options: ["Novas doenças","Tecnologia avançada imediata","Paz duradoura"], correctAnswer: "Novas doenças" },
];

const quizG1L1 = [
  { question: "Capital do Brasil é:", options: ["Brasília","Rio de Janeiro","São Paulo"], correctAnswer: "Brasília" },
  { question: "Capital de São Paulo é:", options: ["São Paulo","Campinas","Santos"], correctAnswer: "São Paulo" },
  { question: "Qual é um uso da legenda em um mapa?", options: ["Explicar símbolos","Contar piadas","Mostrar vídeos"], correctAnswer: "Explicar símbolos" },
];

const quizI1L1 = [
  ...generateEnglishNumberQuestions(8, 12),
  ...generateColorQuestions(4)
];

const quizL1L1 = [
  { question: "Qual é o próximo: 🔴, 🔵, 🔴, 🔵, ___?", options: ["🔵","🔴","🟢"], correctAnswer: "🔴" },
  { question: "Qual é o próximo: 1, 4, 7, 10, ___?", options: ["13","11","14"], correctAnswer: "13" },
  ...generateNumberRecognitionQuestions(6, 15)
];

const quizA1L2 = [
  { question: "Quais são as cores primárias?", options: ["Vermelho, Azul, Amarelo","Roxo, Verde, Laranja","Preto, Branco, Cinza"], correctAnswer: "Vermelho, Azul, Amarelo" },
  { question: "Misturando azul e amarelo, qual cor aparece?", options: ["Verde","Roxo","Laranja"], correctAnswer: "Verde" },
  ...generateColorQuestions(6)
];

const quizMu1L1 = [
  { question: "O violão é um instrumento de qual família?", options: ["Corda","Sopro","Percussão"], correctAnswer: "Corda" },
  { question: "Flauta é de qual família?", options: ["Sopro","Cordas","Percussão"], correctAnswer: "Sopro" },
  ...generateNumberRecognitionQuestions(4, 6)
];

const quizPr1L1 = [
  { question: "O que é um algoritmo?", options: ["Sequência de passos","Um tipo de robô","Um número"], correctAnswer: "Sequência de passos" },
  { question: "Se você repetir 'Pular' 5 vezes, quantas pulos terá?", options: ["5","1","2"], correctAnswer: "5" },
  ...generateNumberRecognitionQuestions(3, 6)
];

const quizPr1L2 = [
  { question: "Um loop serve para:", options: ["Repetir uma ação","Parar o programa","Mudar cor"], correctAnswer: "Repetir uma ação" },
  { question: "Repetir 3 vezes 'Andar' fará você andar quantas vezes?", options: ["3","1","6"], correctAnswer: "3" },
];

const quizR1L2 = [
  { question: "Qual componente detecta obstáculos em um robô?", options: ["Sensor","Motor","Bateria"], correctAnswer: "Sensor" },
  { question: "O que a bateria fornece ao robô?", options: ["Energia","Peças","Instruções"], correctAnswer: "Energia" },
];

const quizF1L1 = [
  { question: "Se você ganha R$10 e gasta R$3, quanto sobra?", options: ["R$7","R$13","R$3"], correctAnswer: "R$7" },
  { question: "O que é 'renda'?", options: ["Dinheiro recebido","Dinheiro gasto","Dinheiro guardado"], correctAnswer: "Dinheiro recebido" },
];

const quizF1L2 = [
  { question: "Se quer comprar um brinquedo de R$50 e guarda R$10 por semana, quantas semanas precisa?", options: ["5","4","10"], correctAnswer: "5" },
  { question: "O que significa poupar?", options: ["Guardar dinheiro","Gastar tudo","Doar tudo"], correctAnswer: "Guardar dinheiro" },
];

/* Exportando subjectsData com JSON.stringify nas lições que usam quizzes */
export const subjectsData: Subject[] = [
  {
    name: "Matemática",
    slug: "matematica",
    icon: "Sigma",
    color: "cyan",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "m1",
        title: "Contagem e Reconhecimento Numérico",
        description: "Desenvolvimento da percepção quantitativa e associação de números a quantidades concretas.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m1-mod-intro",
            title: "Números 1 a 5: A Base",
            description: "Foco na contagem sequencial e identificação visual de pequenos grupos.",
            lessons: [
              { id: "m1-l1", title: "Quantidades Iniciais (1-3)", description: "Prática de contagem até 3 com objetos visuais.", content: JSON.stringify(quizM1L1), type: "exercise" },
              { id: "m1-l2", title: "Expandindo a Contagem (4-5)", description: "Introdução ao número 4 e 5 e pequenos problemas de adição.", content: JSON.stringify(quizM1L2), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-atividades",
            title: "Jogos de Fixação Rápida",
            description: "Atividades interativas para reforçar a memorização e a velocidade de resposta.",
            lessons: [
              { id: "m1-l3", title: "Jogo Rápido: Escolha o Número", description: "Jogo de contagem visual rápida (ContandoFrutas).", content: "Clique no número correto que representa a quantidade de maçãs.", type: "game" },
              { id: "m1-l4", title: "Desafio de Adição Visual", description: "Resolução de problemas simples de adição e subtração.", content: JSON.stringify(quizM1L4), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-revisao",
            title: "Revisão e Avaliação",
            description: "Testes finais para garantir a retenção dos conceitos de 1 a 5.",
            lessons: [
              { id: "m1-l5", title: "Mix de Frutas e Subtração", description: "Prática de subtração básica com objetos.", content: JSON.stringify(quizM1L5), type: "exercise" },
              { id: "m1-l6", title: "Autoavaliação Final", description: "Teste abrangente de contagem e raciocínio numérico.", content: JSON.stringify(quizM1L6), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Geometria: Formas e Espaço",
        description: "Identificação de formas geométricas básicas e sua aplicação no ambiente.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m2-mod-1",
            title: "Reconhecendo Formas Planas",
            lessons: [
              { id: "m2-l1", title: "Círculos e Triângulos", description: "Aprenda as características e o número de lados de círculos e triângulos.", content: JSON.stringify(quizM2L1), type: "exercise" },
              { id: "m2-l2", title: "Quadrados e Retângulos", description: "Diferenciando formas com quatro lados.", content: JSON.stringify(quizM2L2), type: "exercise" }
            ]
          },
          {
            id: "m2-mod-2",
            title: "Formas no Mundo Real",
            lessons: [
              { id: "m2-l3", title: "Identificação em Objetos", description: "Associe formas geométricas a objetos do dia a dia.", content: JSON.stringify(quizM2L3), type: "exercise" },
              { id: "m2-l4", title: "Atividade Criativa de Desenho", description: "Tarefa prática para usar formas na criação de desenhos.", content: "Tarefa: Desenhe uma cena usando pelo menos um círculo, um quadrado e um triângulo. (Requer supervisão dos pais).", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m3",
        title: "Adição e Subtração (7-9 anos)",
        description: "Domínio das operações fundamentais com números até 20, utilizando recursos visuais.",
        ageGroups: ['7-9'],
        icon: "Apple",
        modules: [
          {
            id: "m3-mod-basico",
            title: "Fundamentos da Soma e Subtração",
            lessons: [
              { id: "m3-l1", title: "Soma Simples (1 a 5)", description: "Revisão e prática de somas iniciais.", content: JSON.stringify(quizM3L1), type: "exercise" },
              { id: "m3-l2", title: "Problemas com Objetos", description: "Resolução de problemas de adição e subtração com contexto.", content: JSON.stringify(quizM3L2), type: "exercise" }
            ]
          },
          {
            id: "m3-mod-visual",
            title: "Visualização e Raciocínio",
            lessons: [
              { id: "m3-l3", title: "Somas com Barras (até 10)", description: "Uso de modelos de barras para entender a composição numérica.", content: JSON.stringify(quizM3L3), type: "exercise" },
              { id: "m3-l4", title: "Problemas de Duas Etapas", description: "Introdução a problemas que exigem mais de uma operação.", content: JSON.stringify(quizM3L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m4",
        title: "Multiplicação e Tabuada",
        description: "Memorização e compreensão da multiplicação como adição repetida (Tabuada de 1 a 10).",
        ageGroups: ['7-9', '10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m4-mod-1",
            title: "Tabuada Inicial (1 a 5)",
            lessons: [
              { id: "m4-l1", title: "Multiplicação como Soma", description: "Entenda o conceito de grupos iguais.", content: JSON.stringify(quizM4L1), type: "exercise" },
              { id: "m4-l2", title: "Quiz Rápido de 1 a 5", description: "Teste de velocidade e precisão nas tabuadas iniciais.", content: JSON.stringify(quizM4L2), type: "exercise" }
            ]
          },
          {
            id: "m4-mod-2",
            title: "Domínio da Tabuada (6 a 10)",
            lessons: [
              { id: "m4-l3", title: "Tabuada do 6 ao 10", description: "Estratégias de memorização para tabuadas mais difíceis.", content: JSON.stringify(quizM4L3), type: "exercise" },
              { id: "m4-l4", title: "Desafio de 60s", description: "Teste final de fluência na multiplicação.", content: JSON.stringify(quizM4L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m5",
        title: "Frações e Decimais",
        description: "Introdução aos conceitos de partes de um todo, equivalência e comparação de frações.",
        ageGroups: ['7-9', '10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m5-mod-1",
            title: "Conceitos Fundamentais",
            lessons: [
              { id: "m5-l1", title: "O que são Frações?", description: "Vídeo explicativo sobre numerador, denominador e o conceito de partes iguais.", videoUrl: "https://www.youtube.com/embed/CGyEd0aKWZE", type: "video" },
              { id: "m5-l2", title: "Meio, Terço e Quarto", description: "Identificação e nomeação das frações mais comuns.", content: JSON.stringify(quizM5L2), type: "exercise" }
            ]
          },
          {
            id: "m5-mod-2",
            title: "Comparação e Equivalência",
            lessons: [
              { id: "m5-l3", title: "Frações Equivalentes", description: "Identifique frações que representam a mesma quantidade.", content: JSON.stringify(quizM5L3), type: "exercise" },
              { id: "m5-l4", title: "Desafio Visual de Frações", description: "Jogo com comparação e equivalência de frações.", content: JSON.stringify(quizM5L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m6",
        title: "Raciocínio Lógico e Resolução de Problemas",
        description: "Desenvolvimento do pensamento analítico através de problemas matemáticos de múltiplas etapas.",
        ageGroups: ['10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m6-mod-1",
            title: "Estratégias de Raciocínio",
            lessons: [
              { id: "m6-l1", title: "Problemas de Tempo e Distância", description: "Desafios simples de raciocínio envolvendo unidades de medida.", content: JSON.stringify(quizM6L1), type: "exercise" },
              { id: "m6-l2", title: "Pense em Etapas (Fluxograma)", description: "Aprenda a dividir problemas complexos em passos lógicos.", content: JSON.stringify(quizM6L2), type: "exercise" }
            ]
          },
          {
            id: "m6-mod-2",
            title: "Desafios Avançados",
            lessons: [
              { id: "m6-l3", title: "Problemas com Porcentagem e Geometria", description: "Integração de diferentes conceitos matemáticos.", content: JSON.stringify(quizM6L3), type: "exercise" },
              { id: "m6-l4", title: "Sequências Numéricas e Padrões", description: "Identificação de padrões e regras em sequências complexas.", content: JSON.stringify(quizM6L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m7",
        title: "Geometria: Perímetro e Área",
        description: "Cálculo de medidas espaciais e aplicação de fórmulas geométricas básicas.",
        ageGroups: ['10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m7-mod-1",
            title: "Medidas Lineares e Ângulos",
            lessons: [
              { id: "m7-l1", title: "Ângulos: Tipos e Medidas", description: "Vídeo sobre ângulos retos, agudos e obtusos.", videoUrl: "https://www.youtube.com/embed/8ZK0hXp1mvM", type: "video" },
              { id: "m7-l2", title: "Perímetro: A Volta da Figura", description: "Conceito e cálculo do perímetro de polígonos.", content: JSON.stringify(quizM7L2), type: "exercise" }
            ]
          },
          {
            id: "m7-mod-2",
            title: "Área e Aplicações",
            lessons: [
              { id: "m7-l3", title: "Área de Retângulos e Quadrados", description: "Fórmulas e prática de cálculo de área.", content: JSON.stringify(quizM7L3), type: "exercise" },
              { id: "m7-l4", title: "Problemas do Mundo Real", description: "Aplicação de perímetro e área em situações cotidianas (ex: pintura de parede).", content: JSON.stringify(quizM7L4), type: "exercise" }
            ]
          }
        ]
      }
    ],
  },
  // Português (mantido e ampliado)
  {
    name: "Português",
    slug: "portugues",
    icon: "BookOpen",
    color: "purple",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "p1",
        title: "Alfabetização: Letras e Fonemas",
        description: "Reconhecimento de letras, associação de sons (fonemas) e formação de palavras simples.",
        ageGroups: ['4-6'],
        icon: "BookOpen",
        modules: [
          {
            id: "p1-mod-1",
            title: "Conhecendo o Alfabeto",
            lessons: [
              { id: "p1-l1", title: "Sons Iniciais e Vogais", description: "Associe letras a sons e imagens iniciais.", content: JSON.stringify(quizP1L1), type: "exercise" },
              { id: "p1-l2", title: "Identificação de Letras", description: "Localize letras no começo e fim de palavras.", content: JSON.stringify(quizP1L2), type: "exercise" }
            ]
          },
          {
            id: "p1-mod-2",
            title: "Formando Palavras Curtas",
            lessons: [
              { id: "p1-l3", title: "Montando Palavras Simples (3-4 letras)", description: "Junte letras para formar palavras curtas e significativas.", content: JSON.stringify(quizP1L3), type: "exercise" },
              { id: "p1-l4", title: "Caça às Letras em Frases", description: "Exercício de atenção e reconhecimento de letras em contexto.", content: JSON.stringify(quizP1L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p2",
        title: "Silabação e Construção de Vocabulário",
        description: "Desenvolvimento da consciência fonológica através da divisão e combinação de sílabas.",
        ageGroups: ['4-6', '7-9'],
        icon: "BookOpen",
        modules: [
          {
            id: "p2-mod-1",
            title: "Entendendo as Sílabas",
            lessons: [
              { id: "p2-l1", title: "Divisão Silábica Básica", description: "Conte e separe palavras em sílabas.", content: JSON.stringify(quizP2L1), type: "exercise" },
              { id: "p2-l2", title: "Combinando Sílabas", description: "Combine sílabas para formar novas palavras.", content: JSON.stringify(quizP2L2), type: "exercise" }
            ]
          },
          {
            id: "p2-mod-2",
            title: "Jogos de Formação",
            lessons: [
              { id: "p2-l3", title: "Forme Palavras com Imagens", description: "Jogo interativo de arrastar e soltar sílabas (FormandoPalavras).", type: "game" },
              { id: "p2-l4", title: "Desafio de Velocidade Silábica", description: "Prática rápida de montagem de palavras.", type: "game" }
            ]
          }
        ]
      },
      {
        id: "p3",
        title: "Rimas e Poesia",
        description: "Desenvolvimento da percepção auditiva e criatividade através da identificação e criação de rimas.",
        ageGroups: ['4-6', '7-9'],
        icon: "BookOpen",
        modules: [
          {
            id: "p3-mod-1",
            title: "O Som das Palavras",
            lessons: [
              { id: "p3-l1", title: "Identificando Rimas", description: "Encontre pares de palavras com sons finais semelhantes.", content: JSON.stringify(quizP3L1), type: "exercise" },
              { id: "p3-l2", title: "Criando Versos Simples", description: "Complete frases e crie rimas curtas.", content: JSON.stringify(quizP3L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p4",
        title: "Interpretação e Compreensão de Texto",
        description: "Técnicas para extrair informações, identificar ideias centrais e tirar conclusões de textos curtos.",
        ageGroups: ['7-9', '10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p4-mod-1",
            title: "Leitura Ativa",
            lessons: [
              { id: "p4-l1", title: "Extração de Informação Explícita", description: "Responda a perguntas baseadas em fatos diretamente no texto.", content: JSON.stringify(quizP4L1), type: "exercise" },
              { id: "p4-l2", title: "Inferência e Resumo", description: "Aprenda a identificar a moral da história e a resumir o conteúdo.", content: JSON.stringify(quizP4L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p5",
        title: "Ortografia e Acentuação",
        description: "Domínio das regras básicas de acentuação e ortografia para escrita correta.",
        ageGroups: ['7-9', '10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p5-mod-1",
            title: "Regras de Acentuação",
            lessons: [
              { id: "p5-l1", title: "Acentos Agudo e Circunflexo", description: "Diferencie e aplique os acentos corretamente.", content: JSON.stringify(quizP5L1), type: "exercise" },
              { id: "p5-l2", title: "Exercícios de Correção", description: "Pratique a acentuação em palavras comuns.", content: JSON.stringify(quizP5L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p6",
        title: "Classes Gramaticais Fundamentais",
        description: "Identificação e uso correto de substantivos, adjetivos e verbos para construir frases ricas.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p6-mod-1",
            title: "Estrutura da Frase",
            lessons: [
              { id: "p6-l1", title: "Substantivos e Verbos", description: "Marque substantivos (nomes) e verbos (ações) em frases.", content: JSON.stringify(quizP6L1), type: "exercise" },
              { id: "p6-l2", title: "O Poder dos Adjetivos", description: "Use adjetivos para dar qualidade e detalhe aos substantivos.", content: JSON.stringify(quizP6L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p7",
        title: "Produção de Texto Criativa",
        description: "Desenvolvimento de habilidades de escrita, desde o planejamento até a revisão final.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p7-mod-1",
            title: "Planejamento e Estrutura",
            lessons: [
              { id: "p7-l1", title: "Estrutura Narrativa (Início, Meio, Fim)", description: "Organize as ideias antes de começar a escrever.", content: JSON.stringify(quizP7L1), type: "exercise" },
              { id: "p7-l2", title: "Vocabulário Rico e Expressivo", description: "Escolha palavras fortes para tornar o texto envolvente.", content: JSON.stringify(quizP7L2), type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  // Ciências, História, Geografia, Inglês e os demais (com quizzes ampliados)
  {
    name: "Ciências",
    slug: "ciencias",
    icon: "FlaskConical",
    color: "green",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "c1",
        title: "Anatomia e Saúde Humana",
        description: "Estudo dos principais sistemas do corpo humano e a importância de hábitos saudáveis.",
        ageGroups: ['7-9', '10-12'],
        icon: "FlaskConical",
        modules: [
          {
            id: "c1-mod-1",
            title: "Sistemas Vitais",
            lessons: [
              { id: "c1-l1", title: "Sistema Digestório", description: "Como os alimentos são transformados em energia.", content: "O sistema digestório começa na boca e termina no intestino grosso. O estômago é o principal órgão onde a quebra dos alimentos acontece. (Leitura e Quiz)", type: "reading" },
              { id: "c1-l2", title: "Sistema Respiratório", description: "A troca gasosa e a função dos pulmões.", content: JSON.stringify(quizC1L2), type: "exercise" }
            ]
          },
          {
            id: "c1-mod-2",
            title: "Cuidados e Prevenção",
            lessons: [
              { id: "c1-l3", title: "Higiene e Nutrição", description: "Práticas essenciais para manter o corpo forte e livre de doenças.", content: JSON.stringify(quizC1L3), type: "exercise" },
              { id: "c1-l4", title: "Experimento Simples: Pulmão", description: "Demonstração prática da função pulmonar usando materiais simples.", content: "Experimento: Use uma garrafa, balões e canudos para simular como os pulmões enchem e esvaziam. (Requer supervisão dos pais).", type: "exercise" }
            ]
          }
        ]
      },
    ]
  },
  {
    name: "História",
    slug: "historia",
    icon: "Landmark",
    color: "orange",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "h1",
        title: "Fundamentos da História do Brasil",
        description: "Análise dos eventos chave que moldaram o Brasil, desde os povos originários até a colonização.",
        ageGroups: ['7-9', '10-12'],
        icon: "Landmark",
        modules: [
          {
            id: "h1-mod-1",
            title: "O Brasil Antes de 1500",
            lessons: [
              { id: "h1-l1", title: "Povos Indígenas e Culturas", description: "Quem eram e como viviam os habitantes originais do Brasil.", content: "Os povos indígenas tinham culturas ricas e diversas, vivendo em harmonia com a natureza. Eles não tinham o conceito de 'país' como conhecemos hoje. (Leitura e Quiz)", type: "reading" },
              { id: "h1-l2", title: "A Chegada dos Europeus", description: "O contexto das Grandes Navegações e a chegada de Cabral.", content: JSON.stringify(quizH1L2), type: "exercise" }
            ]
          },
          {
            id: "h1-mod-2",
            title: "Impacto da Colonização",
            lessons: [
              { id: "h1-l3", title: "Consequências Culturais e Sociais", description: "O que mudou para os indígenas e o início da exploração.", content: JSON.stringify(quizH1L3), type: "exercise" },
              { id: "h1-l4", title: "Linha do Tempo Interativa", description: "Organize os eventos históricos na ordem correta.", content: "Tarefa: Crie uma linha do tempo visual dos eventos de 1490 a 1550.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Geografia",
    slug: "geografia",
    icon: "Globe",
    color: "teal",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "g1",
        title: "Cartografia e Regiões Brasileiras",
        description: "Aprendizado sobre mapas, orientação e as características das regiões do Brasil.",
        ageGroups: ['7-9', '10-12'],
        icon: "Globe",
        modules: [
          {
            id: "g1-mod-1",
            title: "O Mapa Político do Brasil",
            lessons: [
              { id: "g1-l1", title: "Estados e Capitais", description: "Localize e memorize os estados e suas capitais.", content: JSON.stringify(quizG1L1), type: "exercise" },
              { id: "g1-l2", title: "Leitura de Mapas", description: "Entenda o uso de legendas, escalas e pontos cardeais.", content: "Aprenda a usar a rosa dos ventos para se orientar em qualquer mapa. (Leitura e Quiz)", type: "reading" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Inglês",
    slug: "ingles",
    icon: "SpellCheck",
    color: "indigo",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "i1",
        title: "Vocabulário Essencial: Cores e Números",
        description: "Construção do vocabulário básico para comunicação diária em inglês.",
        ageGroups: ['7-9'],
        icon: "SpellCheck",
        modules: [
          {
            id: "i1-mod-1",
            title: "Cores e Adjetivos",
            lessons: [
              { id: "i1-l1", title: "Colors in English", description: "Nomes das cores e como usá-las em frases simples.", content: JSON.stringify(quizI1L1), type: "exercise" },
              { id: "i1-l2", title: "Numbers 1 to 10", description: "Contagem e pronúncia correta dos números.", videoUrl: "https://www.youtube.com/embed/d3LLHe2fM0w", type: "video" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Lógica",
    slug: "logica",
    icon: "Brain",
    color: "yellow",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "l1",
        title: "Identificação de Padrões e Sequências",
        description: "Desenvolvimento do raciocínio indutivo e da capacidade de prever o próximo passo em uma série.",
        ageGroups: ['4-6', '7-9'],
        icon: "Brain",
        modules: [
          {
            id: "l1-mod-1",
            title: "Padrões Visuais e Numéricos",
            lessons: [
              { id: "l1-l1", title: "Sequências de Cores e Formas", description: "Identifique e complete padrões visuais e numéricos simples.", content: JSON.stringify(quizL1L1), type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Artes",
    slug: "artes",
    icon: "Palette",
    color: "red",
    ageGroups: ['4-6', '7-9'],
    activities: [
      {
        id: "a1",
        title: "Teoria das Cores e Desenho",
        description: "Introdução às cores primárias, secundárias e técnicas básicas de desenho.",
        ageGroups: ['4-6', '7-9'],
        icon: "Palette",
        modules: [
          {
            id: "a1-mod-1",
            title: "Fundamentos da Cor",
            lessons: [
              { id: "a1-l1", title: "Cores Primárias e Secundárias", description: "Aprenda quais cores se misturam para criar novas cores.", content: "As cores primárias são Vermelho, Amarelo e Azul. Misturando-as, criamos as cores secundárias. (Leitura e Quiz)", type: "reading" },
              { id: "a1-l2", title: "Mistura de Cores", description: "Teste seus conhecimentos sobre a criação de cores secundárias.", content: JSON.stringify(quizA1L2), type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Música",
    slug: "musica",
    icon: "Music",
    color: "pink",
    ageGroups: ['4-6', '7-9'],
    activities: [
      {
        id: "mu1",
        title: "Introdução aos Instrumentos e Ritmo",
        description: "Reconhecimento de famílias de instrumentos e desenvolvimento do senso rítmico.",
        ageGroups: ['4-6', '7-9'],
        icon: "Music",
        modules: [
          {
            id: "mu1-mod-1",
            title: "Famílias de Instrumentos",
            lessons: [
              { id: "mu1-l1", title: "Cordas, Sopro e Percussão", description: "Identifique a qual família pertence cada instrumento.", content: JSON.stringify(quizMu1L1), type: "exercise" },
              { id: "mu1-l2", title: "Marcando o Pulso", description: "Exercício prático para manter o ritmo e o tempo musical.", content: "Bata palmas no ritmo da música que está tocando. O pulso é o 'coração' da música.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Programação",
    slug: "programacao",
    icon: "Code",
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "pr1",
        title: "Fundamentos de Algoritmos e Lógica",
        description: "Introdução ao pensamento sequencial, loops e condicionais, essenciais para a codificação.",
        ageGroups: ['10-12'],
        icon: "Code",
        modules: [
          {
            id: "pr1-mod-1",
            title: "Sequência e Repetição",
            lessons: [
              { id: "pr1-l1", title: "Comandos Sequenciais", description: "Entenda a ordem de execução das instruções.", content: JSON.stringify(quizPr1L1), type: "exercise" },
              { id: "pr1-l2", title: "Loops (Repetição)", description: "Aprenda a usar o comando 'repetir' para economizar passos.", content: JSON.stringify(quizPr1L2), type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Robótica",
    slug: "robotica",
    icon: "Bot",
    color: "rose",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "r1",
        title: "Componentes e Montagem de Robôs",
        description: "Conhecimento das peças básicas de robótica (sensores, motores) e sua função.",
        ageGroups: ['10-12'],
        icon: "Bot",
        modules: [
          {
            id: "r1-mod-1",
            title: "Hardware Básico",
            lessons: [
              { id: "r1-l1", title: "Sensores e Atuadores", description: "Diferencie as peças que 'sentem' e as que 'agem'.", content: "Os sensores permitem que o robô perceba o ambiente (luz, toque). Os atuadores (motores) fazem o robô se mover. (Leitura e Quiz)", type: "reading" },
              { id: "r1-l2", title: "Montagem Estrutural", description: "Teste seus conhecimentos sobre a função dos componentes.", content: JSON.stringify(quizR1L2), type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Finanças",
    slug: "financas",
    icon: "PiggyBank",
    color: "lime",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "f1",
        title: "Orçamento Pessoal e Poupança",
        description: "Desenvolvimento de responsabilidade financeira através do gerenciamento de mesada e metas.",
        ageGroups: ['10-12'],
        icon: "PiggyBank",
        modules: [
          {
            id: "f1-mod-1",
            title: "Renda, Despesa e Saldo",
            lessons: [
              { id: "f1-l1", title: "Entendendo o Fluxo de Dinheiro", description: "Diferencie o que é ganhar (renda) e o que é gastar (despesa).", content: JSON.stringify(quizF1L1), type: "exercise" },
              { id: "f1-l2", title: "Planejando Metas de Poupança", description: "Calcule quanto tempo leva para atingir um objetivo financeiro.", content: JSON.stringify(quizF1L2), type: "exercise" }
            ]
          }
        ]
      }
    ]
  }
];