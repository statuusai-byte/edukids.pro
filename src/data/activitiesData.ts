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

/* ---------- Simple quiz generators ---------- */

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
    unique.push(String(Number(correct || 0) + unique.length));
  }
  return shuffle(unique);
}

function genAdd(count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const a = (i % 10) + 1;
    const b = ((i * 3) % 9) + 1;
    const correct = a + b;
    out.push({
      question: `Quanto é ${a} + ${b}?`,
      options: makeOptions(String(correct), [String(correct + 1), String(Math.max(0, correct - 1))]),
      correctAnswer: String(correct),
    });
  }
  return out;
}

function genSub(count: number): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    const a = 5 + (i % 10);
    const b = (i % 4) + 1;
    const correct = a - b;
    out.push({
      question: `Quanto é ${a} - ${b}?`,
      options: makeOptions(String(correct), [String(correct + 1), String(Math.max(0, correct - 1))]),
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
            options: makeOptions(String(correct), [String(correct + 1), String(Math.max(1, correct - 1))]),
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

/* ---------- Example lesson payloads (stringified where needed) ---------- */

const math_m1_l1 = genNumberRecognition(6);
const math_m1_l2 = genAdd(6);
const math_m1_l4 = genAdd(6);
const math_m1_l5 = genSub(6);
const math_m1_l6 = genAdd(8);

const math_m4_l1 = genMul(6);
const math_m4_l2 = genAdd(6);

const port_p1_l1 = genEnglishNumbers(6);
const port_p1_l2 = genEnglishNumbers(6);
const port_p2_l1 = genEnglishNumbers(4);

const eng_i1_l1 = genEnglishNumbers(6);

const sci_c1_l2 = genAdd(6);

const hist_h1_l2 = genNumberRecognition(4);
const geo_g1_l1 = genNumberRecognition(4);

const arts_a1_l2 = genNumberRecognition(4);
const prog_pr1_l1 = genAdd(6);

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
    ]
  },

  {
    name: "Geografia",
    slug: "geografia",
    icon: "Globe",
    color: "teal",
    ageGroups: ['7-9','10-12'],
    activities: [
      { id: "g1", title: "Mapas e Regiões", description: "Mapas e capitais.", ageGroups: ['7-9','10-12'], icon: "Globe", modules: [{ id: "g1-mod-1", title: "Mapa Político", lessons: [{ id: "g1-l1", title: "Estados e Capitais", description: "Localizar capitais.", content: JSON.stringify(geo_g1_l1), type: "exercise" }] }] }
    ]
  },

  {
    name: "Artes",
    slug: "artes",
    icon: "Palette",
    color: "red",
    ageGroups: ['4-6','7-9'],
    activities: [
      { id: "a1", title: "Cores e Desenho", description: "Teoria das cores e prática.", ageGroups: ['4-6','7-9'], icon: "Palette", modules: [{ id: "a1-mod-1", title: "Cores", lessons: [{ id: "a1-l1", title: "Cores Primárias", description: "Mistura e identificação.", content: JSON.stringify(arts_a1_l2), type: "exercise" }] }] }
    ]
  },

  {
    name: "Programação",
    slug: "programacao",
    icon: "Code",
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
      { id: "pr1", title: "Fundamentos", description: "Algoritmos e loops", ageGroups: ['10-12'], icon: "Code", modules: [{ id: "pr1-mod-1", title: "Sequência e Repetição", lessons: [{ id: "pr1-l1", title: "Algoritmos", description: "Sequência de passos.", content: JSON.stringify(prog_pr1_l1), type: "exercise" }] }] }
    ]
  },
];