import { ReactNode } from 'react';
import { Apple, Sigma, BookOpen, FlaskConical, Globe, Palette, Music, Brain, Code, Bot, PiggyBank, Landmark, SpellCheck } from 'lucide-react';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string;
  type?: 'video' | 'reading' | 'exercise' | 'game';
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  icon: ReactNode;
  lessons: Lesson[];
}

export interface Subject {
  name: string;
  slug: string;
  icon: ReactNode;
  color: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  activities: Activity[];
}

const iconClass = "h-8 w-8 text-primary";

export const subjectsData: Subject[] = [
  {
    name: "Matemática",
    slug: "matematica",
    icon: <Sigma className="h-12 w-12 text-cyan-400" />,
    color: "cyan",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "m1",
        title: "Contando Frutas",
        description: "Conte as frutas coloridas na cesta.",
        ageGroups: ['4-6'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m1-l1",
            title: "Quantas maçãs? (Introdução)",
            description: "Aprenda a contar até 5 utilizando maçãs coloridas.",
            content: "Observe as maçãs na tela e conte-as em voz alta. Repita até se sentir confiante.",
            type: "game"
          },
          {
            id: "m1-l2",
            title: "Contando até 10",
            description: "Pratique contar até 10 com diferentes frutas.",
            content: "Exercício: conte e escreva os números correspondentes às frutas mostradas.",
            type: "exercise"
          },
        ],
      },
      {
        id: "m2",
        title: "Formas Divertidas",
        description: "Encontre e identifique quadrados, círculos e triângulos.",
        ageGroups: ['4-6'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m2-l1",
            title: "Identificando Formas",
            description: "Aprenda a reconhecer formas básicas.",
            content: "Atividade: circule todos os círculos em uma imagem.",
            type: "reading"
          },
          {
            id: "m2-l2",
            title: "Formas na Vida Real",
            description: "Explore formas ao seu redor.",
            content: "Tarefa: encontre 5 objetos em casa que correspondem a cada forma.",
            type: "exercise"
          },
        ],
      },
      {
        id: "m3",
        title: "Soma com Blocos",
        description: "Resolva somas simples com blocos de montar virtuais.",
        ageGroups: ['4-6', '7-9'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m3-l1",
            title: "Soma Básica",
            description: "Introdução à soma com objetos.",
            content: "Some blocos para formar números menores que 10.",
            type: "exercise"
          },
          {
            id: "m3-l2",
            title: "Contando e Somando",
            description: "Pratique somas simples e visualize o resultado.",
            content: "Atividade passo-a-passo com blocos que se juntam.",
            type: "exercise"
          },
        ],
      },
      {
        id: "m4",
        title: "Desafio da Tabuada",
        description: "Teste sua velocidade na multiplicação de 1 a 10.",
        ageGroups: ['7-9', '10-12'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m4-l1",
            title: "Tabuada do 1 ao 5",
            description: "Aprenda e pratique as tabuadas iniciais.",
            content: "Exercícios interativos para fixação.",
            type: "exercise"
          },
          {
            id: "m4-l2",
            title: "Tabuada do 6 ao 10",
            description: "Continue praticando multiplicação.",
            content: "Jogos de rapidez para memorização da tabuada.",
            type: "exercise"
          },
        ],
      },
      {
        id: "m5",
        title: "Frações com Pizza",
        description: "Aprenda frações dividindo pizzas deliciosas.",
        ageGroups: ['7-9', '10-12'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m5-l1",
            title: "Meio e Quarto",
            description: "Entenda frações básicas.",
            content: "Vídeo: Dividindo uma pizza ao meio e em quartos.",
            videoUrl: "https://www.youtube.com/embed/CGyEd0aKWZE",
            type: "video"
          },
          {
            id: "m5-l2",
            title: "Frações Equivalentes",
            description: "Descubra quando duas frações são iguais.",
            content: "Atividade: combine pedaços para ver equivalências.",
            type: "exercise"
          },
        ],
      },
      {
        id: "m6",
        title: "Problemas de Lógica",
        description: "Resolva quebra-cabeças matemáticos que desafiam o raciocínio.",
        ageGroups: ['10-12'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m6-l1",
            title: "Desafios Iniciais",
            description: "Problemas lógicos simples para aquecer o cérebro.",
            content: "Resolva enigmas usando dedução simples.",
            type: "exercise"
          },
          {
            id: "m6-l2",
            title: "Raciocínio Avançado",
            description: "Problemas que exigem várias etapas.",
            content: "Etapas guiadas para solucionar problemas mais complexos.",
            type: "exercise"
          },
        ],
      },
      {
        id: "m7",
        title: "Geometria Básica",
        description: "Explore ângulos, perímetros e áreas de figuras planas.",
        ageGroups: ['10-12'],
        icon: <Apple className={iconClass} />,
        lessons: [
          {
            id: "m7-l1",
            title: "Ângulos e Tipos",
            description: "Aprenda sobre ângulos retos, agudos e obtusos.",
            content: "Vídeo explicativo e exercícios de identificação.",
            videoUrl: "https://www.youtube.com/embed/8ZK0hXp1mvM",
            type: "video"
          },
          {
            id: "m7-l2",
            title: "Perímetro e Área",
            description: "Calcule perímetro e área de figuras simples.",
            content: "Exercícios práticos com retângulos e triângulos.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Português",
    slug: "portugues",
    icon: <BookOpen className="h-12 w-12 text-purple-400" />,
    color: "purple",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "p1",
        title: "Alfabeto Animado",
        description: "Aprenda as letras do alfabeto com animações divertidas.",
        ageGroups: ['4-6'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p1-l1",
            title: "Letras e Sons",
            description: "Introdução aos sons das letras.",
            content: "Atividade: associe imagens às letras iniciais.",
            type: "exercise"
          },
          {
            id: "p1-l2",
            title: "Alfabeto Completo",
            description: "Recapitulando todas as letras.",
            content: "Jogo: arrange as letras na ordem correta.",
            type: "exercise"
          },
        ],
      },
      {
        id: "p2",
        title: "Formando Palavras",
        description: "Junte as sílabas para formar palavras simples.",
        ageGroups: ['4-6', '7-9'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p2-l1",
            title: "Sílabas Simples",
            description: "Quebre palavras em sílabas.",
            content: "Exercícios com sílabas abertas e fechadas.",
            type: "exercise"
          },
          {
            id: "p2-l2",
            title: "Montando Palavras",
            description: "Combine sílabas para formar palavras.",
            content: "Atividade interativa de montagem de palavras.",
            type: "exercise"
          },
        ],
      },
      {
        id: "p3",
        title: "Caça-Rimas",
        description: "Encontre as palavras que rimam neste jogo divertido.",
        ageGroups: ['4-6', '7-9'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p3-l1",
            title: "Rimas Básicas",
            description: "Aprenda padrões de rima.",
            content: "Jogo: escolha a palavra que rima com a dada.",
            type: "exercise"
          },
          {
            id: "p3-l2",
            title: "Crie Sua Rima",
            description: "Escreva pequenas rimas.",
            content: "Desafio criativo para escrever duas linhas que rimem.",
            type: "exercise"
          },
        ],
      },
      {
        id: "p4",
        title: "Interpretação de Texto",
        description: "Leia pequenas histórias e responda a perguntas.",
        ageGroups: ['7-9', '10-12'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p4-l1",
            title: "Compreensão Básica",
            description: "Leia um texto curto e responda perguntas.",
            content: "Exercício com perguntas de múltipla escolha sobre o texto.",
            type: "reading"
          },
          {
            id: "p4-l2",
            title: "Resumo do Texto",
            description: "Aprenda a resumir ideias principais.",
            content: "Tarefa: escreva um parágrafo resumindo o texto lido.",
            type: "exercise"
          },
        ],
      },
      {
        id: "p5",
        title: "Acentuação Correta",
        description: "Aprenda a usar acentos agudos e circunflexos.",
        ageGroups: ['7-9', '10-12'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p5-l1",
            title: "Acentos e Regras",
            description: "Regras básicas de acentuação.",
            content: "Exemplos e exercícios de acentuação.",
            type: "exercise"
          },
          {
            id: "p5-l2",
            title: "Exercícios Práticos",
            description: "Aplique as regras em palavras reais.",
            content: "Quiz interativo com palavras para acentuar.",
            type: "exercise"
          },
        ],
      },
      {
        id: "p6",
        title: "Classes Gramaticais",
        description: "Identifique substantivos, adjetivos e verbos em frases.",
        ageGroups: ['10-12'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p6-l1",
            title: "Substantivos e Verbos",
            description: "Reconheça substantivos e verbos em frases.",
            content: "Atividade de marcação em frases.",
            type: "exercise"
          },
          {
            id: "p6-l2",
            title: "Adjetivos e Funções",
            description: "Aprenda sobre adjetivos e seus usos.",
            content: "Exercícios para transformar substantivos com adjetivos.",
            type: "exercise"
          },
        ],
      },
      {
        id: "p7",
        title: "Produção de Texto",
        description: "Crie suas próprias histórias a partir de temas sugeridos.",
        ageGroups: ['10-12'],
        icon: <BookOpen className={iconClass} />,
        lessons: [
          {
            id: "p7-l1",
            title: "Planejando a História",
            description: "Estruture início, meio e fim.",
            content: "Guia para criar uma história curta.",
            type: "exercise"
          },
          {
            id: "p7-l2",
            title: "Escrevendo com Emoção",
            description: "Use adjetivos e verbos para dar vida ao texto.",
            content: "Exercício prático para enriquecer descrições.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Ciências",
    slug: "ciencias",
    icon: <FlaskConical className="h-12 w-12 text-green-400" />,
    color: "green",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "c1",
        title: "Corpo Humano",
        description: "Explore os principais órgãos e sistemas do corpo.",
        ageGroups: ['7-9', '10-12'],
        icon: <FlaskConical className={iconClass} />,
        lessons: [
          {
            id: "c1-l1",
            title: "Sistema Digestório",
            description: "Como os alimentos são processados no corpo.",
            content: "Leitura guiada com imagens do processo digestivo.",
            type: "reading"
          },
          {
            id: "c1-l2",
            title: "Cuidados com o Corpo",
            description: "Higiene e hábitos saudáveis.",
            content: "Checklist prático para o dia a dia.",
            type: "exercise"
          },
        ],
      },
      {
        id: "c2",
        title: "Ciclo da Água",
        description: "Aprenda sobre evaporação, condensação e precipitação.",
        ageGroups: ['7-9'],
        icon: <FlaskConical className={iconClass} />,
        lessons: [
          {
            id: "c2-l1",
            title: "Fases do Ciclo",
            description: "Entenda cada etapa do ciclo da água.",
            content: "Animação explicativa e perguntas de fixação.",
            videoUrl: "https://www.youtube.com/embed/8QKX2wQf_0k",
            type: "video"
          },
          {
            id: "c2-l2",
            title: "Experimento Simples",
            description: "Reproduza o ciclo da água em casa.",
            content: "Passo a passo para criar um mini ciclo em um pote.",
            type: "exercise"
          },
        ],
      },
      {
        id: "c3",
        title: "Sistema Solar",
        description: "Viaje pelos planetas do nosso sistema solar.",
        ageGroups: ['7-9', '10-12'],
        icon: <FlaskConical className={iconClass} />,
        lessons: [
          {
            id: "c3-l1",
            title: "Planetas e Características",
            description: "Conheça os planetas e suas principais características.",
            content: "Cartões de referência para cada planeta.",
            type: "reading"
          },
          {
            id: "c3-l2",
            title: "Ordem dos Planetas",
            description: "Aprenda a ordem correta dos planetas.",
            content: "Jogo de ordenação por distância do Sol.",
            type: "exercise"
          },
        ],
      },
      {
        id: "c4",
        title: "Cadeia Alimentar",
        description: "Descubra quem come quem no reino animal.",
        ageGroups: ['7-9', '10-12'],
        icon: <FlaskConical className={iconClass} />,
        lessons: [
          {
            id: "c4-l1",
            title: "Produtores e Consumidores",
            description: "Entenda diferentes papéis na cadeia alimentar.",
            content: "Atividade interativa para identificar papéis.",
            type: "exercise"
          },
          {
            id: "c4-l2",
            title: "Ecossistemas Locais",
            description: "Estude cadeias alimentares perto de você.",
            content: "Tarefa de observação e registro.",
            type: "exercise"
          },
        ],
      },
      {
        id: "c5",
        title: "Genética Básica",
        description: "Entenda os conceitos de DNA e hereditariedade.",
        ageGroups: ['10-12'],
        icon: <FlaskConical className={iconClass} />,
        lessons: [
          {
            id: "c5-l1",
            title: "O que é DNA?",
            description: "Introdução ao DNA e seus componentes.",
            content: "Vídeo e resumo com vocabulário-chave.",
            videoUrl: "https://www.youtube.com/embed/2X6q8bXbQ1I",
            type: "video"
          },
          {
            id: "c5-l2",
            title: "Características Herdadas",
            description: "Como traços são passados entre gerações.",
            content: "Atividade: observar familiares e listar traços comuns.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "História",
    slug: "historia",
    icon: <Landmark className="h-12 w-12 text-orange-400" />,
    color: "orange",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "h1",
        title: "Descobrimento do Brasil",
        description: "Conheça a chegada dos portugueses ao Brasil.",
        ageGroups: ['7-9', '10-12'],
        icon: <Landmark className={iconClass} />,
        lessons: [
          {
            id: "h1-l1",
            title: "Contexto Histórico",
            description: "Quem estava no Brasil antes da chegada dos portugueses?",
            content: "Leitura e mapa com povos indígenas e suas culturas.",
            type: "reading"
          },
          {
            id: "h1-l2",
            title: "A Chegada",
            description: "O que aconteceu durante a chegada em 1500?",
            content: "Linha do tempo com eventos principais.",
            type: "exercise"
          },
        ],
      },
      {
        id: "h2",
        title: "Egito Antigo",
        description: "Explore as pirâmides, faraós e a vida no Nilo.",
        ageGroups: ['7-9', '10-12'],
        icon: <Landmark className={iconClass} />,
        lessons: [
          {
            id: "h2-l1",
            title: "Faraós e Pirâmides",
            description: "Quem eram os faraós e por que construíam pirâmides?",
            content: "Vídeo curto e diagrama da pirâmide social.",
            videoUrl: "https://www.youtube.com/embed/3W-0YfS0bqg",
            type: "video"
          },
          {
            id: "h2-l2",
            title: "Vida no Nilo",
            description: "Como o rio influenciava a agricultura e a vida diária.",
            content: "Atividade: associe produtos agrícolas às estações do Nilo.",
            type: "exercise"
          },
        ],
      },
      {
        id: "h3",
        title: "Grécia Antiga",
        description: "Aprenda sobre os deuses, heróis e filósofos gregos.",
        ageGroups: ['10-12'],
        icon: <Landmark className={iconClass} />,
        lessons: [
          {
            id: "h3-l1",
            title: "Mitologia Grega",
            description: "Conheça alguns deuses e mitos famosos.",
            content: "Leitura com contos resumidos e perguntas de interpretação.",
            type: "reading"
          },
          {
            id: "h3-l2",
            title: "Filosofia Básica",
            description: "Introdução a Sócrates, Platão e Aristóteles.",
            content: "Resumo dos principais conceitos e atividades de reflexão.",
            type: "exercise"
          },
        ],
      },
      {
        id: "h4",
        title: "Revolução Industrial",
        description: "Entenda a mudança das máquinas e fábricas.",
        ageGroups: ['10-12'],
        icon: <Landmark className={iconClass} />,
        lessons: [
          {
            id: "h4-l1",
            title: "Máquinas e Fábricas",
            description: "Como a indústria mudou a sociedade.",
            content: "Vídeo e cronologia dos avanços tecnológicos.",
            videoUrl: "https://www.youtube.com/embed/4aP0t3q3hP8",
            type: "video"
          },
          {
            id: "h4-l2",
            title: "Vida dos Trabalhadores",
            description: "Condições de trabalho e mudanças sociais.",
            content: "Atividade de comparação entre épocas.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Geografia",
    slug: "geografia",
    icon: <Globe className="h-12 w-12 text-teal-400" />,
    color: "teal",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "g1",
        title: "Capitais do Brasil",
        description: "Teste seus conhecimentos sobre as capitais brasileiras.",
        ageGroups: ['7-9', '10-12'],
        icon: <Globe className={iconClass} />,
        lessons: [
          {
            id: "g1-l1",
            title: "Mapa do Brasil",
            description: "Localize os estados e capitais no mapa.",
            content: "Atividade interativa de mapeamento.",
            type: "exercise"
          },
          {
            id: "g1-l2",
            title: "Cidades Importantes",
            description: "Conheça cidades-chave e suas características.",
            content: "Leitura e curiosidades sobre cada capital.",
            type: "reading"
          },
        ],
      },
      {
        id: "g2",
        title: "Biomas Brasileiros",
        description: "Conheça a Amazônia, o Cerrado, a Mata Atlântica e mais.",
        ageGroups: ['7-9', '10-12'],
        icon: <Globe className={iconClass} />,
        lessons: [
          {
            id: "g2-l1",
            title: "Principais Biomas",
            description: "Características e fauna de cada bioma.",
            content: "Vídeo e imagens para identificar biomas.",
            videoUrl: "https://www.youtube.com/embed/6b5yqWlJU7E",
            type: "video"
          },
          {
            id: "g2-l2",
            title: "Preservação Ambiental",
            description: "Importância da conservação dos biomas.",
            content: "Atividade: listar ações para proteger cada bioma.",
            type: "exercise"
          },
        ],
      },
      {
        id: "g3",
        title: "Continentes e Oceanos",
        description: "Navegue pelo mapa-múndi e aprenda sobre o planeta.",
        ageGroups: ['7-9', '10-12'],
        icon: <Globe className={iconClass} />,
        lessons: [
          {
            id: "g3-l1",
            title: "Nomeie os Continentes",
            description: "Localize continentes e oceanos.",
            content: "Exercício de correspondência entre nomes e regiões.",
            type: "exercise"
          },
          {
            id: "g3-l2",
            title: "Características Regionais",
            description: "Climas e paisagens dos continentes.",
            content: "Leitura com exemplos reais de cada continente.",
            type: "reading"
          },
        ],
      },
      {
        id: "g4",
        title: "Relevo e Clima",
        description: "Entenda como as montanhas e o clima moldam o mundo.",
        ageGroups: ['10-12'],
        icon: <Globe className={iconClass} />,
        lessons: [
          {
            id: "g4-l1",
            title: "Formas de Relevo",
            description: "Montanhas, planaltos, planícies e vales.",
            content: "Ilustrações e descrições das formas de relevo.",
            type: "reading"
          },
          {
            id: "g4-l2",
            title: "Fatores Climáticos",
            description: "O que influencia o clima de uma região?",
            content: "Atividade com análise de mapas climáticos.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Inglês",
    slug: "ingles",
    icon: <SpellCheck className="h-12 w-12 text-indigo-400" />,
    color: "indigo",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "i1",
        title: "Colors and Numbers",
        description: "Aprenda as cores e os números em inglês.",
        ageGroups: ['7-9'],
        icon: <SpellCheck className={iconClass} />,
        lessons: [
          {
            id: "i1-l1",
            title: "Cores em Inglês",
            description: "Nomes das cores e como usá-las em frases.",
            content: "Atividade com cartões de cores e pronúncia.",
            type: "exercise"
          },
          {
            id: "i1-l2",
            title: "Números Básicos",
            description: "Contando e dizendo números em inglês.",
            content: "Vídeo curto e prática de contagem.",
            videoUrl: "https://www.youtube.com/embed/d3LLHe2fM0w",
            type: "video"
          },
        ],
      },
      {
        id: "i2",
        title: "Animals Vocabulary",
        description: "Descubra o nome dos animais em inglês.",
        ageGroups: ['7-9', '10-12'],
        icon: <SpellCheck className={iconClass} />,
        lessons: [
          {
            id: "i2-l1",
            title: "Animais Comuns",
            description: "Nomes e sons de animais em inglês.",
            content: "Cartões com imagens e palavras para memorizar.",
            type: "exercise"
          },
          {
            id: "i2-l2",
            title: "Descrevendo Animais",
            description: "Use adjetivos simples para descrever animais.",
            content: "Atividade de escrita curta em inglês.",
            type: "exercise"
          },
        ],
      },
      {
        id: "i3",
        title: "Simple Present",
        description: "Forme frases no presente simples.",
        ageGroups: ['10-12'],
        icon: <SpellCheck className={iconClass} />,
        lessons: [
          {
            id: "i3-l1",
            title: "Estrutura do Presente Simples",
            description: "Sujeito + verbo no presente.",
            content: "Exemplos e exercícios com verbos regulares.",
            type: "reading"
          },
          {
            id: "i3-l2",
            title: "Perguntas e Respostas",
            description: "Formando perguntas no presente simples.",
            content: "Prática com perguntas curtas e respostas.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Lógica",
    slug: "logica",
    icon: <Brain className="h-12 w-12 text-yellow-400" />,
    color: "yellow",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "l1",
        title: "Sequência Lógica",
        description: "Complete as sequências de formas e cores.",
        ageGroups: ['4-6', '7-9'],
        icon: <Brain className={iconClass} />,
        lessons: [
          {
            id: "l1-l1",
            title: "Sequências Simples",
            description: "Identifique padrões simples.",
            content: "Exercícios com sequência de cores e formas.",
            type: "exercise"
          },
          {
            id: "l1-l2",
            title: "Padrões Complexos",
            description: "Sequências com mais de um critério.",
            content: "Desafios para raciocínio lógico.",
            type: "exercise"
          },
        ],
      },
      {
        id: "l2",
        title: "Sudoku para Crianças",
        description: "Resolva sudokus simples com números ou figuras.",
        ageGroups: ['7-9', '10-12'],
        icon: <Brain className={iconClass} />,
        lessons: [
          {
            id: "l2-l1",
            title: "Sudoku 4x4",
            description: "Comece com grades pequenas.",
            content: "Quebra-cabeças guiados para iniciantes.",
            type: "exercise"
          },
          {
            id: "l2-l2",
            title: "Estratégias",
            description: "Dicas para resolver mais rápido.",
            content: "Técnicas simples para eliminar opções.",
            type: "reading"
          },
        ],
      },
      {
        id: "l3",
        title: "Charadas e Enigmas",
        description: "Teste seu raciocínio com enigmas desafiadores.",
        ageGroups: ['10-12'],
        icon: <Brain className={iconClass} />,
        lessons: [
          {
            id: "l3-l1",
            title: "Enigmas Clássicos",
            description: "Resolva charadas famosas.",
            content: "Lista de enigmas com pistas progressivas.",
            type: "exercise"
          },
          {
            id: "l3-l2",
            title: "Criando Enigmas",
            description: "Crie suas próprias charadas para amigos.",
            content: "Atividade criativa para inventar enigmas.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Artes",
    slug: "artes",
    icon: <Palette className="h-12 w-12 text-red-400" />,
    color: "red",
    ageGroups: ['4-6', '7-9'],
    activities: [
      {
        id: "a1",
        title: "Pintura Digital",
        description: "Use cores e pincéis para criar sua obra de arte.",
        ageGroups: ['4-6', '7-9'],
        icon: <Palette className={iconClass} />,
        lessons: [
          {
            id: "a1-l1",
            title: "Ferramentas Básicas",
            description: "Conheça pinceis e cores na tela.",
            content: "Tutorial básico sobre ferramentas digitais.",
            type: "reading"
          },
          {
            id: "a1-l2",
            title: "Crie um Personagem",
            description: "Desenhe e pinte um personagem simples.",
            content: "Exercício passo a passo para criar um personagem.",
            type: "exercise"
          },
        ],
      },
      {
        id: "a2",
        title: "Misturando Cores",
        description: "Descubra o que acontece quando misturamos as cores primárias.",
        ageGroups: ['4-6', '7-9'],
        icon: <Palette className={iconClass} />,
        lessons: [
          {
            id: "a2-l1",
            title: "Cores Primárias",
            description: "O que são cores primárias?",
            content: "Atividade com mistura de cores para criar novas cores.",
            type: "exercise"
          },
          {
            id: "a2-l2",
            title: "Tons e Sombras",
            description: "Como criar profundidade com sombras.",
            content: "Exercícios práticos para sombrear objetos simples.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Música",
    slug: "musica",
    icon: <Music className="h-12 w-12 text-pink-400" />,
    color: "pink",
    ageGroups: ['4-6', '7-9'],
    activities: [
      {
        id: "mu1",
        title: "Sons dos Instrumentos",
        description: "Ouça e adivinhe qual instrumento está tocando.",
        ageGroups: ['4-6', '7-9'],
        icon: <Music className={iconClass} />,
        lessons: [
          {
            id: "mu1-l1",
            title: "Identificando Instrumentos",
            description: "Ouça sons e associe ao instrumento.",
            content: "Atividade auditiva para identificação.",
            type: "exercise"
          },
          {
            id: "mu1-l2",
            title: "Famílias de Instrumentos",
            description: "Cordas, sopros, percussão e teclas.",
            content: "Leitura com exemplos sonoros.",
            type: "reading"
          },
        ],
      },
      {
        id: "mu2",
        title: "Ritmo Divertido",
        description: "Acompanhe as batidas e crie seus próprios ritmos.",
        ageGroups: ['4-6', '7-9'],
        icon: <Music className={iconClass} />,
        lessons: [
          {
            id: "mu2-l1",
            title: "Batidas Simples",
            description: "Marque o tempo com palmas.",
            content: "Exercícios de ritmo com clapping patterns.",
            type: "exercise"
          },
          {
            id: "mu2-l2",
            title: "Criando Ritmos",
            description: "Combine sons para criar pequenos ritmos.",
            content: "Atividade criativa de composição rítmica.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Programação",
    slug: "programacao",
    icon: <Code className="h-12 w-12 text-slate-400" />,
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "pr1",
        title: "Lógica de Blocos",
        description: "Aprenda os fundamentos da programação com blocos visuais.",
        ageGroups: ['10-12'],
        icon: <Code className={iconClass} />,
        lessons: [
          {
            id: "pr1-l1",
            title: "Sequência de Comandos",
            description: "Entenda ordem de execução e instruções.",
            content: "Atividade com blocos para mover um personagem.",
            type: "exercise"
          },
          {
            id: "pr1-l2",
            title: "Loops e Repetição",
            description: "Use loops para repetir ações.",
            content: "Exercícios de repetição para automatizar tarefas simples.",
            type: "exercise"
          },
        ],
      },
      {
        id: "pr2",
        title: "Crie seu Primeiro Jogo",
        description: "Siga o passo a passo para criar um jogo simples.",
        ageGroups: ['10-12'],
        icon: <Code className={iconClass} />,
        lessons: [
          {
            id: "pr2-l1",
            title: "Planejamento do Jogo",
            description: "Ideia, personagens e metas do jogo.",
            content: "Guia de planejamento e design básico.",
            type: "reading"
          },
          {
            id: "pr2-l2",
            title: "Construindo Níveis",
            description: "Crie um nível simples com obstáculos.",
            content: "Atividade prática: montar um nível interativo.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Robótica",
    slug: "robotica",
    icon: <Bot className="h-12 w-12 text-rose-400" />,
    color: "rose",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "r1",
        title: "Monte seu Robô Virtual",
        description: "Escolha as peças e monte um robô em um ambiente 3D.",
        ageGroups: ['10-12'],
        icon: <Bot className={iconClass} />,
        lessons: [
          {
            id: "r1-l1",
            title: "Peças e Funções",
            description: "Conheça sensores, motores e estruturas.",
            content: "Leitura detalhada sobre peças básicas.",
            type: "reading"
          },
          {
            id: "r1-l2",
            title: "Montagem Básica",
            description: "Monte uma estrutura simples.",
            content: "Atividade prática passo a passo.",
            type: "exercise"
          },
        ],
      },
      {
        id: "r2",
        title: "Programando o Robô",
        description: "Dê comandos para seu robô completar missões.",
        ageGroups: ['10-12'],
        icon: <Bot className={iconClass} />,
        lessons: [
          {
            id: "r2-l1",
            title: "Comandos Básicos",
            description: "Movimento, sensores e respostas.",
            content: "Exercício de programação por blocos.",
            type: "exercise"
          },
          {
            id: "r2-l2",
            title: "Missão Guiada",
            description: "Programe o robô para completar uma missão simples.",
            content: "Desafio prático com verificação automática.",
            type: "exercise"
          },
        ],
      },
    ],
  },
  {
    name: "Finanças",
    slug: "financas",
    icon: <PiggyBank className="h-12 w-12 text-lime-400" />,
    color: "lime",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "f1",
        title: "Jogo da Mesada",
        description: "Aprenda a administrar sua mesada e a poupar.",
        ageGroups: ['10-12'],
        icon: <PiggyBank className={iconClass} />,
        lessons: [
          {
            id: "f1-l1",
            title: "Orçamento Simples",
            description: "Entenda renda e despesas básicas.",
            content: "Exercício de planejamento do uso da mesada.",
            type: "exercise"
          },
          {
            id: "f1-l2",
            title: "Poupança e Metas",
            description: "Aprenda a poupar para objetivos.",
            content: "Atividade: definir uma meta e montar plano de poupança.",
            type: "exercise"
          },
        ],
      },
      {
        id: "f2",
        title: "Consumo Consciente",
        description: "Entenda a diferença entre querer e precisar.",
        ageGroups: ['10-12'],
        icon: <PiggyBank className={iconClass} />,
        lessons: [
          {
            id: "f2-l1",
            title: "Necessidades x Desejos",
            description: "Aprenda a distinguir os conceitos.",
            content: "Exercício com exemplos do cotidiano.",
            type: "reading"
          },
          {
            id: "f2-l2",
            title: "Escolhas Inteligentes",
            description: "Como tomar decisões de consumo responsáveis.",
            content: "Atividade prática com comparação de opções.",
            type: "exercise"
          },
        ],
      },
    ],
  },
];