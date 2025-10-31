export type AgeGroup = "4-6" | "7-9" | "10-12";

export type PlayPlusGame = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  premium: boolean;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  estimatedTime: string;
  ageGroups: AgeGroup[];
  component: "memory-match" | "mission-math" | "contando-frutas" | "formando-palavras";
  coverImage: string;
  features: string[];
  recommended: boolean;
};

export type PlayPlusVideo = {
  id: string;
  title: string;
  description: string;
  duration: string;
  premium: boolean;
  ageGroups: AgeGroup[];
  url: string;
  channel: string;
  tags: string[];
  thumbnail: string;
  recommended: boolean;
};

export const playPlusGames: PlayPlusGame[] = [
  {
    id: "memory-match",
    title: "Memória Cósmica",
    tagline: "Desvende constelações em partidas relâmpago",
    description:
      "Encontre os pares de planetas e constelações antes que o tempo acabe. Ideal para exercitar memória e atenção em partidas rápidas.",
    premium: false,
    difficulty: "Iniciante",
    estimatedTime: "5 min",
    ageGroups: ["4-6", "7-9"],
    component: "memory-match",
    coverImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    features: ["Modo rápido", "Feedback animado", "Treino de memória visual"],
    recommended: true,
  },
  {
    id: "mission-math",
    title: "Missão Matemática",
    tagline: "Resolva equações antes que o foguete decole",
    description:
      "Avance por fases com operações que se adaptam à idade. Ganhe combos, veja o placar em tempo real e fortaleça raciocínio lógico.",
    premium: true,
    difficulty: "Intermediário",
    estimatedTime: "8 min",
    ageGroups: ["7-9", "10-12"],
    component: "mission-math",
    coverImage:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1600&auto=format&fit=crop",
    features: ["Operações adaptativas", "Sistema de combos", "Resumo de desempenho"],
    recommended: true,
  },
  {
    id: "contando-frutas",
    title: "Contando Frutas",
    tagline: "Matemática saborosa para iniciar a jornada",
    description:
      "Fortaleça contagem, comparação e atenção visual em uma experiência lúdica com frutas animadas. Cada rodada gera um desafio diferente.",
    premium: false,
    difficulty: "Iniciante",
    estimatedTime: "4 min",
    ageGroups: ["4-6"],
    component: "contando-frutas",
    coverImage:
      "https://images.unsplash.com/photo-1613745726940-ef06ded97b18?q=80&w=1600&auto=format&fit=crop",
    features: ["Variações infinitas", "Reforço de contagem", "Feedback positivo"],
    recommended: false,
  },
  {
    id: "formando-palavras",
    title: "Formando Palavras",
    tagline: "Monte sílabas e desbloqueie vocabulário",
    description:
      "Combine sílabas, descubra palavras secretas e fortaleça leitura com apoio visual. Pensado para crianças em alfabetização.",
    premium: true,
    difficulty: "Intermediário",
    estimatedTime: "6 min",
    ageGroups: ["4-6", "7-9"],
    component: "formando-palavras",
    coverImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
    features: ["Construção silábica", "Vocabulário guiado", "Recomeço rápido"],
    recommended: false,
  },
];

