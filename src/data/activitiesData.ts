/**
 * activitiesData.ts
 * Complete and self-contained data file that exports types and subjectsData used across the app.
 *
 * NOTE: Premium lessons must not contain the actual payload (quizzes/text) in the client bundle.
 * The content for lessons marked `premium: true` is now expected to be stored in the database
 * (table `public.premium_content`) and fetched at runtime by LessonPage.
 */

import type { QuizQuestion } from '@/components/QuizComponent';
import type { IconName } from '@/components/Icon';

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string; // JSON.stringify([...]) for quizzes or plain text (used only for non-premium)
  type?: 'reading' | 'exercise' | 'game';
  component?: 'ContandoFrutas' | 'FormandoPalavras'; // Explicit component mapping for games
  premium?: boolean; // whether this lesson requires Premium access (content fetched from server)
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

/* ---------- Helper functions for quiz generation (used only for non-premium content) ---------- */

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

/* ---------- Quiz Generators (used below for free content) ---------- */

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

const VOCAB_PAIRS = [
  { word: "Feliz", antonym: "Triste", synonym: "Alegre" },
  { word: "Grande", antonym: "Pequeno", synonym: "Enorme" },
  { word: "Rápido", antonym: "Lento", synonym: "Veloz" },
  { word: "Quente", antonym: "Frio", synonym: "Morno" },
  { word: "Claro", antonym: "Escuro", synonym: "Brilhante" },
  { word: "Forte", antonym: "Fraco", synonym: "Potente" },
  { word: "Doce", antonym: "Salgado", synonym: "Açucarado" },
];

