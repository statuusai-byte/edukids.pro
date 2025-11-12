/**
 * activitiesData.ts
 * Complete and self-contained data file that exports types and subjectsData used across the app.
 */

import type { QuizQuestion } from '@/components/QuizComponent';
import type { IconName } from '@/components/Icon';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string; // JSON.stringify([...]) for quizzes or plain text
  type?: 'reading' | 'exercise' | 'game';
  component?: 'ContandoFrutas' | 'FormandoPalavras'; // Explicit component mapping for games
  premium?: boolean; // whether this lesson requires Premium access
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
  description?: string;
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

/* ---------- Helper functions for quiz generation ---------- */

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeOptions(correct: string, extras: string[]) {
  const opts = [correct, ...extras.filter((e) => e !== correct).slice(0, 3)];
  const unique = Array.from(new Set(opts));
  while (unique.length < 4) {
    unique.push(`Opção ${unique.length + 1}`); // Fallback for not enough unique options
  }
  return shuffle(unique);
}

/* ---------- Quiz Generators ---------- */

const PREMIUM_QUIZ_COUNT = 500;
const FREE_QUIZ_COUNT = 200;

function genAdd(count: number, max = 100): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    const correct = a + b;
    out.push({
      question: `Quanto é ${a} + ${b}?`,
      options: makeOptions(String(correct), [
        String(correct + 1),
        String(Math.max(0, correct - 1)),
        String(correct + 2),
        String(a + b + 3),
      ]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genSub(count: number, max = 100): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * a) + 1; // Ensure b is less than or equal to a
    const correct = a - b;
    out.push({
      question: `Quanto é ${a} - ${b}?`,
      options: makeOptions(String(correct), [
        String(correct + 1),
        String(Math.max(0, correct - 1)),
        String(correct + 2),
        String(a + b),
      ]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genMul(count: number, maxFactor = 12): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * maxFactor) + 1;
    const b = Math.floor(Math.random() * maxFactor) + 1;
    const correct = a * b;
    out.push({
      question: `Quanto é ${a} × ${b}?`,
      options: makeOptions(String(correct), [
        String(correct + a),
        String(correct + b),
        String(Math.max(1, correct - a)),
        String(a * b + 1),
      ]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genDiv(count: number, maxDivisor = 12): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const b = Math.floor(Math.random() * maxDivisor) + 2; // Divisor from 2 to maxDivisor
    const correct = Math.floor(Math.random() * maxDivisor) + 1; // Quotient from 1 to maxDivisor
    const a = b * correct;
    out.push({
      question: `Quanto é ${a} ÷ ${b}?`,
      options: makeOptions(String(correct), [
        String(correct + 1),
        String(Math.max(1, correct - 1)),
        String(correct + 2),
        String(a - b),
      ]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genNumberRecognition(count: number, maxNum = 100): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = Math.floor(Math.random() * maxNum) + 1;
    out.push({
      question: `Quantos objetos você vê: ${'●'.repeat(Math.min(20, n))}${n > 20 ? ` (+${n - 20})` : ''}`,
      options: makeOptions(String(n), [
        String(n + 1),
        String(Math.max(1, n - 1)),
        String(n + 2),
        String(Math.max(1, n - 2)),
      ]),
      correctAnswer: String(n),
    });
  }
  return out;
}

function genEnglishNumbers(count: number): QuizQuestion[] {
  const words = [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen', 'twenty',
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = Math.floor(Math.random() * words.length);
    const correct = words[n];
    const wrongOptions = shuffle(words.filter((w) => w !== correct)).slice(0, 3);
    out.push({
      question: `How do you say the number ${n + 1} in English?`,
      options: makeOptions(correct, wrongOptions),
      correctAnswer: correct,
    });
  }
  return out;
}

function genPortugueseAntonyms(count: number): QuizQuestion[] {
  const pairs = [
    { q: 'O contrário de "grande" é...', a: 'pequeno' }, { q: 'O contrário de "alto" é...', a: 'baixo' },
    { q: 'O contrário de "rápido" é...', a: 'lento' }, { q: 'O contrário de "cheio" é...', a: 'vazio' },
    { q: 'O contrário de "feliz" é...', a: 'triste' }, { q: 'O contrário de "quente" é...', a: 'frio' },
    { q: 'O contrário de "claro" é...', a: 'escuro' }, { q: 'O contrário de "novo" é...', a: 'velho' },
    { q: 'O contrário de "dia" é...', a: 'noite' }, { q: 'O contrário de "bom" é...', a: 'mau' },
  ];
  const allAnswers = pairs.map((p) => p.a);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length]; // Cycle through questions
    const wrongAnswers = allAnswers.filter((a) => a !== pair.a);
    out.push({ question: pair.q, options: makeOptions(pair.a, shuffle(wrongAnswers)), correctAnswer: pair.a });
  }
  return out;
}

function genScienceBodyParts(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Qual órgão bombeia sangue para o corpo?', a: 'Coração', options: ['Pulmão', 'Cérebro', 'Fígado'] },
    { q: 'Qual órgão usamos para pensar?', a: 'Cérebro', options: ['Estômago', 'Coração', 'Músculo'] },
    { q: 'Qual órgão usamos para respirar?', a: 'Pulmão', options: ['Coração', 'Rim', 'Pele'] },
    { q: 'O que nos ajuda a ver o mundo?', a: 'Olhos', options: ['Ouvidos', 'Nariz', 'Boca'] },
    { q: 'O que digere a comida que comemos?', a: 'Estômago', options: ['Cérebro', 'Pulmão', 'Intestino'] },
    { q: 'Qual o maior osso do corpo humano?', a: 'Fêmur', options: ['Crânio', 'Costela', 'Coluna'] },
    { q: 'O que protege nosso cérebro?', a: 'Crânio', options: ['Pele', 'Cabelo', 'Músculos'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length]; // Cycle through questions
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genGeographyCapitals(count: number): QuizQuestion[] {
  const capitals = [
    { state: 'Brasil', capital: 'Brasília' }, { state: 'São Paulo (estado)', capital: 'São Paulo' },
    { state: 'Rio de Janeiro (estado)', capital: 'Rio de Janeiro' }, { state: 'Bahia', capital: 'Salvador' },
    { state: 'Minas Gerais', capital: 'Belo Horizonte' }, { state: 'Portugal', capital: 'Lisboa' },
    { state: 'França', capital: 'Paris' }, { state: 'Japão', capital: 'Tóquio' }, { state: 'Argentina', capital: 'Buenos Aires' },
    { state: 'Estados Unidos', capital: 'Washington D.C.' }, { state: 'Itália', capital: 'Roma' }, { state: 'China', capital: 'Pequim' },
  ];
  const allCapitals = capitals.map((c) => c.capital);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = capitals[i % capitals.length]; // Cycle through questions
    const wrongOptions = allCapitals.filter((c) => c !== item.capital);
    out.push({ question: `Qual é a capital de ${item.state}?`, options: makeOptions(item.capital, shuffle(wrongOptions)), correctAnswer: item.capital });
  }
  return out;
}

function genHistoryFactsQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Quem liderou a chegada dos portugueses ao Brasil em 1500?', a: 'Pedro Álvares Cabral', options: ['Cristóvão Colombo', 'Vasco da Gama', 'Dom Pedro I'] },
    { q: 'Qual era o nome do povo que já vivia no Brasil antes da chegada dos portugueses?', a: 'Indígenas', options: ['Espanhóis', 'Africanos', 'Italianos'] },
    { q: 'Em que ano o Brasil foi descoberto pelos portugueses?', a: '1500', options: ['1492', '1822', '1900'] },
    { q: 'Qual foi a primeira riqueza explorada pelos portugueses no Brasil?', a: 'Pau-Brasil', options: ['Ouro', 'Café', 'Açúcar'] },
    { q: 'Quem proclamou a Independência do Brasil em 1822?', a: 'Dom Pedro I', options: ['Tiradentes', 'Princesa Isabel', 'Pedro Álvares Cabral'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genEnglishAnimals(count: number): QuizQuestion[] {
  const animals = [
    { en: 'dog', pt: 'cachorro' }, { en: 'cat', pt: 'gato' }, { en: 'bird', pt: 'pássaro' },
    { en: 'fish', pt: 'peixe' }, { en: 'lion', pt: 'leão' }, { en: 'monkey', pt: 'macaco' },
    { en: 'horse', pt: 'cavalo' }, { en: 'cow', pt: 'vaca' }, { en: 'bear', pt: 'urso' }, { en: 'snake', pt: 'cobra' },
  ];
  const allEnglish = animals.map((a) => a.en);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const item = animals[i % animals.length]; // Cycle through questions
    const wrongOptions = allEnglish.filter((en) => en !== item.en);
    out.push({ question: `Como se diz "${item.pt}" em inglês?`, options: makeOptions(item.en, shuffle(wrongOptions)), correctAnswer: item.en });
  }
  return out;
}

function genFinancialLiteracyQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'O que é "poupar" dinheiro?', a: 'Guardar para usar depois', options: ['Gastar tudo de uma vez', 'Dar para um amigo', 'Jogar fora'] },
    { q: 'Se um brinquedo custa R$10 e você tem R$5, o que você precisa fazer?', a: 'Poupar mais R$5', options: ['Pedir um desconto de R$5', 'Pegar o brinquedo mesmo assim', 'Esquecer o brinquedo'] },
    { q: 'O que é um "orçamento"?', a: 'Um plano de como gastar o dinheiro', options: ['Um tipo de cofre', 'Uma nota de dinheiro', 'Um tipo de loja'] },
    { q: 'Para que serve um cofrinho?', a: 'Para guardar moedas e notas', options: ['Para decorar o quarto', 'Para guardar brinquedos', 'Para jogar'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length]; // Cycle through questions
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genColorMixingQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Qual cor obtemos ao misturar amarelo e azul?', a: 'Verde', options: ['Laranja', 'Roxo', 'Marrom'] },
    { q: 'Qual cor obtemos ao misturar vermelho e amarelo?', a: 'Laranja', options: ['Verde', 'Roxo', 'Preto'] },
    { q: 'Qual cor obtemos ao misturar azul e vermelho?', a: 'Roxo', options: ['Verde', 'Laranja', 'Branco'] },
    { q: 'Qual destas é uma cor primária?', a: 'Azul', options: ['Verde', 'Laranja', 'Roxo'] },
    { q: 'Para obter a cor marrom, podemos misturar...', a: 'Vermelho e verde', options: ['Azul e branco', 'Amarelo e preto', 'Laranja e roxo'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genMultiplicationProblemsQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Se você tem 3 caixas com 4 lápis cada, quantos lápis você tem no total?', a: '12', options: ['7', '1', '10'] },
    { q: 'Uma bicicleta tem 2 rodas. Quantas rodas têm 5 bicicletas?', a: '10', options: ['7', '2', '15'] },
    { q: 'Maria come 2 maçãs por dia. Quantas maçãs ela come em uma semana (7 dias)?', a: '14', options: ['9', '7', '10'] },
    { q: 'Um pacote tem 5 figurinhas. Se você comprar 3 pacotes, quantas figurinhas terá?', a: '15', options: ['8', '3', '12'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genDivisionWithRemainderQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Se você dividir 10 por 3, qual é o resto?', a: '1', options: ['0', '2', '3'] },
    { q: 'João tem 7 bolinhas para dividir com seu amigo. Quantas bolinhas sobram se cada um ficar com a mesma quantidade?', a: '1', options: ['0', '2', '3'] },
    { q: 'Dividindo 15 por 4, o quociente é 3. Qual é o resto?', a: '3', options: ['0', '1', '2'] },
    { q: 'Uma professora tem 22 lápis para dividir entre 5 alunos. Quantos lápis sobram?', a: '2', options: ['0', '1', '3'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genNounsAndAdjectivesQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Na frase "O cachorro grande latiu", qual palavra é o adjetivo?', a: 'grande', options: ['cachorro', 'latiu', 'O'] },
    { q: 'Qual palavra é um substantivo?', a: 'Mesa', options: ['Bonito', 'Corre', 'Muito'] },
    { q: 'Na frase "A menina feliz brinca", qual palavra é o substantivo?', a: 'menina', options: ['feliz', 'brinca', 'A'] },
    { q: 'Qual palavra é um adjetivo?', a: 'Azul', options: ['Céu', 'Correr', 'Rapidamente'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genWaterCycleQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Como se chama quando a água do rio vira vapor e sobe para o céu?', a: 'Evaporação', options: ['Condensação', 'Precipitação', 'Infiltração'] },
    { q: 'Quando o vapor de água no céu esfria e forma as nuvens, o processo é chamado de...', a: 'Condensação', options: ['Evaporação', 'Precipitação', 'Transpiração'] },
    { q: 'A chuva, a neve e o granizo são formas de...', a: 'Precipitação', options: ['Evaporação', 'Condensação', 'Coleção'] },
    { q: 'Para onde a água da chuva vai depois de cair na terra?', a: 'Rios e lençóis freáticos', options: ['Para o Sol', 'Para a Lua', 'Fica nas nuvens'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

function genAdvancedFinancialLiteracyQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: 'O que são "juros" quando você guarda dinheiro no banco?', a: 'Um dinheiro extra que o banco te paga', options: ['Uma taxa que você paga', 'O nome do gerente', 'Um tipo de cofre'] },
    { q: 'O que significa "investir"?', a: 'Usar o dinheiro para tentar ganhar mais dinheiro', options: ['Gastar todo o dinheiro em brinquedos', 'Esconder o dinheiro', 'Dar o dinheiro para caridade'] },
    { q: 'Qual a diferença entre "necessidade" e "desejo"?', a: 'Necessidade é algo essencial, desejo é algo que queremos mas não precisamos', options: ['Não há diferença', 'Desejo é mais caro', 'Necessidade é comida, desejo é roupa'] },
    { q: 'O que é "inflação"?', a: 'Quando os preços das coisas aumentam com o tempo', options: ['Quando o dinheiro fica mais valioso', 'Um tipo de investimento', 'Um imposto sobre brinquedos'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}

/* ---------- subjectsData export ---------- */

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
        title: "Matemática para Pequenos (4-6 anos)",
        description: "Aprenda a contar, somar e subtrair de forma divertida.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m1-mod1", title: "Números de 1 a 20", lessons: [
              { id: "m1-l1", title: "Reconhecendo Números", content: JSON.stringify(genNumberRecognition(FREE_QUIZ_COUNT, 20)), type: "exercise" },
              { id: "m1-l2", title: "Primeiras Somas", content: JSON.stringify(genAdd(FREE_QUIZ_COUNT, 10)), type: "exercise" }
            ]
          },
          {
            id: "m1-mod2", title: "Introdução à Subtração", lessons: [
              { id: "m1-l3", title: "Tirando Objetos", content: JSON.stringify(genSub(FREE_QUIZ_COUNT, 10)), type: "exercise" },
              { id: "m1-l4", title: "Jogo: Contando Frutas", content: "Conte as frutas na tela!", type: "game", component: "ContandoFrutas" }
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Matemática Essencial (7-9 anos)",
        description: "Pratique as quatro operações e resolva problemas.",
        ageGroups: ['7-9'],
        icon: "Sigma",
        modules: [
          {
            id: "m2-mod1", title: "Somas e Subtrações", lessons: [
              { id: "m2-l1", title: "Somando até 100", content: JSON.stringify(genAdd(FREE_QUIZ_COUNT, 100)), type: "exercise" },
              { id: "m2-l2", title: "Subtraindo até 100", content: JSON.stringify(genSub(FREE_QUIZ_COUNT, 100)), type: "exercise" }
            ]
          },
          {
            id: "m2-mod2", title: "Multiplicação é Mágica", lessons: [
              { id: "m2-l3", title: "Tabuadas Divertidas", content: JSON.stringify(genMul(PREMIUM_QUIZ_COUNT, 12)), type: "exercise", premium: true },
              { id: "m2-l4", title: "Resolvendo Problemas de Vezes", content: JSON.stringify(genMultiplicationProblemsQuiz(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          },
          {
            id: "m2-mod3", title: "Dividindo o Tesouro", lessons: [
              { id: "m2-l5", title: "Dividindo em Partes Iguais", content: JSON.stringify(genDiv(PREMIUM_QUIZ_COUNT, 12)), type: "exercise", premium: true },
              { id: "m2-l6", title: "Divisão e Resto", content: JSON.stringify(genDivisionWithRemainderQuiz(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m3",
        title: "Desafios Matemáticos (10-12 anos)",
        description: "Explore frações, decimais, geometria e problemas complexos.",
        ageGroups: ['10-12'],
        icon: "Brain",
        modules: [
          {
            id: "m3-mod1", title: "Frações e Decimais", lessons: [
              { 
                id: "m3-l1", 
                title: "O que são Frações?", 
                content: `
                  <p>As frações são uma forma de representar partes de um todo. Imagine que você tem uma pizza inteira. Se você a dividir em 4 pedaços iguais e comer 1, você comeu <strong>1/4</strong> da pizza.</p>
                  <p>O número de cima (numerador) diz quantas partes você tem. O número de baixo (denominador) diz em quantas partes o todo foi dividido.</p>
                  <ul>
                    <li><strong>1/2:</strong> Uma parte de duas (metade).</li>
                    <li><strong>3/4:</strong> Três partes de quatro.</li>
                    <li><strong>4/4:</strong> Quatro partes de quatro (a pizza inteira!).</li>
                  </ul>
                  <p>As frações são muito importantes para dividir coisas, como doces, tempo ou até mesmo dinheiro!</p>
                `, 
                type: "reading" 
              },
              { id: "m3-l2", title: "Exercícios com Frações", content: JSON.stringify(genDiv(PREMIUM_QUIZ_COUNT, 20)), type: "exercise", premium: true }
            ]
          },
          {
            id: "m3-mod2", title: "Geometria Básica", lessons: [
              { 
                id: "m3-l3", 
                title: "Ângulos e Formas", 
                content: `
                  <p>A geometria é o estudo das formas e dos espaços. Tudo ao nosso redor tem uma forma geométrica!</p>
                  <p>Um <strong>ângulo</strong> é a abertura entre duas linhas que se encontram. Pense nos ponteiros de um relógio:</p>
                  <ul>
                    <li>Um <strong>ângulo reto</strong> (como o canto de um quadrado) tem 90 graus.</li>
                    <li>Um <strong>ângulo agudo</strong> é menor que 90 graus (ponta de uma faca).</li>
                    <li>Um <strong>ângulo obtuso</strong> é maior que 90 graus (boca aberta).</li>
                  </ul>
                  <p>As formas básicas são: <strong>quadrado, círculo, triângulo e retângulo</strong>. Tente encontrar essas formas na sua casa!</p>
                `, 
                type: "reading" 
              },
              { 
                id: "m3-l4", 
                title: "Calculando Áreas", 
                content: `
                  <p>A <strong>área</strong> é o espaço que uma forma ocupa em uma superfície plana. É como medir o tamanho de um tapete ou de um campo de futebol.</p>
                  <p>Para calcular a área de um <strong>retângulo</strong> ou <strong>quadrado</strong>, você precisa multiplicar a largura pela altura.</p>
                  <p><strong>Fórmula:</strong> Área = Largura × Altura</p>
                  <p>Se um tapete tem 2 metros de largura e 3 metros de altura, a área dele é 2 x 3 = 6 metros quadrados (6 m²).</p>
                `, 
                type: "reading" 
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Português",
    slug: "portugues",
    icon: "BookOpen",
    color: "purple",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "p1",
        title: "Primeiras Letras (4-6 anos)",
        description: "Aprenda as letras, os sons e como formar palavras.",
        ageGroups: ['4-6'],
        icon: "BookOpen",
        modules: [
          {
            id: "p1-mod1", title: "O Alfabeto", lessons: [
              { 
                id: "p1-l1", 
                title: "Conhecendo as Vogais", 
                content: `
                  <p>O alfabeto tem muitas letras, mas cinco delas são muito especiais: as <strong>vogais</strong>!</p>
                  <p>As vogais são: <strong>A, E, I, O, U</strong>.</p>
                  <p>Elas são importantes porque dão som às palavras. Quase todas as palavras têm pelo menos uma vogal. Tente dizer as vogais bem alto!</p>
                  <ul>
                    <li><strong>A</strong> de Abacaxi</li>
                    <li><strong>E</strong> de Elefante</li>
                    <li><strong>I</strong> de Igreja</li>
                    <li><strong>O</strong> de Ovo</li>
                    <li><strong>U</strong> de Uva</li>
                  </ul>
                  <p>As outras letras são chamadas de consoantes. Juntas, vogais e consoantes formam todas as palavras que conhecemos!</p>
                `, 
                type: "reading" 
              },
              { id: "p1-l2", title: "Jogo: Formando Palavras", content: "Junte as sílabas para formar a palavra correta.", type: "game", component: "FormandoPalavras" }
            ]
          }
        ]
      },
      {
        id: "p2",
        title: "Construindo Frases (7-9 anos)",
        description: "Entenda sinônimos, antônimos e a estrutura das frases.",
        ageGroups: ['7-9'],
        icon: "SpellCheck",
        modules: [
          {
            id: "p2-mod1", title: "Vocabulário", lessons: [
              { id: "p2-l1", title: "Quiz de Antônimos", content: JSON.stringify(genPortugueseAntonyms(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          },
          {
            id: "p2-mod2", title: "Tipos de Palavras", lessons: [
              { id: "p2-l2", title: "Substantivos e Adjetivos", content: JSON.stringify(genNounsAndAdjectivesQuiz(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p3",
        title: "Português Avançado (10-12 anos)",
        description: "Aprofunde-se em tempos verbais, pontuação e interpretação de texto.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p3-mod1", title: "Verbos e Tempos", lessons: [
              { 
                id: "p3-l1", 
                title: "Passado, Presente e Futuro", 
                content: `
                  <p>Os <strong>verbos</strong> são palavras que indicam ações, estados ou fenômenos da natureza. Eles nos dizem quando algo aconteceu.</p>
                  <p>Existem três tempos principais:</p>
                  <ul>
                    <li><strong>Presente:</strong> Acontece agora. Ex: "Eu <strong>como</strong> uma maçã."</li>
                    <li><strong>Passado (Pretérito):</strong> Já aconteceu. Ex: "Eu <strong>comi</strong> uma maçã."</li>
                    <li><strong>Futuro:</strong> Vai acontecer. Ex: "Eu <strong>comerei</strong> uma maçã."</li>
                  </ul>
                  <p>Prestar atenção no tempo verbal ajuda a contar histórias na ordem certa!</p>
                `, 
                type: "reading", 
                premium: true 
              },
            ]
          },
          {
            id: "p3-mod2", title: "Pontuação", lessons: [
              { 
                id: "p3-l2", 
                title: "Vírgula, Ponto e Interrogação", 
                content: `
                  <p>A <strong>pontuação</strong> é como as placas de trânsito da leitura. Elas nos dizem quando parar, respirar ou mudar o tom de voz.</p>
                  <ul>
                    <li><strong>Ponto Final (.):</strong> Usado para terminar uma frase. Indica que a ideia acabou.</li>
                    <li><strong>Vírgula (,):</strong> Indica uma pequena pausa. Usada para separar itens em uma lista ou dar uma respirada.</li>
                    <li><strong>Ponto de Interrogação (?):</strong> Usado no final de uma pergunta.</li>
                    <li><strong>Ponto de Exclamação (!):</strong> Usado para mostrar surpresa, alegria ou susto.</li>
                  </ul>
                  <p>A pontuação correta faz toda a diferença para que o que você escreve seja entendido!</p>
                `, 
                type: "reading" 
              }
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
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "i1",
        title: "Primeiras Palavras (Todas as idades)",
        description: "Aprenda números, cores e animais em inglês.",
        ageGroups: ['4-6', '7-9', '10-12'],
        icon: "SpellCheck",
        modules: [
          {
            id: "i1-mod1", title: "Numbers and Colors", lessons: [
              { id: "i1-l1", title: "Quiz: Numbers 1-20", content: JSON.stringify(genEnglishNumbers(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          },
          {
            id: "i1-mod2", title: "Animals", lessons: [
              { id: "i1-l2", title: "Quiz: Common Animals", content: JSON.stringify(genEnglishAnimals(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Ciências",
    slug: "ciencias",
    icon: "FlaskConical",
    color: "green",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "c1",
        title: "Descobrindo o Mundo (4-6 anos)",
        description: "Conheça os animais, as plantas e os 5 sentidos.",
        ageGroups: ['4-6'],
        icon: "FlaskConical",
        modules: [
          {
            id: "c1-mod1", title: "Seres Vivos", lessons: [
              { 
                id: "c1-l1", 
                title: "Animais e seus Sons", 
                content: `
                  <p>O mundo está cheio de animais incríveis! Cada um faz um som diferente para se comunicar:</p>
                  <ul>
                    <li>O <strong>cachorro</strong> faz "Au Au" e é nosso amigo.</li>
                    <li>O <strong>gato</strong> faz "Miau" e adora dormir.</li>
                    <li>A <strong>vaca</strong> faz "Muuu" e nos dá leite.</li>
                    <li>O <strong>pato</strong> faz "Quack Quack" e adora nadar.</li>
                  </ul>
                  <p>Tente imitar o som do seu animal favorito!</p>
                `, 
                type: "reading" 
              },
            ]
          },
          {
            id: "c1-mod2", title: "Os 5 Sentidos", lessons: [
              { 
                id: "c1-l2", 
                title: "Ver, Ouvir, Cheirar, Tocar, Provar", 
                content: `
                  <p>Temos cinco superpoderes para conhecer o mundo: os <strong>cinco sentidos</strong>!</p>
                  <ul>
                    <li><strong>Visão:</strong> Usamos os <strong>olhos</strong> para ver as cores e as formas.</li>
                    <li><strong>Audição:</strong> Usamos os <strong>ouvidos</strong> para ouvir músicas e a voz dos amigos.</li>
                    <li><strong>Olfato:</strong> Usamos o <strong>nariz</strong> para cheirar flores e comidas gostosas.</li>
                    <li><strong>Tato:</strong> Usamos a <strong>pele</strong> (principalmente as mãos) para sentir o que é macio ou áspero.</li>
                    <li><strong>Paladar:</strong> Usamos a <strong>língua</strong> para sentir o gosto doce, salgado ou azedo.</li>
                  </ul>
                  <p>Eles trabalham juntos para nos manter seguros e nos ajudar a aprender!</p>
                `, 
                type: "reading" 
              },
            ]
          }
        ]
      },
      {
        id: "c2",
        title: "O Planeta Terra (7-9 anos)",
        description: "Explore o corpo humano, o ciclo da água e os ecossistemas.",
        ageGroups: ['7-9'],
        icon: "Globe",
        modules: [
          {
            id: "c2-mod1", title: "Corpo Humano", lessons: [
              { 
                id: "c2-l1", 
                title: "Como o Corpo Funciona", 
                content: `
                  <p>O corpo humano é uma máquina incrível! Ele tem partes que trabalham sem parar para nos manter vivos e saudáveis.</p>
                  <ul>
                    <li>O <strong>Coração</strong>: É como uma bomba que bate para levar o sangue (com comida e oxigênio) para todo o corpo.</li>
                    <li>Os <strong>Pulmões</strong>: Nos ajudam a respirar, pegando o ar bom (oxigênio) e soltando o ar ruim.</li>
                    <li>O <strong>Cérebro</strong>: É o chefe de tudo! Ele nos ajuda a pensar, aprender, lembrar e controlar nossos movimentos.</li>
                  </ul>
                  <p>Para manter essa máquina funcionando, precisamos de boa alimentação, água e muito exercício!</p>
                `, 
                type: "reading" 
              },
              { id: "c2-l2", title: "Quiz: Órgãos do Corpo", content: JSON.stringify(genScienceBodyParts(PREMIUM_QUIZ_COUNT)), type: "exercise", premium: true }
            ]
          },
          {
            id: "c2-mod2", title: "Ciclos da Natureza", lessons: [
              { id: "c2-l3", title: "O Ciclo da Água", content: JSON.stringify(genWaterCycleQuiz(FREE_QUIZ_COUNT)), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "c3",
        title: "Universo e Ecologia (10-12 anos)",
        description: "Aprenda sobre o sistema solar, ecologia e sustentabilidade.",
        ageGroups: ['10-12'],
        icon: "Bot",
        modules: [
          {
            id: "c3-mod1", title: "Sistema Solar", lessons: [
              { 
                id: "c3-l1", 
                title: "Conhecendo os Planetas", 
                content: `
                  <p>Nosso <strong>Sistema Solar</strong> é composto pelo Sol (uma estrela gigante) e oito planetas que giram ao seu redor.</p>
                  <p>A ordem dos planetas a partir do Sol é:</p>
                  <ol>
                    <li>Mercúrio (o mais rápido)</li>
                    <li>Vênus (o mais quente)</li>
                    <li><strong>Terra</strong> (nosso lar!)</li>
                    <li>Marte (o planeta vermelho)</li>
                    <li>Júpiter (o maior de todos)</li>
                    <li>Saturno (com seus anéis famosos)</li>
                    <li>Urano (o planeta deitado)</li>
                    <li>Netuno (o mais distante e frio)</li>
                  </ol>
                  <p>Lembre-se: a Terra é o único planeta que conhecemos que tem vida!</p>
                `, 
                type: "reading" 
              },
            ]
          },
          {
            id: "c3-mod2", title: "Sustentabilidade", lessons: [
              { 
                id: "c3-l2", 
                title: "Reciclagem e Meio Ambiente", 
                content: `
                  <p><strong>Sustentabilidade</strong> significa cuidar do nosso planeta para que ele continue bom para nós e para as futuras gerações.</p>
                  <p>Uma das formas mais importantes de ajudar é a <strong>reciclagem</strong>. Reciclar é transformar lixo velho em algo novo.</p>
                  <ul>
                    <li><strong>Azul:</strong> Papel</li>
                    <li><strong>Vermelho:</strong> Plástico</li>
                    <li><strong>Verde:</strong> Vidro</li>
                    <li><strong>Amarelo:</strong> Metal</li>
                  </ul>
                  <p>Ao separar o lixo, economizamos energia, água e evitamos que mais lixo vá para a natureza.</p>
                `, 
                type: "reading" 
              },
            ]
          }
        ]
      }
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
        id: "h1", title: "História do Brasil", description: "Eventos que moldaram o nosso país.", ageGroups: ['7-9', '10-12'], icon: "Landmark", modules: [
          {
            id: "h1-mod1", title: "Descobrimento e Colonização", lessons: [
              { 
                id: "h1-l1", 
                title: "A Chegada dos Portugueses", 
                content: `
                  <p>Em <strong>1500</strong>, navegadores portugueses liderados por <strong>Pedro Álvares Cabral</strong> chegaram ao Brasil. Eles estavam tentando encontrar um novo caminho para as Índias, mas acabaram descobrindo uma nova terra.</p>
                  <p>Quando chegaram, o Brasil não estava vazio. Ele já era habitado por milhares de <strong>povos indígenas</strong>, que tinham suas próprias culturas, línguas e formas de viver.</p>
                  <p>Os portugueses começaram a explorar a terra, buscando riquezas como o <strong>Pau-Brasil</strong>, e assim começou o período de colonização, que durou mais de 300 anos.</p>
                `, 
                type: "reading" 
              },
              { id: "h1-l2", title: "Quiz de Fatos Históricos", content: JSON.stringify(genHistoryFactsQuiz(PREMIUM_QUIZ_COUNT)), type: "exercise", premium: true }
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
        id: "g1", title: "Mapas e Lugares", description: "Aprenda sobre estados, capitais e continentes.", ageGroups: ['7-9', '10-12'], icon: "Globe", modules: [
          {
            id: "g1-mod1", title: "Brasil e o Mundo", lessons: [
              { 
                id: "g1-l0", 
                title: "O que são Mapas?", 
                content: `
                  <p>Um <strong>mapa</strong> é um desenho que nos ajuda a ver lugares grandes, como cidades, países ou o mundo inteiro, em uma folha de papel ou tela.</p>
                  <p>Mapas usam <strong>símbolos</strong> e <strong>cores</strong> para representar coisas reais, como rios, montanhas e estradas. A <strong>rosa dos ventos</strong> (Norte, Sul, Leste, Oeste) nos ajuda a saber a direção.</p>
                  <p>Existem muitos tipos de mapas: mapas de cidades, mapas de estradas e o <strong>mapa-múndi</strong>, que mostra todos os continentes e oceanos.</p>
                  <p>Aprender a ler mapas é como ter um superpoder para explorar o mundo!</p>
                `, 
                type: "reading" 
              },
              { id: "g1-l1", title: "Quiz de Capitais", content: JSON.stringify(genGeographyCapitals(PREMIUM_QUIZ_COUNT)), type: "exercise", premium: true }
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
        id: "a1", title: "Cores e Formas", description: "Explore o mundo das cores e da criatividade.", ageGroups: ['4-6', '7-9'], icon: "Palette", modules: [
          {
            id: "a1-mod1", title: "Teoria das Cores", lessons: [
              { 
                id: "a1-l0", 
                title: "Cores Primárias e Secundárias", 
                content: `
                  <p>As cores são a magia da arte! Existem cores que não podem ser criadas misturando outras: as <strong>cores primárias</strong>.</p>
                  <ul>
                    <li><strong>Vermelho</strong></li>
                    <li><strong>Amarelo</strong></li>
                    <li><strong>Azul</strong></li>
                  </ul>
                  <p>Quando misturamos duas cores primárias, criamos as <strong>cores secundárias</strong>:</p>
                  <ul>
                    <li>Vermelho + Amarelo = <strong>Laranja</strong></li>
                    <li>Amarelo + Azul = <strong>Verde</strong></li>
                    <li>Vermelho + Azul = <strong>Roxo</strong></li>
                  </ul>
                  <p>Tente misturar tintas para ver a mágica acontecer!</p>
                `, 
                type: "reading" 
              },
              { id: "a1-l1", title: "Misturando as Cores", content: JSON.stringify(genColorMixingQuiz(FREE_QUIZ_COUNT)), type: "exercise" }
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
        id: "pr1", title: "Lógica e Algoritmos", description: "Dê os primeiros passos para criar jogos e apps.", ageGroups: ['10-12'], icon: "Code", modules: [
          {
            id: "pr1-mod1", title: "O que é um Algoritmo?", lessons: [
              { 
                id: "pr1-l1", 
                title: "Passo a Passo", 
                content: `
                  <p>Um <strong>algoritmo</strong> é como uma receita de bolo ou um mapa do tesouro: é uma lista de passos claros e organizados para resolver um problema ou completar uma tarefa.</p>
                  <p>Pense em como você se prepara para a escola:</p>
                  <ol>
                    <li>Acordar.</li>
                    <li>Escovar os dentes.</li>
                    <li>Tomar café da manhã.</li>
                    <li>Vestir o uniforme.</li>
                    <li>Ir para a escola.</li>
                  </ol>
                  <p>Se você pular um passo, o resultado pode não ser o esperado! Os computadores usam algoritmos para fazer tudo, desde somar números até rodar seus jogos favoritos.</p>
                `, 
                type: "reading" 
              }
            ]
          },
          {
            id: "pr1-mod2", title: "Lógica Condicional", lessons: [
              { 
                id: "pr1-l2", 
                title: "Pensando com 'SE-ENTÃO'", 
                content: `
                  <p>A <strong>Lógica Condicional</strong> é a base da programação. Ela funciona com a regra do "SE isso acontecer, ENTÃO faça aquilo".</p>
                  <p>É como tomar decisões:</p>
                  <ul>
                    <li><strong>SE</strong> estiver chovendo, <strong>ENTÃO</strong> eu pego um guarda-chuva.</li>
                    <li><strong>SE</strong> eu terminar minha lição, <strong>ENTÃO</strong> eu posso brincar.</li>
                  </ul>
                  <p>Os computadores usam essa lógica para decidir o que fazer. Se você clicar em um botão (SE), o programa abre uma nova tela (ENTÃO). É simples assim!</p>
                `, 
                type: "reading" 
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Educação Financeira",
    slug: "educacao-financeira",
    icon: "PiggyBank",
    color: "yellow",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "ef1",
        title: "Aprendendo sobre Dinheiro",
        description: "Entenda o que é dinheiro, como poupar e gastar com sabedoria.",
        ageGroups: ['7-9', '10-12'],
        icon: "PiggyBank",
        modules: [
          {
            id: "ef1-mod1",
            title: "Primeiros Passos Financeiros",
            lessons: [
              { 
                id: "ef1-l0", 
                title: "O que é Dinheiro?", 
                content: `
                  <p>O <strong>dinheiro</strong> é uma ferramenta que usamos para trocar por coisas que precisamos ou queremos, como comida, brinquedos ou ingressos de cinema.</p>
                  <p>Antigamente, as pessoas trocavam objetos (escambo), mas hoje usamos moedas e notas. O dinheiro tem três funções principais:</p>
                  <ol>
                    <li><strong>Meio de Troca:</strong> Usamos para comprar.</li>
                    <li><strong>Unidade de Valor:</strong> Ajuda a saber quanto vale cada coisa.</li>
                    <li><strong>Reserva de Valor:</strong> Podemos guardar (poupar) para usar no futuro.</li>
                  </ol>
                  <p>Aprender a usar o dinheiro com sabedoria é muito importante para o futuro!</p>
                `, 
                type: "reading" 
              },
              { id: "ef1-l1", title: "Quiz: O que é Poupar?", content: JSON.stringify(genFinancialLiteracyQuiz(FREE_QUIZ_COUNT)), type: "exercise" },
              { id: "ef1-l2", title: "Quiz Avançado: Investimentos e Juros", content: JSON.stringify(genAdvancedFinancialLiteracyQuiz(PREMIUM_QUIZ_COUNT)), type: "exercise", premium: true }
            ]
          }
        ]
      }
    ]
  }
];