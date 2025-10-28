/**
 * Gerador compacto de dados de atividades/quizzes.
 * - Gera várias questões por lição de forma programática.
 * - Remove perguntas duplicadas por texto.
 * - Exporta subjectsData com lições que usam JSON.stringify(...) para conteúdo do quiz.
 *
 * Observação: mantive a tipagem compatível com o resto do app.
 */

import { IconName } from '@/components/Icon';
import { QuizQuestion } from '@/components/QuizComponent';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string; // JSON.stringify(...) for quizzes or plain text
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

/* ---------- Helpers geradores ---------- */

const MULTIPLIER = 3; // garante ~3x mais perguntas que antes

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function uniqByQuestion(arr: QuizQuestion[]) {
  const seen = new Set<string>();
  const out: QuizQuestion[] = [];
  for (const q of arr) {
    const key = q.question.trim();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(q);
    }
  }
  return out;
}

function makeOptions(correct: string, extras: string[]) {
  const opts = [correct, ...extras.slice(0, 2)];
  const unique = Array.from(new Set(opts));
  while (unique.length < 3) {
    unique.push(String(Number(correct || 0) + unique.length));
  }
  shuffle(unique);
  return unique;
}

/* Matemática geradores */
function genAdd(count: number, minA = 1, maxA = 20, minB = 1, maxB = 20): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = minA + ((i * 7) % (maxA - minA + 1));
    const b = minB + ((i * 11) % (maxB - minB + 1));
    const correct = a + b;
    const wrong1 = correct + ((i % 5) - 2);
    const wrong2 = Math.max(0, correct + ((i % 7) - 3));
    out.push({
      question: `Quanto é ${a} + ${b}?`,
      options: makeOptions(String(correct), [String(wrong1), String(wrong2)]),
      correctAnswer: String(correct),
    });
  }
  return uniqByQuestion(out);
}

function genSub(count: number, minA = 2, maxA = 30, minB = 1, maxB = 20): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = minA + ((i * 5) % (maxA - minA + 1));
    const bMax = Math.min(maxB, a - 1);
    const b = minB + ((i * 3) % Math.max(1, (bMax - minB + 1)));
    const correct = a - b;
    const wrong1 = Math.max(0, correct + 1 + (i % 3));
    const wrong2 = Math.max(0, correct - 1 - (i % 2));
    out.push({
      question: `Quanto é ${a} - ${b}?`,
      options: makeOptions(String(correct), [String(wrong1), String(wrong2)]),
      correctAnswer: String(correct),
    });
  }
  return uniqByQuestion(out);
}

function genMul(count: number, min = 1, max = 12): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = min + ((i * 3) % (max - min + 1));
    const b = min + ((i * 5) % (max - min + 1));
    const correct = a * b;
    const wrong1 = Math.max(1, correct + ((i % 4) + 1));
    const wrong2 = Math.max(1, correct - ((i % 5) + 1));
    out.push({
      question: `Quanto é ${a} × ${b}?`,
      options: makeOptions(String(correct), [String(wrong1), String(wrong2)]),
      correctAnswer: String(correct),
    });
  }
  return uniqByQuestion(out);
}

function genNumberRecognition(count: number, maxNum = 50): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = 1 + ((i * 13) % maxNum);
    const wrong1 = Math.max(1, n + ((i % 6) === 0 ? 2 : -1));
    const wrong2 = Math.max(1, n + ((i % 4) === 0 ? 3 : 1));
    out.push({
      question: `Quantos objetos você vê (representação): ${'●'.repeat(Math.min(12, n))}${n > 12 ? ` (+${n - 12})` : ''}`,
      options: makeOptions(String(n), [String(wrong1), String(wrong2)]),
      correctAnswer: String(n),
    });
  }
  return uniqByQuestion(out);
}

/* Inglês / Cores */
function genEnglishNumbers(count = 20) {
  const words = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const n = 1 + (i % words.length);
    const correct = words[n - 1];
    const wrong1 = words[(n + 1) % words.length];
    const wrong2 = words[(n + 2) % words.length];
    out.push({
      question: `How do you say the number ${n} in English?`,
      options: makeOptions(correct, [wrong1, wrong2]),
      correctAnswer: correct,
    });
  }
  return uniqByQuestion(out);
}

function genColors(count = 20) {
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
    const p = palette[i % palette.length];
    const wrong1 = palette[(i + 1) % palette.length];
    const wrong2 = palette[(i + 2) % palette.length];
    out.push({
      question: `How do you say "${p.pt}" in English?`,
      options: makeOptions(p.en, [wrong1.en, wrong2.en]),
      correctAnswer: p.en,
    });
  }
  return uniqByQuestion(out);
}

