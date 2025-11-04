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
  component: "memory-match" | "mission-math";
  coverImage: string;
  features: string[];
  recommended: boolean;
};

export const playPlusGames: PlayPlusGame[] = [
  {
    id: "memory-match",
    title: "Jogo da Memória",
    tagline: "Encontre os pares e treine sua mente",
    description:
      "Um clássico divertido para todas as idades. Vire as cartas, memorize as posições e encontre todos os pares de ícones o mais rápido possível. Ótimo para a memória e concentração.",
    premium: false,
    difficulty: "Iniciante",
    estimatedTime: "5 min",
    ageGroups: ["4-6", "7-9", "10-12"],
    component: "memory-match",
    coverImage:
      "https://images.unsplash.com/photo-1584931423298-c576fda548c0?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Desenvolve a memória visual",
      "Ícones coloridos e divertidos",
      "Partidas rápidas e relaxantes",
    ],
    recommended: true,
  },
  {
    id: "mission-math",
    title: "Missão Matemática",
    tagline: "Desafio de agilidade e cálculo",
    description:
      "Corra contra o tempo para resolver o máximo de problemas de matemática! Cada resposta correta adiciona segundos preciosos ao relógio. Perfeito para praticar o cálculo mental.",
    premium: true,
    difficulty: "Intermediário",
    estimatedTime: "3 min",
    ageGroups: ["7-9", "10-12"],
    component: "mission-math",
    coverImage:
      "https://images.unsplash.com/photo-1524995767962-b6246ac15514?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Problemas adaptados por idade",
      "Estimula o raciocínio rápido",
      "Competição saudável contra o relógio",
    ],
    recommended: true,
  },
];

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