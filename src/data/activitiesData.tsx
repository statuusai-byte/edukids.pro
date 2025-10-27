import { ReactNode } from 'react';
import { Apple, Sigma, BookOpen, FlaskConical, Globe, Palette, Music, Brain, Code, Bot, PiggyBank, Landmark, SpellCheck } from 'lucide-react';

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  icon: ReactNode;
}

export interface Subject {
  name: string;
  slug: string;
  icon: ReactNode;
  color: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  activities: Activity[];
}

export const subjectsData: Subject[] = [
  {
    name: "Matemática",
    slug: "matematica",
    icon: <Sigma className="h-12 w-12 text-cyan-400" />,
    color: "cyan",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      { id: "m1", title: "Contando Frutas", description: "Conte as frutas coloridas na cesta.", ageGroups: ['4-6'], icon: <Apple /> },
      { id: "m2", title: "Formas Divertidas", description: "Encontre e identifique quadrados, círculos e triângulos.", ageGroups: ['4-6'], icon: <Apple /> },
      { id: "m3", title: "Soma com Blocos", description: "Resolva somas simples com blocos de montar virtuais.", ageGroups: ['4-6', '7-9'], icon: <Apple /> },
      { id: "m4", title: "Desafio da Tabuada", description: "Teste sua velocidade na multiplicação de 1 a 10.", ageGroups: ['7-9', '10-12'], icon: <Apple /> },
      { id: "m5", title: "Frações com Pizza", description: "Aprenda frações dividindo pizzas deliciosas.", ageGroups: ['7-9', '10-12'], icon: <Apple /> },
      { id: "m6", title: "Problemas de Lógica", description: "Resolva quebra-cabeças matemáticos que desafiam o raciocínio.", ageGroups: ['10-12'], icon: <Apple /> },
      { id: "m7", title: "Geometria Básica", description: "Explore ângulos, perímetros e áreas de figuras planas.", ageGroups: ['10-12'], icon: <Apple /> },
    ]
  },
  {
    name: "Português",
    slug: "portugues",
    icon: <BookOpen className="h-12 w-12 text-purple-400" />,
    color: "purple",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      { id: "p1", title: "Alfabeto Animado", description: "Aprenda as letras do alfabeto com animações divertidas.", ageGroups: ['4-6'], icon: <BookOpen /> },
      { id: "p2", title: "Formando Palavras", description: "Junte as sílabas para formar palavras simples.", ageGroups: ['4-6', '7-9'], icon: <BookOpen /> },
      { id: "p3", title: "Caça-Rimas", description: "Encontre as palavras que rimam neste jogo divertido.", ageGroups: ['4-6', '7-9'], icon: <BookOpen /> },
      { id: "p4", title: "Interpretação de Texto", description: "Leia pequenas histórias e responda a perguntas.", ageGroups: ['7-9', '10-12'], icon: <BookOpen /> },
      { id: "p5", title: "Acentuação Correta", description: "Aprenda a usar acentos agudos e circunflexos.", ageGroups: ['7-9', '10-12'], icon: <BookOpen /> },
      { id: "p6", "title": "Classes Gramaticais", "description": "Identifique substantivos, adjetivos e verbos em frases.", "ageGroups": ['10-12'], icon: <BookOpen /> },
      { id: "p7", "title": "Produção de Texto", "description": "Crie suas próprias histórias a partir de temas sugeridos.", "ageGroups": ['10-12'], icon: <BookOpen /> },
    ]
  },
  {
    name: "Ciências",
    slug: "ciencias",
    icon: <FlaskConical className="h-12 w-12 text-green-400" />,
    color: "green",
    ageGroups: ['7-9', '10-12'],
    activities: [
        { id: "c1", title: "Corpo Humano", description: "Explore os principais órgãos e sistemas do corpo.", ageGroups: ['7-9', '10-12'], icon: <FlaskConical /> },
        { id: "c2", title: "Ciclo da Água", description: "Aprenda sobre evaporação, condensação e precipitação.", ageGroups: ['7-9'], icon: <FlaskConical /> },
        { id: "c3", title: "Sistema Solar", description: "Viaje pelos planetas do nosso sistema solar.", ageGroups: ['7-9', '10-12'], icon: <FlaskConical /> },
        { id: "c4", title: "Cadeia Alimentar", description: "Descubra quem come quem no reino animal.", ageGroups: ['7-9', '10-12'], icon: <FlaskConical /> },
        { id: "c5", title: "Genética Básica", description: "Entenda os conceitos de DNA e hereditariedade.", ageGroups: ['10-12'], icon: <FlaskConical /> },
    ]
  },
  {
    name: "História",
    slug: "historia",
    icon: <Landmark className="h-12 w-12 text-orange-400" />,
    color: "orange",
    ageGroups: ['7-9', '10-12'],
    activities: [
        { id: "h1", title: "Descobrimento do Brasil", description: "Conheça a chegada dos portugueses ao Brasil.", ageGroups: ['7-9', '10-12'], icon: <Landmark /> },
        { id: "h2", title: "Egito Antigo", description: "Explore as pirâmides, faraós e a vida no Nilo.", ageGroups: ['7-9', '10-12'], icon: <Landmark /> },
        { id: "h3", title: "Grécia Antiga", description: "Aprenda sobre os deuses, heróis e filósofos gregos.", ageGroups: ['10-12'], icon: <Landmark /> },
        { id: "h4", title: "Revolução Industrial", description: "Entenda a mudança das máquinas e fábricas.", ageGroups: ['10-12'], icon: <Landmark /> },
    ]
  },
  {
    name: "Geografia",
    slug: "geografia",
    icon: <Globe className="h-12 w-12 text-teal-400" />,
    color: "teal",
    ageGroups: ['7-9', '10-12'],
    activities: [
        { id: "g1", title: "Capitais do Brasil", description: "Teste seus conhecimentos sobre as capitais brasileiras.", ageGroups: ['7-9', '10-12'], icon: <Globe /> },
        { id: "g2", title: "Biomas Brasileiros", description: "Conheça a Amazônia, o Cerrado, a Mata Atlântica e mais.", ageGroups: ['7-9', '10-12'], icon: <Globe /> },
        { id: "g3", title: "Continentes e Oceanos", description: "Navegue pelo mapa-múndi e aprenda sobre o planeta.", ageGroups: ['7-9', '10-12'], icon: <Globe /> },
        { id: "g4", title: "Relevo e Clima", description: "Entenda como as montanhas e o clima moldam o mundo.", ageGroups: ['10-12'], icon: <Globe /> },
    ]
  },
  {
    name: "Inglês",
    slug: "ingles",
    icon: <SpellCheck className="h-12 w-12 text-indigo-400" />,
    color: "indigo",
    ageGroups: ['7-9', '10-12'],
    activities: [
        { id: "i1", title: "Colors and Numbers", description: "Aprenda as cores e os números em inglês.", ageGroups: ['7-9'], icon: <SpellCheck /> },
        { id: "i2", title: "Animals Vocabulary", description: "Descubra o nome dos animais em inglês.", ageGroups: ['7-9', '10-12'], icon: <SpellCheck /> },
        { id: "i3", title: "Simple Present", description: "Forme frases no presente simples.", ageGroups: ['10-12'], icon: <SpellCheck /> },
    ]
  },
  {
    name: "Lógica",
    slug: "logica",
    icon: <Brain className="h-12 w-12 text-yellow-400" />,
    color: "yellow",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
        { id: "l1", title: "Sequência Lógica", description: "Complete as sequências de formas e cores.", ageGroups: ['4-6', '7-9'], icon: <Brain /> },
        { id: "l2", title: "Sudoku para Crianças", description: "Resolva sudokus simples com números ou figuras.", ageGroups: ['7-9', '10-12'], icon: <Brain /> },
        { id: "l3", title: "Charadas e Enigmas", description: "Teste seu raciocínio com enigmas desafiadores.", ageGroups: ['10-12'], icon: <Brain /> },
    ]
  },
  {
    name: "Artes",
    slug: "artes",
    icon: <Palette className="h-12 w-12 text-red-400" />,
    color: "red",
    ageGroups: ['4-6', '7-9'],
    activities: [
        { id: "a1", title: "Pintura Digital", description: "Use cores e pincéis para criar sua obra de arte.", ageGroups: ['4-6', '7-9'], icon: <Palette /> },
        { id: "a2", title: "Misturando Cores", description: "Descubra o que acontece quando misturamos as cores primárias.", ageGroups: ['4-6', '7-9'], icon: <Palette /> },
    ]
  },
  {
    name: "Música",
    slug: "musica",
    icon: <Music className="h-12 w-12 text-pink-400" />,
    color: "pink",
    ageGroups: ['4-6', '7-9'],
    activities: [
        { id: "mu1", title: "Sons dos Instrumentos", description: "Ouça e adivinhe qual instrumento está tocando.", ageGroups: ['4-6', '7-9'], icon: <Music /> },
        { id: "mu2", title: "Ritmo Divertido", description: "Acompanhe as batidas e crie seus próprios ritmos.", ageGroups: ['4-6', '7-9'], icon: <Music /> },
    ]
  },
  {
    name: "Programação",
    slug: "programacao",
    icon: <Code className="h-12 w-12 text-slate-400" />,
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
        { id: "pr1", title: "Lógica de Blocos", description: "Aprenda os fundamentos da programação com blocos visuais.", ageGroups: ['10-12'], icon: <Code /> },
        { id: "pr2", title: "Crie seu Primeiro Jogo", description: "Siga o passo a passo para criar um jogo simples.", ageGroups: ['10-12'], icon: <Code /> },
    ]
  },
  {
    name: "Robótica",
    slug: "robotica",
    icon: <Bot className="h-12 w-12 text-rose-400" />,
    color: "rose",
    ageGroups: ['10-12'],
    activities: [
        { id: "r1", title: "Monte seu Robô Virtual", description: "Escolha as peças e monte um robô em um ambiente 3D.", ageGroups: ['10-12'], icon: <Bot /> },
        { id: "r2", title: "Programando o Robô", description: "Dê comandos para seu robô completar missões.", ageGroups: ['10-12'], icon: <Bot /> },
    ]
  },
  {
    name: "Finanças",
    slug: "financas",
    icon: <PiggyBank className="h-12 w-12 text-lime-400" />,
    color: "lime",
    ageGroups: ['10-12'],
    activities: [
        { id: "f1", title: "Jogo da Mesada", description: "Aprenda a administrar sua mesada e a poupar.", ageGroups: ['10-12'], icon: <PiggyBank /> },
        { id: "f2", title: "Consumo Consciente", description: "Entenda a diferença entre querer e precisar.", ageGroups: ['10-12'], icon: <PiggyBank /> },
    ]
  }
];