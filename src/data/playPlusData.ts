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
  component: "tic-tac-toe" | "hangman";
  coverImage: string;
  features: string[];
  recommended: boolean;
};

export const playPlusGames: PlayPlusGame[] = [
  {
    id: "tic-tac-toe",
    title: "Jogo da Velha",
    tagline: "O clássico desafio de estratégia",
    description:
      "Desafie um amigo ou a si mesmo neste jogo atemporal. Perfeito para desenvolver o raciocínio lógico e a capacidade de prever movimentos.",
    premium: false,
    difficulty: "Iniciante",
    estimatedTime: "3 min",
    ageGroups: ["4-6", "7-9", "10-12"],
    component: "tic-tac-toe",
    coverImage:
      "https://images.unsplash.com/photo-1584931423298-c576fda548c0?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Interface limpa e intuitiva",
      "Partidas rápidas e divertidas",
      "Ideal para todas as idades",
    ],
    recommended: true,
  },
  {
    id: "hangman",
    title: "Jogo da Forca",
    tagline: "Adivinhe a palavra secreta",
    description:
      "Teste seu vocabulário e suas habilidades de dedução. Adivinhe as letras para revelar a palavra oculta antes que seja tarde demais!",
    premium: true,
    difficulty: "Intermediário",
    estimatedTime: "5 min",
    ageGroups: ["7-9", "10-12"],
    component: "hangman",
    coverImage:
      "https://images.unsplash.com/photo-1524995767962-b6246ac15514?q=80&w=1600&auto=format&fit=crop",
    features: [
      "Banco de palavras educativo",
      "Fortalece a ortografia",
      "Desafio de lógica e vocabulário",
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