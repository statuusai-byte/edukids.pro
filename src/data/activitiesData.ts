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
  const opts = [correct, ...extras.slice(0, 2)];
  const unique = Array.from(new Set(opts));
  while (unique.length < 3) {
    unique.push(`Opção ${unique.length + 1}`);
  }
  return shuffle(unique);
}

/* ---------- Quiz Generators ---------- */

function genAdd(count: number, max = 10): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const a = (i % max) + 1;
    const b = ((i * 3) % (max-1)) + 1;
    const correct = a + b;
    out.push({
      question: `Quanto é ${a} + ${b}?`,
      options: makeOptions(String(correct), [String(correct + 2), String(Math.max(0, correct - 1))]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genSub(count: number, max = 15): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const a = Math.floor(max / 2) + (i % Math.floor(max / 2));
    const b = (i % (Math.floor(max/2)-1)) + 1;
    const correct = a - b;
    out.push({
      question: `Quanto é ${a} - ${b}?`,
      options: makeOptions(String(correct), [String(correct + 1), String(Math.max(0, correct - 2))]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genMul(count: number): QuizQuestion[] {
    const out: QuizQuestion[] = [];
    for (let i = 1; i <= count; i++) {
        const a = 1 + (i % 9);
        const b = 1 + ((i * 2) % 9);
        const correct = a * b;
        out.push({
            question: `Quanto é ${a} × ${b}?`,
            options: makeOptions(String(correct), [String(correct + b), String(Math.max(1, correct - a))]),
            correctAnswer: String(correct),
        });
    }
    return out;
}

function genDiv(count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const b = 2 + (i % 5);
    const correct = 2 + (i % 8);
    const a = b * correct;
    out.push({
      question: `Quanto é ${a} ÷ ${b}?`,
      options: makeOptions(String(correct), [String(correct + 1), String(correct - 1)]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genNumberRecognition(count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const n = i <= 12 ? i : (i % 12) + 1;
    out.push({
      question: `Quantos objetos você vê: ${'●'.repeat(Math.min(8, n))}${n > 8 ? ` (+${n - 8})` : ''}`,
      options: makeOptions(String(n), [String(n + 1), String(Math.max(1, n - 1))]),
      correctAnswer: String(n),
    });
  }
  return out;
}

function genEnglishNumbers(count = 12): QuizQuestion[] {
  const words = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = i % words.length;
    const correct = words[n];
    const wrong1 = words[(n + 1) % words.length];
    const wrong2 = words[(n + 2) % words.length];
    out.push({
      question: `How do you say the number ${n + 1} in English?`,
      options: makeOptions(correct, [wrong1, wrong2]),
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
  ];
  const allAnswers = pairs.map(p => p.a);
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length];
    const wrongAnswers = allAnswers.filter(a => a !== pair.a);
    out.push({ question: pair.q, options: makeOptions(pair.a, shuffle(wrongAnswers)), correctAnswer: pair.a });
  }
  return out;
}

function genScienceBodyParts(count: number): QuizQuestion[] {
  const questions = [
    { q: 'Qual órgão bombeia sangue para o corpo?', a: 'Coração', options: ['Pulmão', 'Cérebro'] },
    { q: 'Qual órgão usamos para pensar?', a: 'Cérebro', options: ['Estômago', 'Fígado'] },
    { q: 'Qual órgão usamos para respirar?', a: 'Pulmão', options: ['Coração', 'Rim'] },
    { q: 'O que nos ajuda a ver o mundo?', a: 'Olhos', options: ['Ouvidos', 'Nariz'] },
    { q: 'O que digere a comida que comemos?', a: 'Estômago', options: ['Cérebro', 'Pulmão'] },
    { q: 'Qual o maior osso do corpo humano?', a: 'Fêmur', options: ['Crânio', 'Costela'] },
  ];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const qData = questions[i % questions.length];
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
    ];
    const allCapitals = capitals.map(c => c.capital);
    const out: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
        const item = capitals[i % capitals.length];
        const wrongOptions = allCapitals.filter(c => c !== item.capital);
        out.push({ question: `Qual é a capital de ${item.state}?`, options: makeOptions(item.capital, shuffle(wrongOptions)), correctAnswer: item.capital });
    }
    return out;
}

function genEnglishAnimals(count: number): QuizQuestion[] {
    const animals = [
        { en: 'dog', pt: 'cachorro' }, { en: 'cat', pt: 'gato' }, { en: 'bird', pt: 'pássaro' },
        { en: 'fish', pt: 'peixe' }, { en: 'lion', pt: 'leão' }, { en: 'monkey', pt: 'macaco' },
        { en: 'horse', pt: 'cavalo' }, { en: 'cow', pt: 'vaca' },
    ];
    const allEnglish = animals.map(a => a.en);
    const out: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
        const item = animals[i % animals.length];
        const wrongOptions = allEnglish.filter(en => en !== item.en);
        out.push({ question: `Como se diz "${item.pt}" em inglês?`, options: makeOptions(item.en, shuffle(wrongOptions)), correctAnswer: item.en });
    }
    return out;
}

/* ---------- Reading Content ---------- */
const reading_body_systems = "O corpo humano é incrível! O coração bate sem parar para levar sangue a todo lugar. Os pulmões nos ajudam a respirar o ar. E o cérebro é o chefe de tudo, nos ajuda a pensar, aprender e brincar!";
const reading_water_cycle = "A água está sempre em movimento! O sol esquenta a água dos rios e mares, que vira vapor e sobe (evaporação). Lá no céu, o vapor esfria e forma as nuvens (condensação). Quando as nuvens ficam pesadas, a água cai como chuva (precipitação) e volta para os rios, começando tudo de novo!";
const reading_discovery_brazil = "Em 1500, navegadores portugueses liderados por Pedro Álvares Cabral chegaram ao Brasil. Eles estavam tentando encontrar um novo caminho para as Índias, mas acabaram descobrindo uma nova terra, cheia de riquezas naturais e povos indígenas que já viviam aqui.";
const reading_primary_colors = "As cores primárias são o vermelho, o amarelo e o azul. Elas são especiais porque não podem ser criadas pela mistura de outras cores. Mas, ao misturá-las, podemos criar todas as outras cores! Amarelo com azul faz verde. Vermelho com amarelo faz laranja. E azul com vermelho faz roxo. Mágico, não é?";

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
        title: "Contagem e Números",
        description: "Aprenda a contar, somar e subtrair de forma divertida.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          { id: "m1-mod1", title: "Números de 1 a 10", lessons: [
              { id: "m1-l1", title: "Reconhecendo Números", content: JSON.stringify(genNumberRecognition(10)), type: "exercise" },
              { id: "m1-l2", title: "Primeiras Somas", content: JSON.stringify(genAdd(8, 10)), type: "exercise" }
          ]},
          { id: "m1-mod2", title: "Introdução à Subtração", lessons: [
              { id: "m1-l3", title: "Tirando Objetos", content: JSON.stringify(genSub(8, 10)), type: "exercise" },
              { id: "m1-l4", title: "Jogo: Contando Frutas", content: "Conte as frutas na tela!", type: "game" }
          ]}
        ]
      },
      {
        id: "m2",
        title: "Operações Básicas",
        description: "Pratique adição e subtração com números maiores.",
        ageGroups: ['7-9'],
        icon: "Sigma",
        modules: [
          { id: "m2-mod1", title: "Somas e Subtrações", lessons: [
              { id: "m2-l1", title: "Somando até 50", content: JSON.stringify(genAdd(12, 50)), type: "exercise" },
              { id: "m2-l2", title: "Subtraindo até 50", content: JSON.stringify(genSub(12, 50)), type: "exercise" }
          ]}
        ]
      },
      {
        id: "m3",
        title: "Multiplicação e Divisão",
        description: "Descubra a tabuada e como dividir igualmente.",
        ageGroups: ['7-9','10-12'],
        icon: "Sigma",
        modules: [
          { id: "m3-mod1", title: "Introdução à Multiplicação", lessons: [
              { id: "m3-l1", title: "Tabuadas do 2, 3 e 5", content: JSON.stringify(genMul(12)), type: "exercise" },
              { id: "m3-l2", title: "Resolvendo Problemas", content: "Se você tem 3 caixas com 4 lápis cada, quantos lápis você tem no total?", type: "reading" }
          ]},
          { id: "m3-mod2", title: "Introdução à Divisão", lessons: [
              { id: "m3-l3", title: "Dividindo em Partes Iguais", content: JSON.stringify(genDiv(12)), type: "exercise" },
              { id: "m3-l4", title: "Divisão e Resto", content: "Se você dividir 10 por 3, cada um recebe 3 e sobra 1. Esse é o resto!", type: "reading" }
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
        title: "Alfabetização e Sílabas",
        description: "Aprenda as letras, os sons e como formar palavras.",
        ageGroups: ['4-6', '7-9'],
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
        title: "Gramática e Vocabulário",
        description: "Entenda sinônimos, antônimos e a estrutura das frases.",
        ageGroups: ['7-9','10-12'],
        icon: "BookOpen",
        modules: [
          { id: "p2-mod1", title: "Contrários", lessons: [
              { id: "p2-l1", title: "Quiz de Antônimos", content: JSON.stringify(genPortugueseAntonyms(8)), type: "exercise" }
          ]},
          { id: "p2-mod2", title: "Tipos de Palavras", lessons: [
              { id: "p2-l2", title: "Substantivos e Adjetivos", content: "Substantivo dá nome às coisas (CASA). Adjetivo dá qualidade (CASA bonita).", type: "reading" }
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
    ageGroups: ['4-6','7-9','10-12'],
    activities: [
      {
        id: "i1",
        title: "Primeiras Palavras",
        description: "Aprenda números, cores e animais em inglês.",
        ageGroups: ['4-6','7-9'],
        icon: "SpellCheck",
        modules: [
          { id: "i1-mod1", title: "Numbers and Colors", lessons: [
              { id: "i1-l1", title: "Quiz: Numbers 1-12", content: JSON.stringify(genEnglishNumbers(12)), type: "exercise" }
          ]},
          { id: "i1-mod2", title: "Animals", lessons: [
              { id: "i1-l2", title: "Quiz: Common Animals", content: JSON.stringify(genEnglishAnimals(8)), type: "exercise" }
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
        title: "Corpo Humano",
        description: "Conheça as partes do corpo e como elas funcionam.",
        ageGroups: ['4-6','7-9'],
        icon: "FlaskConical",
        modules: [
          { id: "c1-mod1", title: "Sistemas Vitais", lessons: [
              { id: "c1-l1", title: "Como o Corpo Funciona", content: reading_body_systems, type: "reading" },
              { id: "c1-l2", title: "Quiz: Órgãos do Corpo", content: JSON.stringify(genScienceBodyParts(6)), type: "exercise" }
          ]}
        ]
      },
      {
        id: "c2",
        title: "Mundo Natural",
        description: "Explore o ciclo da água, plantas e animais.",
        ageGroups: ['7-9','10-12'],
        icon: "Globe",
        modules: [
          { id: "c2-mod1", title: "Ciclos da Natureza", lessons: [
              { id: "c2-l1", title: "O Ciclo da Água", content: reading_water_cycle, type: "reading" }
          ]}
        ]
      }
    ]
  },
  {
    name: "História",
    slug: "historia",
    icon: "Landmark",
    color: "orange",
    ageGroups: ['7-9','10-12'],
    activities: [
      { id: "h1", title: "História do Brasil", description: "Eventos que moldaram o nosso país.", ageGroups: ['7-9','10-12'], icon: "Landmark", modules: [
          { id: "h1-mod1", title: "Descobrimento e Colonização", lessons: [
              { id: "h1-l1", title: "A Chegada dos Portugueses", content: reading_discovery_brazil, type: "reading" },
              { id: "h1-l2", title: "Quiz de Fatos Históricos", content: JSON.stringify(genGeographyCapitals(5)), type: "exercise" }
          ]}
      ]}
    ]
  },
  {
    name: "Geografia",
    slug: "geografia",
    icon: "Globe",
    color: "teal",
    ageGroups: ['7-9','10-12'],
    activities: [
      { id: "g1", title: "Mapas e Lugares", description: "Aprenda sobre estados, capitais e continentes.", ageGroups: ['7-9','10-12'], icon: "Globe", modules: [
          { id: "g1-mod1", title: "Brasil e o Mundo", lessons: [
              { id: "g1-l1", title: "Quiz de Capitais", content: JSON.stringify(genGeographyCapitals(9)), type: "exercise" }
          ]}
      ]}
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
              { id: "a1-l1", title: "Misturando as Cores", content: reading_primary_colors, type: "reading" }
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
          ]}
      ]}
    ]
  },
];