export const playPlusVideos: PlayPlusVideo[] = [
  {
    id: "science-senses",
    title: "Explorando os 5 Sentidos",
    description:
      "Uma jornada animada pelos cinco sentidos com exemplos do dia a dia. Ideal para introduzir ciência às crianças menores.",
    duration: "6 min",
    premium: false,
    ageGroups: ["4-6", "7-9"],
    url: "https://www.youtube.com/watch?v=TJmEFHTKZb4",
    channel: "Smile and Learn",
    tags: ["Ciências", "Corpo Humano", "Animado"],
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    recommended: true,
  },
  {
    id: "english-animals",
    title: "Animais em Inglês Cantando",
    description:
      "Aprenda nomes de animais em inglês com músicas contagiosas. Ótimo para fixar vocabulário com ritmo e repetição.",
    duration: "8 min",
    premium: false,
    ageGroups: ["4-6", "7-9"],
    url: "https://www.youtube.com/watch?v=pm3glTzOa8Q",
    channel: "English Singsing",
    tags: ["Inglês", "Vocabulário", "Música"],
    thumbnail:
      "https://images.unsplash.com/photo-1516637090014-cb1ab0d08fc7?q=80&w=1600&auto=format&fit=crop",
    recommended: true,
  },
  {
    id: "math-fractions",
    title: "Frações para Criativos",
    description:
      "Entenda frações com exemplos visuais e desafios práticos. Use pizzas, barras e desenhos para visualizar partes do todo.",
    duration: "9 min",
    premium: true,
    ageGroups: ["7-9", "10-12"],
    url: "https://www.youtube.com/watch?v=Y2-IsyS-YpY",
    channel: "Khan Academy Kids",
    tags: ["Matemática", "Frações", "Visual"],
    thumbnail:
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=1600&auto=format&fit=crop",
    recommended: false,
  },
  {
    id: "coding-logic",
    title: "Lógica de Programação com Histórias",
    description:
      "Use condicionais, sequências e muita criatividade para criar mini-histórias animadas. Excelente porta de entrada para programação.",
    duration: "11 min",
    premium: true,
    ageGroups: ["7-9", "10-12"],
    url: "https://www.youtube.com/watch?v=iBL_GG3q_64",
    channel: "Alura Kids",
    tags: ["Programação", "Histórias", "Criatividade"],
    thumbnail:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?q=80&w=1600&auto=format&fit=crop",
    recommended: true,
  },
  {
    id: "history-brazil",
    title: "História do Brasil em Quadrinhos",
    description:
      "Linha do tempo ilustrada que cobre descobrimento, independência e curiosidades históricas em linguagem simples.",
    duration: "7 min",
    premium: false,
    ageGroups: ["7-9", "10-12"],
    url: "https://www.youtube.com/watch?v=sFBT0oS_2-c",
    channel: "Quintal da Cultura",
    tags: ["História", "Brasil", "Quadrinhos"],
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
    recommended: false,
  },
  {
    id: "eco-heroes",
    title: "Missão Eco-Heróis",
    description:
      "Aprenda ações simples para proteger o planeta com exemplos práticos e desafios que estimulam hábitos sustentáveis.",
    duration: "5 min",
    premium: false,
    ageGroups: ["4-6", "7-9"],
    url: "https://www.youtube.com/watch?v=a-z216v-R-8",
    channel: "O Diário de Mika",
    tags: ["Ecologia", "Sustentabilidade", "Hábitos"],
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    recommended: true,
  },
];

export const highlightedGameIds: ReadonlyArray<PlayPlusGame["id"]> = ["mission-math", "memory-match"];
export const highlightedVideoIds: ReadonlyArray<PlayPlusVideo["id"]> = ["science-senses", "coding-logic"];

export type PlayPlusCatalogSummary = {
  totalExperiences: number;
  totalPremium: number;
  totalFree: number;
  recommended: number;
};

export const buildCatalogSummary = (ageGroup: AgeGroup | null): PlayPlusCatalogSummary => {
  const filteredGames = playPlusGames.filter((game) => !ageGroup || game.ageGroups.includes(ageGroup));
  const filteredVideos = playPlusVideos.filter(
    (video) => !ageGroup || video.ageGroups.includes(ageGroup),
  );

  const catalog = [...filteredGames, ...filteredVideos];
  const totalPremium = catalog.filter((item) => item.premium).length;
  const recommended = catalog.filter((item) => item.recommended).length;

  return {
    totalExperiences: catalog.length,
    totalPremium,
    totalFree: catalog.length - totalPremium,
    recommended,
  };
};

export const isGamePlayableNow = (component: PlayPlusGame["component"]) => {
  return component === "contando-frutas" || component === "formando-palavras";
};