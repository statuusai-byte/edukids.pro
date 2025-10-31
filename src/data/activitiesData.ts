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
  videoUrl?: string;
  content?: string; // JSON.stringify([...]) for quizzes or plain text
  type?: 'video' | 'reading' | 'exercise' | 'game';
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Activity {
  id:string;
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
  const opts = [correct, ...extras.filter(e => e !== correct).slice(0, 3)];
  const unique = Array.from(new Set(opts));
  while (unique.length < 4) {
    unique.push(`Opção ${unique.length + 1}`); // Fallback for not enough unique options
  }
  return shuffle(unique);
}

/* ---------- Quiz Generators ---------- */

const QUIZ_COUNT = 1000; // Target number of questions for each quiz type

function genAdd(count: number, max = 100): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    const correct = a + b;
    out.push({
      question: `Quanto é ${a} + ${b}?`,
      options: makeOptions(String(correct), [String(correct + 1), String(Math.max(0, correct - 1)), String(correct + 2), String(a + b + 3)]),
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
      options: makeOptions(String(correct), [String(correct + 1), String(Math.max(0, correct - 1)), String(correct + 2), String(a + b)]),
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
            options: makeOptions(String(correct), [String(correct + a), String(correct + b), String(Math.max(1, correct - a)), String(a * b + 1)]),
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
      options: makeOptions(String(correct), [String(correct + 1), String(Math.max(1, correct - 1)), String(correct + 2), String(a - b)]),
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
      options: makeOptions(String(n), [String(n + 1), String(Math.max(1, n - 1)), String(n+2), String(n-2)]),
      correctAnswer: String(n),
    });
  }
  return out;
}

function genEnglishNumbers(count = QUIZ_COUNT): QuizQuestion[] {
  const words = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = Math.floor(Math.random() * words.length);
    const correct = words[n];
    const wrongOptions = shuffle(words.filter(w => w !== correct)).slice(0, 3);
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
  const allAnswers = pairs.map(p => p.a);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length]; // Cycle through questions
    const wrongAnswers = allAnswers.filter(a => a !== pair.a);
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
    const allCapitals = capitals.map(c => c.capital);
    const out: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
        const item = capitals[i % capitals.length]; // Cycle through questions
        const wrongOptions = allCapitals.filter(c => c !== item.capital);
        out.push({ question: `Qual é a capital de ${item.state}?`, options: makeOptions(item.capital, shuffle(wrongOptions)), correctAnswer: item.capital });
    }
    return out;
}