/* Português - letras e sílabas */
function genLetters(count = 30) {
  const words = ['BOLA','CASA','PATO','GATO','FOCA','MALA','SOL','LUA','RUA','OLHO','PEIXE','CARRO','CAMA','MESA','PÉ','TELA','PORTA','LIVRO'];
  const out: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const w = words[i % words.length];
    const correct = w.charAt(0);
    const wrong1 = String.fromCharCode(65 + ((i + 2) % 26));
    const wrong2 = String.fromCharCode(65 + ((i + 5) % 26));
    out.push({
      question: `Qual letra começa a palavra '${w}'?`,
      options: makeOptions(correct, [wrong1, wrong2]),
      correctAnswer: correct,
    });
  }
  return uniqByQuestion(out);
}

/* Ciências / História / Geografia etc. - templates simples */
function genSimpleMultiple(choiceSets: { q: string; correct: string; extras: string[] }[]) {
  return uniqByQuestion(choiceSets.map((c) => ({
    question: c.q,
    options: makeOptions(c.correct, c.extras),
    correctAnswer: c.correct,
  })));
}

/* ---------- Montagem dos quizzes (usando geradores) ---------- */

/* Matemática — exemplos ampliados por módulo/lição */
const math_m1_l1 = uniqByQuestion([
  ...genNumberRecognition(12 * MULTIPLIER, 20),
  ...genAdd(10 * MULTIPLIER, 1, 8, 1, 8),
]);

const math_m1_l2 = uniqByQuestion([
  ...genAdd(12 * MULTIPLIER, 2, 12, 1, 10),
  ...genNumberRecognition(8 * MULTIPLIER, 30),
]);

const math_m1_l4 = uniqByQuestion([
  ...genAdd(10 * MULTIPLIER, 1, 12, 1, 12),
  ...genSub(10 * MULTIPLIER, 1, 15, 1, 12),
]);

const math_m1_l5 = uniqByQuestion([
  ...genSub(12 * MULTIPLIER, 2, 20, 1, 12),
  ...genAdd(8 * MULTIPLIER, 1, 15, 1, 15),
]);

const math_m1_l6 = uniqByQuestion([
  ...genAdd(10 * MULTIPLIER, 1, 20, 1, 20),
  ...genNumberRecognition(10 * MULTIPLIER, 50),
]);

const math_m4_l1 = uniqByQuestion([
  ...genMul(12 * MULTIPLIER, 1, 8),
  ...genAdd(8 * MULTIPLIER, 1, 20, 1, 20),
]);

const math_m4_l2 = uniqByQuestion([
  ...genMul(16 * MULTIPLIER, 1, 12),
  ...genSub(8 * MULTIPLIER, 5, 50, 1, 30),
]);

/* Português */
const port_p1_l1 = genLetters(20 * MULTIPLIER);
const port_p1_l2 = genLetters(15 * MULTIPLIER);
const port_p2_l1 = uniqByQuestion([
  ...genLetters(8 * MULTIPLIER),
  // sílabas simples geradas como combinação
  ...Array.from({ length: 10 * MULTIPLIER }).map((_, i) => {
    const syllables = ['PA','TO','CA','SA','MA','LA','BO','LA','LU','A'];
    const a = syllables[i % syllables.length];
    const b = syllables[(i + 3) % syllables.length];
    const word = a + b;
    return {
      question: `Forme a palavra: quais sílabas formam '${word}'? (exemplo)`,
      options: makeOptions(word, [a + syllables[(i+1)%syllables.length], syllables[(i+2)%syllables.length] + b]),
      correctAnswer: word,
    } as QuizQuestion;
  }),
]);

/* Inglês */
const eng_i1_l1 = uniqByQuestion([
  ...genEnglishNumbers(20 * MULTIPLIER),
  ...genColors(12 * MULTIPLIER),
]);

/* Ciências simples */
const sci_c1_l2 = genSimpleMultiple([
  { q: "Qual órgão usamos para respirar?", correct: "Pulmões", extras: ["Coração", "Estômago"] },
  { q: "O que o corpo absorve do ar?", correct: "Oxigênio", extras: ["Gás carbônico", "Água"] },
  { q: "Onde acontece a digestão principal?", correct: "Estômago", extras: ["Pulmões", "Coração"] },
  ...Array.from({ length: 6 * MULTIPLIER }).map((_, i) => ({
    q: `Pergunta de ciência rápida #${i+1}: associação básica`,
    correct: ["Leite","Água","Ossos","Célula","Pulmões","Sangue"][i % 6],
    extras: ["OpcA","OpcB","OpcC"].slice(0,2),
  })),
]);