function genVocabQuiz(count: number, type: 'antonym' | 'synonym'): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const pairs = shuffle([...VOCAB_PAIRS]);
  
  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length];
    const questionType = type === 'antonym' ? 'Antônimo' : 'Sinônimo';
    const correct = type === 'antonym' ? pair.antonym : pair.synonym;
    
    const wrongOptions = VOCAB_PAIRS
      .filter(p => p.word !== pair.word)
      .map(p => type === 'antonym' ? p.antonym : p.synonym);

    out.push({
      question: `Qual é o ${questionType} de "${pair.word}"?`,
      options: makeOptions(correct, wrongOptions),
      correctAnswer: correct,
    });
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
              // 4-6 anos: Números pequenos
              { id: "m1-l1", title: "Reconhecendo Números", content: JSON.stringify(genAdd(FREE_QUIZ_COUNT, 10)), type: "exercise" },
              { id: "m1-l2", title: "Primeiras Somas (até 10)", content: JSON.stringify(genAdd(FREE_QUIZ_COUNT, 5)), type: "exercise" }
            ]
          },
          {
            id: "m1-mod2", title: "Introdução à Subtração", lessons: [
              // 4-6 anos: Subtração simples (até 10)
              { id: "m1-l3", title: "Tirando Objetos (até 10)", content: JSON.stringify(genSub(FREE_QUIZ_COUNT, 10)), type: "exercise" },
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
              // 7-9 anos: Números maiores
              { id: "m2-l1", title: "Somando até 100", content: JSON.stringify(genAdd(FREE_QUIZ_COUNT, 100)), type: "exercise" },
              { id: "m2-l2", title: "Subtraindo até 100", content: JSON.stringify(genSub(FREE_QUIZ_COUNT, 100)), type: "exercise" }
            ]
          },
          {
            id: "m2-mod2", title: "Multiplicação é Mágica", lessons: [
              // PREMIUM
              { id: "m2-l3", title: "Tabuadas Divertidas", type: "exercise", premium: true },
              // Usando adição/subtração como placeholder para 'problemas'
              { id: "m2-l4", title: "Resolvendo Problemas de Vezes (Simulado)", content: JSON.stringify(genAdd(FREE_QUIZ_COUNT, 50)), type: "exercise" }
            ]
          },
          {
            id: "m2-mod3", title: "Dividindo o Tesouro", lessons: [
              // PREMIUM
              { id: "m2-l5", title: "Dividindo em Partes Iguais", type: "exercise", premium: true },
              // Usando subtração como placeholder para 'divisão e resto'
              { id: "m2-l6", title: "Divisão e Resto (Simulado)", content: JSON.stringify(genSub(FREE_QUIZ_COUNT, 50)), type: "exercise" }
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
                `, 
                type: "reading" 
              },
              // PREMIUM
              { id: "m3-l2", title: "Exercícios com Frações", type: "exercise", premium: true }
            ]
          },
          {
            id: "m3-mod2", title: "Geometria Básica", lessons: [
              { 
                id: "m3-l3", 
                title: "Ângulos e Formas", 
                content: `
                  <p>A geometria é o estudo das formas e dos espaços. Tudo ao nosso redor tem uma forma geométrica!</p>
                `, 
                type: "reading" 
              },
              { 
                id: "m3-l4", 
                title: "Calculando Áreas", 
                content: `
                  <p>A <strong>área</strong> é o espaço que uma forma ocupa em uma superfície plana.</p>
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
                  <p>Elas são: A, E, I, O, U. Tente dizer o som de cada uma!</p>
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
              // 7-9 anos: Antônimos
              { id: "p2-l1", title: "Quiz de Antônimos", content: JSON.stringify(genVocabQuiz(FREE_QUIZ_COUNT, 'antonym')), type: "exercise" }
            ]
          },
          {
            id: "p2-mod2", title: "Tipos de Palavras", lessons: [
              // 7-9 anos: Sinônimos
              { id: "p2-l2", title: "Quiz de Sinônimos", content: JSON.stringify(genVocabQuiz(FREE_QUIZ_COUNT, 'synonym')), type: "exercise" }
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
                  <p>Os <strong>verbos</strong> são palavras que indicam ações, estados ou fenômenos da natureza. Eles mudam de forma (conjugação) para indicar quando a ação aconteceu.</p>
                  <ul>
                    <li><strong>Presente:</strong> Acontece agora (Eu como).</li>
                    <li><strong>Passado (Pretérito):</strong> Já aconteceu (Eu comi).</li>
                    <li><strong>Futuro:</strong> Vai acontecer (Eu comerei).</li>
                  </ul>
                `, 
                type: "reading", 
              },
              // PREMIUM: Quiz de conjugação
              { id: "p3-l3", title: "Quiz: Conjugação Verbal", type: "exercise", premium: true }
            ]
          },
          {
            id: "p3-mod2", title: "Pontuação", lessons: [
              { 
                id: "p3-l2", 
                title: "Vírgula, Ponto e Interrogação", 
                content: `
                  <p>A <strong>pontuação</strong> é como as placas de trânsito da leitura. Elas nos dizem quando parar, respirar ou mudar a entonação.</p>
                  <ul>
                    <li><strong>Ponto final (.):</strong> Termina uma ideia.</li>
                    <li><strong>Vírgula (,):</strong> Pausa curta, separa itens em uma lista.</li>
                    <li><strong>Ponto de interrogação (?):</strong> Indica uma pergunta.</li>
                  </ul>
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
    name: "Ciências",
    slug: "ciencias",
    icon: "FlaskConical",
    color: "green",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "c1",
        title: "O Mundo ao Redor (4-6 anos)",
        description: "Descobrindo animais, plantas e o clima.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "c1-mod1", title: "Animais e Plantas", lessons: [
              { id: "c1-l1", title: "Onde Vivem os Animais?", content: `<p>Os animais vivem em muitos lugares: na floresta, no mar, ou até na nossa casa! Vamos aprender sobre eles.</p>`, type: "reading" },
              // PREMIUM: Quiz de classificação animal
              { id: "c1-l2", title: "Quiz: Classificando Animais", type: "exercise", premium: true }
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
              { id: "c2-l1", title: "Como o Corpo Funciona", content: `
                <p>O corpo humano é uma máquina incrível! Ele é feito de ossos, músculos e órgãos que trabalham juntos.</p>
                <p>O coração bombeia o sangue, os pulmões nos ajudam a respirar e o cérebro controla tudo.</p>
              `, type: "reading" },
              // PREMIUM
              { id: "c2-l2", title: "Quiz: Órgãos do Corpo", type: "exercise", premium: true }
            ]
          },
          {
            id: "c2-mod2", title: "Ciclos da Natureza", lessons: [
              { id: "c2-l3", title: "O Ciclo da Água", content: `<p>A água viaja da terra para o céu e volta em forma de chuva. Isso se chama ciclo da água!</p>`, type: "reading" },
              // PREMIUM
              { id: "c2-l4", title: "Quiz: Estados da Água", type: "exercise", premium: true }
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
                  <p>Em <strong>1500</strong>, navegadores portugueses liderados por <strong>Pedro Álvares Cabral</strong> chegaram ao Brasil.</p>
                  <p>Antes disso, o Brasil já era habitado por diversos povos indígenas.</p>
                `, 
                type: "reading" 
              },
              // PREMIUM
              { id: "h1-l2", title: "Quiz de Fatos Históricos", type: "exercise", premium: true }
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
                  <p>Um <strong>mapa</strong> é um desenho que nos ajuda a ver lugares grandes, como cidades, países e continentes.</p>
                  <p>Eles usam símbolos e cores para representar rios, montanhas e fronteiras.</p>
                `, 
                type: "reading" 
              },
              // PREMIUM
              { id: "g1-l1", title: "Quiz de Capitais", type: "exercise", premium: true }
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
                  <p>O <strong>dinheiro</strong> é uma ferramenta que usamos para trocar por coisas. Pode ser em moedas, notas ou cartões.</p>
                `, 
                type: "reading" 
              },
              // Usando quiz de vocabulário como placeholder para exercício de finanças
              { id: "ef1-l1", title: "Quiz: O que é Poupar?", content: JSON.stringify(genVocabQuiz(FREE_QUIZ_COUNT, 'synonym')), type: "exercise" },
              // PREMIUM
              { id: "ef1-l2", title: "Quiz Avançado: Investimentos e Juros", type: "exercise", premium: true }
            ]
          }
        ]
      }
    ]
  }
];