function genEnglishAnimals(count: number): QuizQuestion[] {
    const animals = [
        { en: 'dog', pt: 'cachorro' }, { en: 'cat', pt: 'gato' }, { en: 'bird', pt: 'pássaro' },
        { en: 'fish', pt: 'peixe' }, { en: 'lion', pt: 'leão' }, { en: 'monkey', pt: 'macaco' },
        { en: 'horse', pt: 'cavalo' }, { en: 'cow', pt: 'vaca' }, { en: 'bear', pt: 'urso' }, { en: 'snake', pt: 'cobra' },
    ];
    const allEnglish = animals.map(a => a.en);
    const out: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
        const item = animals[i % animals.length]; // Cycle through questions
        const wrongOptions = allEnglish.filter(en => en !== item.en);
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

function genPlanetMatchingQuiz(count: number): QuizQuestion[] {
  const questions = [
    { q: "Qual é o planeta vermelho?", a: "Marte", options: ["Vênus", "Júpiter", "Terra"] },
    { q: "Qual é o maior planeta do nosso sistema solar?", a: "Júpiter", options: ["Saturno", "Urano", "Netuno"] },
    { q: "Qual planeta é conhecido por seus anéis?", a: "Saturno", options: ["Marte", "Vênus", "Terra"] },
    { q: "Qual é o planeta mais próximo do Sol?", a: "Mercúrio", options: ["Vênus", "Terra", "Marte"] },
    { q: "Qual planeta é o nosso lar?", a: "Terra", options: ["Marte", "Vênus", "Júpiter"] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length]; // Cycle through questions
    out.push({ question: qData.q, options: makeOptions(qData.a, qData.options), correctAnswer: qData.a });
  }
  return out;
}


/* ---------- Reading Content ---------- */
const reading_body_systems = "O corpo humano é incrível! O coração bate sem parar para levar sangue a todo lugar. Os pulmões nos ajudam a respirar o ar. E o cérebro é o chefe de tudo, nos ajuda a pensar, aprender e brincar!";
const reading_water_cycle = "A água está sempre em movimento! O sol esquenta a água dos rios e mares, que vira vapor e sobe (evaporação). Lá no céu, o vapor esfria e forma as nuvens (condensação). Quando as nuvens ficam pesadas, a água cai como chuva (precipitação) e volta para os rios, começando tudo de novo!";
const reading_discovery_brazil = "Em 1500, navegadores portugueses liderados por Pedro Álvares Cabral chegaram ao Brasil. Eles estavam tentando encontrar um novo caminho para as Índias, mas acabaram descobrindo uma nova terra, cheia de riquezas naturais e povos indígenas que já viviam aqui.";
const reading_primary_colors = "As cores primárias são o vermelho, o amarelo e o azul. Elas são especiais porque não podem ser criadas pela mistura de outras cores. Mas, ao misturá-las, podemos criar todas as outras cores! Amarelo com azul faz verde. Vermelho com amarelo faz laranja. E azul com vermelho faz roxo. Mágico, não é?";
const reading_if_then_logic = "Na programação, usamos a lógica 'SE-ENTÃO'. É como tomar uma decisão. SE estiver chovendo, ENTÃO eu pego um guarda-chuva. SE a luz estiver verde, ENTÃO eu posso atravessar a rua. Os computadores usam essa lógica para fazer tudo!";
const reading_saving_money = "Guardar dinheiro é como plantar uma sementinha. Se você guarda um pouco de sua mesada toda semana em um cofrinho, com o tempo, você terá dinheiro suficiente para comprar aquele brinquedo que tanto quer. Isso se chama 'poupar'!";

/* ---------- subjectsData export ---------- */

export const subjectsData: Subject[] = [
  {
    name: "Matemática",
    slug: "matematica",
    icon: "Sigma",
    color: "cyan",
    ageGroups: ['4-6','7-9','10-12'],
    activities: [
      {
        id: "m1",
        title: "Matemática para Pequenos (4-6 anos)",
        description: "Aprenda a contar, somar e subtrair de forma divertida.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          { id: "m1-mod1", title: "Números de 1 a 20", lessons: [
              { id: "m1-l1", title: "Reconhecendo Números", content: JSON.stringify(genNumberRecognition(QUIZ_COUNT, 20)), type: "exercise" },
              { id: "m1-l2", title: "Primeiras Somas", content: JSON.stringify(genAdd(QUIZ_COUNT, 10)), type: "exercise" }
          ]},
          { id: "m1-mod2", title: "Introdução à Subtração", lessons: [
              { id: "m1-l3", title: "Tirando Objetos", content: JSON.stringify(genSub(QUIZ_COUNT, 10)), type: "exercise" },
              { id: "m1-l4", title: "Jogo: Contando Frutas", content: "Conte as frutas na tela!", type: "game" }
          ]}
        ]
      },
      {
        id: "m2",
        title: "Matemática Essencial (7-9 anos)",
        description: "Pratique as quatro operações e resolva problemas.",
        ageGroups: ['7-9'],
        icon: "Sigma",
        modules: [
          { id: "m2-mod1", title: "Somas e Subtrações", lessons: [
              { id: "m2-l1", title: "Somando até 100", content: JSON.stringify(genAdd(QUIZ_COUNT, 100)), type: "exercise" },
              { id: "m2-l2", title: "Subtraindo até 100", content: JSON.stringify(genSub(QUIZ_COUNT, 100)), type: "exercise" }
          ]},
          { id: "m2-mod2", title: "Multiplicação é Mágica", lessons: [
              { id: "m2-l3", title: "Tabuadas Divertidas", content: JSON.stringify(genMul(QUIZ_COUNT, 12)), type: "exercise" },
              { id: "m2-l4", title: "Resolvendo Problemas de Vezes", content: "Se você tem 3 caixas com 4 lápis cada, quantos lápis você tem no total?", type: "reading" },
              { id: "m2-l7", title: "Jogo: Desafio da Multiplicação", description: "Teste suas habilidades de multiplicação em um jogo rápido!", content: "Em breve: um jogo de multiplicação super divertido!", type: "reading" }
          ]},
          { id: "m2-mod3", title: "Dividindo o Tesouro", lessons: [
              { id: "m2-l5", title: "Dividindo em Partes Iguais", content: JSON.stringify(genDiv(QUIZ_COUNT, 12)), type: "exercise" },
              { id: "m2-l6", title: "Divisão e Resto", content: "Se você dividir 10 por 3, cada um recebe 3 e sobra 1. Esse é o resto!", type: "reading" }
          ]}
        ]
      },
      {
        id: "m3",
        title: "Desafios Matemáticos (10-12 anos)",
        description: "Explore frações, decimais, geometria e problemas complexos.",
        ageGroups: ['10-12'],
        icon: "Brain",
        modules: [
          { id: "m3-mod1", title: "Frações e Decimais", lessons: [
              { id: "m3-l1", title: "O que são Frações? (Ebook)", content: "Explore o mundo das frações com este ebook interativo! Aprenda a dividir objetos em partes iguais e a entender o que cada parte representa, com muitas imagens e exemplos práticos.", type: "reading" },
              { id: "m3-l2", title: "Exercícios com Frações", content: JSON.stringify(genDiv(QUIZ_COUNT, 20)), type: "exercise" }
          ]},
          { id: "m3-mod2", title: "Geometria Básica", lessons: [
              { id: "m3-l3", title: "Ângulos e Formas", content: "Um círculo tem 360 graus. Um ângulo reto, como o canto de um quadrado, tem 90 graus.", type: "reading" },
              { id: "m3-l4", title: "Calculando Áreas", content: "Para calcular a área de um retângulo, multiplique a largura pela altura.", type: "reading" }
          ]}
        ]
      }
    ]
  },
  {
    name: "Português",
    slug: "portugues",
    icon: "BookOpen",
    color: "purple",
    ageGroups: ['4-6','7-9','10-12'],
    activities: [
      {
        id: "p1",
        title: "Primeiras Letras (4-6 anos)",
        description: "Aprenda as letras, os sons e como formar palavras.",
        ageGroups: ['4-6'],
        icon: "BookOpen",
        modules: [
          { id: "p1-mod1", title: "O Alfabeto", lessons: [
              { id: "p1-l1", title: "Conhecendo as Vogais", content: "As vogais são A, E, I, O, U. Elas estão em quase todas as palavras!", type: "reading" },
              { id: "p1-l2", title: "Jogo: Formando Palavras", content: "Junte as sílabas para formar a palavra correta.", type: "game" }
          ]}
        ]
      },
      {
        id: "p2",
        title: "Construindo Frases (7-9 anos)",
        description: "Entenda sinônimos, antônimos e a estrutura das frases.",
        ageGroups: ['7-9'],
        icon: "SpellCheck",
        modules: [
          { id: "p2-mod1", title: "Vocabulário", lessons: [
              { id: "p2-l1", title: "Quiz de Antônimos", content: JSON.stringify(genPortugueseAntonyms(QUIZ_COUNT)), type: "exercise" }
          ]},
          { id: "p2-mod2", title: "Tipos de Palavras", lessons: [
              { id: "p2-l2", title: "Substantivos e Adjetivos", content: "Substantivo dá nome às coisas (CASA). Adjetivo dá qualidade (CASA bonita).", type: "reading" }
          ]}
        ]
      },
      {
        id: "p3",
        title: "Português Avançado (10-12 anos)",
        description: "Aprofunde-se em tempos verbais, pontuação e interpretação de texto.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          { id: "p3-mod1", title: "Verbos e Tempos", lessons: [
              { id: "p3-l1", title: "Passado, Presente e Futuro", content: "Eu comi (passado), eu como (presente), eu comerei (futuro).", type: "reading" },
          ]},
          { id: "p3-mod2", title: "Pontuação", lessons: [
              { id: "p3-l2", title: "Vírgula, Ponto e Interrogação (Ebook)", content: "Aprenda a usar a vírgula para fazer pausas, o ponto final para terminar frases e a interrogação para perguntas, com exemplos ilustrados.", type: "reading" }
          ]}
        ]
      }
    ]
  },
  {
    name: "Inglês",
    slug: "ingles",
    icon: "SpellCheck",
    color: "indigo",
    ageGroups: ['4-6','7-9', '10-12'],
    activities: [
      {
        id: "i1",
        title: "Primeiras Palavras (Todas as idades)",
        description: "Aprenda números, cores e animais em inglês.",
        ageGroups: ['4-6','7-9', '10-12'],
        icon: "SpellCheck",
        modules: [
          { id: "i1-mod1", title: "Numbers and Colors", lessons: [
              { id: "i1-l1", title: "Quiz: Numbers 1-20", content: JSON.stringify(genEnglishNumbers(QUIZ_COUNT)), type: "exercise" }
          ]},
          { id: "i1-mod2", title: "Animals", lessons: [
              { id: "i1-l2", title: "Quiz: Common Animals", content: JSON.stringify(genEnglishAnimals(QUIZ_COUNT)), type: "exercise" },
              { id: "i1-l3", title: "Jogo: Adivinhe o Animal", description: "Ouça o som e adivinhe qual animal é!", content: "Em breve: um jogo de sons de animais super divertido!", type: "reading" }
          ]}
        ]
      }
    ]
  },
  {
    name: "Ciências",
    slug: "ciencias",
    icon: "FlaskConical",
    color: "green",
    ageGroups: ['4-6','7-9','10-12'],
    activities: [
      {
        id: "c1",
        title: "Descobrindo o Mundo (4-6 anos)",
        description: "Conheça os animais, as plantas e os 5 sentidos.",
        ageGroups: ['4-6'],
        icon: "FlaskConical",
        modules: [
          { id: "c1-mod1", title: "Seres Vivos", lessons: [
              { id: "c1-l1", title: "Animais e seus Sons", content: "O cachorro faz 'au au', o gato faz 'miau'!", type: "reading" },
          ]},
          { id: "c1-mod2", title: "Os 5 Sentidos", lessons: [
              { id: "c1-l2", title: "Ver, Ouvir, Cheirar, Tocar, Provar", content: "Usamos os olhos para ver, os ouvidos para ouvir...", type: "reading" },
          ]}
        ]
      },
      {
        id: "c2",
        title: "O Planeta Terra (7-9 anos)",
        description: "Explore o corpo humano, o ciclo da água e os ecossistemas.",
        ageGroups: ['7-9'],
        icon: "Globe",
        modules: [
          { id: "c2-mod1", title: "Corpo Humano", lessons: [
              { id: "c2-l1", title: "Como o Corpo Funciona", content: reading_body_systems, type: "reading" },
              { id: "c2-l2", title: "Quiz: Órgãos do Corpo", content: JSON.stringify(genScienceBodyParts(QUIZ_COUNT)), type: "exercise" }
          ]},
          { id: "c2-mod2", title: "Ciclos da Natureza", lessons: [
              { id: "c2-l3", title: "O Ciclo da Água", content: reading_water_cycle, type: "reading" }
          ]}
        ]
      },
      {
        id: "c3",
        title: "Universo e Ecologia (10-12 anos)",
        description: "Aprenda sobre o sistema solar, ecologia e sustentabilidade.",
        ageGroups: ['10-12'],
        icon: "Bot",
        modules: [
          { id: "c3-mod1", title: "Sistema Solar", lessons: [
              { id: "c3-l1", title: "Conhecendo os Planetas (Ebook)", content: "Embarque em uma jornada pelo sistema solar! Conheça os planetas, suas características e curiosidades, tudo com ilustrações incríveis neste ebook.", type: "reading" },
              { id: "c3-l3", title: "Jogo: Explorador do Sistema Solar", description: "Combine os planetas com suas características!", content: JSON.stringify(genPlanetMatchingQuiz(QUIZ_COUNT)), type: "game" }
          ]},
          { id: "c3-mod2", title: "Sustentabilidade", lessons: [
              { id: "c3-l2", title: "Reciclagem e Meio Ambiente", content: "Separar o lixo é muito importante para ajudar o planeta!", type: "reading" },
          ]}
        ]
      }
    ]
  },
  {
    name: "Artes",
    slug: "artes",
    icon: "Palette",
    color: "red",
    ageGroups: ['4-6','7-9'],
    activities: [
      { id: "a1", title: "Cores e Formas", description: "Explore o mundo das cores e da criatividade.", ageGroups: ['4-6','7-9'], icon: "Palette", modules: [
          { id: "a1-mod1", title: "Teoria das Cores", lessons: [
              { id: "a1-l1", title: "Misturando as Cores", content: reading_primary_colors, type: "reading" },
              { id: "a1-l2", title: "Jogo: Pintando com Cores Primárias", description: "Misture as cores para criar novas!", content: "Em breve: um jogo de mistura de cores super divertido!", type: "reading" }
          ]},
          { id: "a1-mod2", title: "Jogos de Memória", lessons: [
              { id: "a1-l3", title: "Jogo da Memória de Frutas", description: "Combine os pares de frutas neste divertido jogo de memória!", type: "game" }
          ]}
      ]}
    ]
  },
  {
    name: "Programação",
    slug: "programacao",
    icon: "Code",
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
      { id: "pr1", title: "Lógica e Algoritmos", description: "Dê os primeiros passos para criar jogos e apps.", ageGroups: ['10-12'], icon: "Code", modules: [
          { id: "pr1-mod1", title: "O que é um Algoritmo?", lessons: [
              { id: "pr1-l1", title: "Passo a Passo", content: "Um algoritmo é como uma receita de bolo: uma lista de passos para resolver um problema. Ex: 1. Pegue o pão. 2. Passe manteiga. 3. Coma.", type: "reading" }
          ]},
          { id: "pr1-mod2", title: "Lógica Condicional", lessons: [
              { id: "pr1-l2", title: "Pensando com 'SE-ENTÃO'", content: reading_if_then_logic, type: "reading" },
              { id: "pr1-l3", title: "Jogo: Desafio de Lógica", description: "Resolva quebra-cabeças de lógica para avançar!", content: "Em breve: um jogo de lógica super divertido!", type: "reading" }
          ]}
      ]}
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
              { id: "ef1-l1", title: "O que é Poupar?", content: reading_saving_money, type: "reading" },
              { id: "ef1-l2", title: "Quiz do Dinheirinho", content: JSON.stringify(genFinancialLiteracyQuiz(QUIZ_COUNT)), type: "exercise" },
              { id: "ef1-l3", title: "Jogo: O Mercado da Economia", description: "Compre e venda produtos para aprender a economizar!", content: "Em breve: um jogo de economia super divertido!", type: "reading" }
            ]
          }
        ]
      }
    ]
  }
];