/* História / Geografia / Outras */
const hist_h1_l2 = genSimpleMultiple([
  { q: "Quem liderou a frota que chegou ao Brasil em 1500?", correct: "Pedro Álvares Cabral", extras: ["Cristóvão Colombo","Vasco da Gama"] },
  { q: "Em que ano os portugueses chegaram ao Brasil (data comumente usada)?", correct: "1500", extras: ["1492","1600"] },
  ...Array.from({ length: 6 * MULTIPLIER }).map((_, i) => ({
    q: `Pergunta de história rápida #${i+1}`,
    correct: "Resposta correta",
    extras: ["Errado A","Errado B"],
  })),
]);

const geo_g1_l1 = genSimpleMultiple([
  { q: "Qual é a capital do Brasil?", correct: "Brasília", extras: ["Rio de Janeiro","São Paulo"] },
  { q: "Capital do estado de São Paulo é:", correct: "São Paulo", extras: ["Campinas","Santos"] },
  ...Array.from({ length: 6 * MULTIPLIER }).map((_, i) => ({
    q: `Pergunta de geografia rápida #${i+1}`,
    correct: "Brasília",
    extras: ["Errado1","Errado2"]
  }))
]);

/* Música, Artes, Programação — templates */
const arts_a1_l2 = genSimpleMultiple([
  { q: "Quais são as cores primárias?", correct: "Vermelho, Azul, Amarelo", extras: ["Roxo, Verde, Laranja","Preto, Branco, Cinza"] },
  ...Array.from({ length: 6 * MULTIPLIER }).map((_, i) => ({
    q: `Pergunta de artes #${i+1}`,
    correct: "Resposta correta",
    extras: ["Errado A","Errado B"]
  }))
]);

const prog_pr1_l1 = genSimpleMultiple([
  { q: "O que é um algoritmo?", correct: "Sequência de passos", extras: ["Um tipo de robô","Um número"] },
  { q: "Um loop serve para:", correct: "Repetir uma ação", extras: ["Parar o programa","Mudar cor"] },
  ...Array.from({ length: 8 * MULTIPLIER }).map((_, i) => ({
    q: `Pergunta de programação #${i+1}`,
    correct: "Repetir uma ação",
    extras: ["Errado1","Errado2"]
  }))
]);

