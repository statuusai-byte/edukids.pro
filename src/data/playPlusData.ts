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

export const playPlusGames: PlayPlusGame[] = [
  {
    id: "memory-match",
    title: "Memória Cósmica",
    tagline: "Desvende constelações em partidas relâmpago",
    description:
      "Encontre os pares de planetas e constelações antes que o tempo acabe. Ideal para exercitar memória e atenção em partidas rápiddas.",
    premium: false,
    difficulty: "Iniciante",
    estimatedTime: "5 min",
    ageGroups: ["4-6", "7-9", "10-12"],
    component: "memory-match",
    coverImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Testado por pais e pedagogos",
      "Feedback animado e reforço positivo",
      "Modo turbo para acelerar desafios",
    ],
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
    ageGroups: ["4-6", "7-9", "10-12"],
    component: "mission-math",
    coverImage:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Operações adaptativas em tempo real",
      "Sistema de combos com medalhas digitais",
      "Resumo de desempenho ao final da missão",
    ],
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
    ageGroups: ["4-6", "7-9", "10-12"],
    component: "contando-frutas",
    coverImage:
      "https://images.unsplash.com/photo-1613745726940-ef06ded97b18?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Variações infinitas de combinação",
      "Reforço de contagem com animações suaves",
      "Controle de tempo opcional para prática livre",
    ],
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
    ageGroups: ["4-6", "7-9", "10-12"],
    component: "formando-palavras",
    coverImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Banco de palavras revisado por fonoaudiólogos",
      "Trilhas de progressão com feedback instantâneo",
      "Modo revisão para reforçar sílabas desafiadoras",
    ],
    recommended: false,
  },
];

export const highlightedGameIds: ReadonlyArray<PlayPlusGame["id"]> = ["mission-math", "memory-match"];

export type PlayPlusCatalogSummary = {
  totalGames: number;
  totalPremium: number;
  totalFree: number;
  recommended: number;
};

export const buildCatalogSummary = (ageGroup: AgeGroup | null): PlayPlusCatalogSummary => {
  const filteredGames = playPlusGames.filter(
    (game) => !ageGroup || game.ageGroups.includes(ageGroup),
  );

  const totalPremium = filteredGames.filter((game) => game.premium).length;
  const recommended = filteredGames.filter((game) => game.recommended).length;

  return {
    totalGames: filteredGames.length,
    totalPremium,
    totalFree: filteredGames.length - totalPremium,
    recommended,
  };
};