/* ---------- subjectsData export (compact) ---------- */

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
        title: "Contagem e Reconhecimento Numérico",
        description: "Percepção quantitativa e associação de números a quantidades.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m1-mod-intro",
            title: "Números 1 a 5",
            description: "Contagem sequencial e identificação visual.",
            lessons: [
              { id: "m1-l1", title: "Quantidades Iniciais", description: "Prática de contagem e reconhecimento.", content: JSON.stringify(math_m1_l1), type: "exercise" },
              { id: "m1-l2", title: "Expandindo a Contagem", description: "Adição simples com visualizações.", content: JSON.stringify(math_m1_l2), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-atividades",
            title: "Jogos de Fixação",
            description: "Atividades interativas para reforçar conceitos.",
            lessons: [
              { id: "m1-l3", title: "Contando com Jogos", description: "Jogo interativo: ContandoFrutas", content: "Clique no número correto que representa a quantidade de maçãs.", type: "game" },
              { id: "m1-l4", title: "Desafios de Adição", description: "Problemas de adição e subtração.", content: JSON.stringify(math_m1_l4), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-revisao",
            title: "Revisão e Avaliação",
            description: "Testes e autoavaliações.",
            lessons: [
              { id: "m1-l5", title: "Subtração Visual", description: "Subtração com objetos.", content: JSON.stringify(math_m1_l5), type: "exercise" },
              { id: "m1-l6", title: "Autoavaliação", description: "Quiz abrangente de contagem.", content: JSON.stringify(math_m1_l6), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m4",
        title: "Multiplicação e Tabuada",
        description: "Compreensão da multiplicação como adição repetida.",
        ageGroups: ['7-9','10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m4-mod-1",
            title: "Tabuada Inicial",
            description: "Estratégias e prática.",
            lessons: [
              { id: "m4-l1", title: "Multiplicação Básica", description: "Grupos iguais e tabuada inicial.", content: JSON.stringify(math_m4_l1), type: "exercise" },
              { id: "m4-l2", title: "Quiz de Tabuada", description: "Testes de velocidade e precisão.", content: JSON.stringify(math_m4_l2), type: "exercise" }
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
    ageGroups: ['4-6','7-9','10-12'],
    activities: [
      {
        id: "p1",
        title: "Alfabetização",
        description: "Letras, fonemas e formação de palavras.",
        ageGroups: ['4-6'],
        icon: "BookOpen",
        modules: [
          { id: "p1-mod-1", title: "Alfabeto", lessons: [{ id: "p1-l1", title: "Sons e Letras", description: "Associe letras e sons.", content: JSON.stringify(port_p1_l1), type: "exercise" }, { id: "p1-l2", title: "Identificação", description: "Localizando letras em palavras.", content: JSON.stringify(port_p1_l2), type: "exercise" }] },
          { id: "p1-mod-2", title: "Formação de Palavras", lessons: [{ id: "p1-l3", title: "Montagem de Palavras", description: "Forme palavras a partir de sílabas.", content: JSON.stringify(port_p2_l1), type: "exercise" }] }
        ]
      }
    ]
  },

  {
    name: "Inglês",
    slug: "ingles",
    icon: "SpellCheck",
    color: "indigo",
    ageGroups: ['7-9','10-12'],
    activities: [
      {
        id: "i1",
        title: "Vocabulário Básico",
        description: "Cores e números em inglês.",
        ageGroups: ['7-9'],
        icon: "SpellCheck",
        modules: [
          { id: "i1-mod-1", title: "Cores e Números", lessons: [{ id: "i1-l1", title: "Colors & Numbers", description: "Aprenda nomes das cores e números.", content: JSON.stringify(eng_i1_l1), type: "exercise" }] }
        ]
      }
    ]
  },

  {
    name: "Ciências",
    slug: "ciencias",
    icon: "FlaskConical",
    color: "green",
    ageGroups: ['7-9','10-12'],
    activities: [
      {
        id: "c1",
        title: "Anatomia e Saúde",
        description: "Sistemas do corpo e práticas de higiene.",
        ageGroups: ['7-9','10-12'],
        icon: "FlaskConical",
        modules: [
          { id: "c1-mod-1", title: "Sistemas Vitais", lessons: [{ id: "c1-l1", title: "Digestão", description: "O sistema digestório.", content: "O sistema digestório começa na boca ...", type: "reading" }, { id: "c1-l2", title: "Respiração", description: "Função dos pulmões.", content: JSON.stringify(sci_c1_l2), type: "exercise" }] }
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
      { id: "h1", title: "História do Brasil", description: "Eventos que moldaram o país.", ageGroups: ['7-9','10-12'], icon: "Landmark", modules: [{ id: "h1-mod-1", title: "Colonização", lessons: [{ id: "h1-l1", title: "Povos Indígenas", description: "Cultura e modos de vida.", content: "Leitura: Povos indígenas ...", type: "reading" }, { id: "h1-l2", title: "Chegada dos Europeus", description: "Cabral e grande navegação.", content: JSON.stringify(hist_h1_l2), type: "exercise" }] }] }
  },

  {
    name: "Geografia",
    slug: "geografia",
    icon: "Globe",
    color: "teal",
    ageGroups: ['7-9','10-12'],
    activities: [
      { id: "g1", title: "Mapas e Regiões", description: "Mapas e capitais.", ageGroups: ['7-9','10-12'], icon: "Globe", modules: [{ id: "g1-mod-1", title: "Mapa Político", lessons: [{ id: "g1-l1", title: "Estados e Capitais", description: "Localizar capitais.", content: JSON.stringify(geo_g1_l1), type: "exercise" }] }] }
  },

  {
    name: "Artes",
    slug: "artes",
    icon: "Palette",
    color: "red",
    ageGroups: ['4-6','7-9'],
    activities: [
      { id: "a1", title: "Cores e Desenho", description: "Teoria das cores e prática.", ageGroups: ['4-6','7-9'], icon: "Palette", modules: [{ id: "a1-mod-1", title: "Cores", lessons: [{ id: "a1-l1", title: "Cores Primárias", description: "Mistura e identificação.", content: JSON.stringify(arts_a1_l2), type: "exercise" }] }] }
  },

  {
    name: "Programação",
    slug: "programacao",
    icon: "Code",
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
      { id: "pr1", title: "Fundamentos", description: "Algoritmos e loops", ageGroups: ['10-12'], icon: "Code", modules: [{ id: "pr1-mod-1", title: "Sequência e Repetição", lessons: [{ id: "pr1-l1", title: "Algoritmos", description: "Sequência de passos.", content: JSON.stringify(prog_pr1_l1), type: "exercise" }] }] }
  ],

  // você pode expandir com mais subjects seguindo o padrão acima
];

/* fim de activitiesData */