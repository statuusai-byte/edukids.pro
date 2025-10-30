export type Course = {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  imageUrl: string;
  ageGroups: ('4-6' | '7-9' | '10-12')[];
  description: string;
  videoUrl?: string;
  premium: boolean;
  recommended?: boolean;
};

export const allCourses: Course[] = [
  {
    id: "ingles-para-criancas",
    title: "Inglês para Crianças: Cores e Animais",
    instructor: "English Singsing",
    duration: "11m",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9'],
    description: "Uma aula divertida e animada para aprender as cores e os nomes dos animais em inglês. Perfeito para os primeiros passos no idioma!",
    videoUrl: "https://vimeo.com/291000000", // Changed to Vimeo
    premium: false,
    recommended: true
  },
  {
    id: "violao-para-iniciantes",
    title: "Violão para Crianças: Aula 1",
    instructor: "Cordas e Música",
    duration: "15m",
    imageUrl: "https://images.unsplash.com/photo-1558020245-70c1a53218a9?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "A primeira aula de violão para crianças! Aprenda as partes do violão, a postura correta e os primeiros exercícios para começar a tocar.",
    videoUrl: "https://vimeo.com/302000000", // Changed to Vimeo
    premium: true,
    recommended: true
  },
  {
    id: "desenho-e-pintura-digital",
    title: "Como Desenhar no Computador",
    instructor: "Ivan Querino",
    duration: "17m",
    imageUrl: "https://images.unsplash.com/photo-1589150306321-458c3d39c37a?q=80&w=1974&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Um guia completo para iniciantes sobre como começar a desenhar digitalmente usando uma mesa digitalizadora e softwares gratuitos.",
    videoUrl: "https://vimeo.com/313000000", // Changed to Vimeo
    premium: true,
    recommended: false
  },
  {
    id: "pequenos-cientistas",
    title: "Experiência de Ciências Divertida",
    instructor: "O Diário de Mika",
    duration: "8m",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9'],
    description: "Aprenda a fazer experiências científicas divertidas e seguras com materiais que você tem em casa.",
    videoUrl: "https://vimeo.com/324000000", // Changed to Vimeo
    premium: false,
    recommended: true
  },
  {
    id: "robotica-com-lego",
    title: "Introdução à Robótica com LEGO",
    instructor: "Super Cérebro",
    duration: "3m",
    imageUrl: "https://images.unsplash.com/photo-1678922619217-061b7a23b0e1?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Descubra o que é a robótica e como as aulas com peças de LEGO podem ser divertidas e educativas, ensinando conceitos de engenharia e programação.",
    videoUrl: "https://vimeo.com/335000000", // Changed to Vimeo
    premium: true,
    recommended: true
  },
  {
    id: "teclado-magico",
    title: "Aula de Teclado para Crianças",
    instructor: "Descomplicando a Música",
    duration: "10m",
    imageUrl: "https://images.unsplash.com/photo-1612021459339-39989c23165a?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9', '10-12'],
    description: "Uma aula de teclado super fácil para crianças, ensinando a primeira música de forma simples e divertida, mesmo para quem nunca tocou.",
    videoUrl: "https://vimeo.com/346000000", // Changed to Vimeo
    premium: false,
    recommended: false
  },
  {
    id: "matematica-fundamental-1",
    title: "Matemática: Adição e Subtração",
    instructor: "Professora Simone",
    duration: "13m",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9'],
    description: "Aprenda os conceitos básicos de adição e subtração de uma forma clara e visual, com exemplos práticos para fixar o conteúdo.",
    videoUrl: "https://vimeo.com/357000000", // Changed to Vimeo
    premium: false,
    recommended: true
  },
  {
    id: "matematica-fundamental-2",
    title: "O que são as Frações?",
    instructor: "Khan Academy",
    duration: "4m",
    imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702f?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Uma explicação animada e simples sobre o que são as frações, como elas representam partes de um todo e como lemos cada uma delas.",
    videoUrl: "https://vimeo.com/368000000", // Changed to Vimeo
    premium: true,
    recommended: false
  },
  {
    id: "portugues-leitura",
    title: "Interpretação de Texto para Crianças",
    instructor: "Língua Portuguesa para todos",
    duration: "10m",
    imageUrl: "https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Dicas valiosas para ajudar as crianças a melhorarem a interpretação de textos, com exemplos práticos de como entender melhor o que se lê.",
    videoUrl: "https://vimeo.com/379000000", // Changed to Vimeo
    premium: false,
    recommended: true
  },
  {
    id: "portugues-escrita",
    title: "Como Criar uma História (Produção de Texto)",
    instructor: "Canal da Criança",
    duration: "4m",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Aprenda os elementos essenciais para criar uma boa história: personagens, tempo, lugar e enredo. Ideal para estimular a criatividade na escrita.",
    videoUrl: "https://vimeo.com/380000000", // Changed to Vimeo
    premium: true,
    recommended: false
  },
  {
    id: "ciencias-planta-e-animal",
    title: "Ciências: Ecossistemas",
    instructor: "Smile and Learn",
    duration: "6m",
    imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9'],
    description: "Uma forma divertida de aprender sobre os diferentes ecossistemas e a importância de cada ser vivo para o equilíbrio do planeta.",
    videoUrl: "https://vimeo.com/391000000", // Changed to Vimeo
    premium: false,
    recommended: false
  },
  {
    id: "historia-brasil",
    title: "A História do Brasil para Crianças",
    instructor: "Quintal da Cultura",
    duration: "6m",
    imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Um resumo animado sobre a história do Brasil, desde a chegada dos portugueses até os dias de hoje, de forma simples e educativa.",
    videoUrl: "https://vimeo.com/402000000", // Changed to Vimeo
    premium: false,
    recommended: false
  },
  {
    id: "geografia-mapas",
    title: "Aprendendo sobre Mapas",
    instructor: "Geografia Irada",
    duration: "2m",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "O que são mapas e para que servem? Aprenda sobre os elementos de um mapa, como título, legenda e escala, de uma maneira rápida e fácil.",
    videoUrl: "https://vimeo.com/413000000", // Changed to Vimeo
    premium: false,
    recommended: false
  },
  {
    id: "artes-desenho",
    title: "Como Desenhar um Cachorro (Fácil)",
    instructor: "Vamos Desenhar",
    duration: "4m",
    imageUrl: "https://images.unsplash.com/photo-1496317556649-f930d733eea2?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9'],
    description: "Um tutorial passo a passo para desenhar um cachorro fofinho. Perfeito para crianças que estão começando a se aventurar no mundo do desenho.",
    videoUrl: "https://vimeo.com/424000000", // Changed to Vimeo
    premium: true,
    recommended: true
  },
  {
    id: "musica-ritmo",
    title: "Aula de Ritmo com Copos",
    instructor: "Música e Movimento",
    duration: "10m",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9'],
    description: "Uma atividade musical super divertida para desenvolver o ritmo e a coordenação motora usando apenas copos. Cante e toque junto!",
    videoUrl: "https://vimeo.com/435000000", // Changed to Vimeo
    premium: false,
    recommended: false
  },
  {
    id: "programacao-inicial",
    title: "Lógica de Programação para Crianças",
    instructor: "Alura",
    duration: "3m",
    imageUrl: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Entenda o que é lógica de programação e por que ela é tão importante, não apenas para criar jogos, mas para resolver problemas do dia a dia.",
    videoUrl: "https://vimeo.com/446000000", // Changed to Vimeo
    premium: true,
    recommended: false
  },
  {
    id: "educacao-financeira",
    title: "Educação Financeira para Crianças",
    instructor: "Turma da Mônica",
    duration: "6m",
    imageUrl: "https://images.unsplash.com/photo-1520975913231-4d8f72f8a0a3?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Aprenda sobre a importância de poupar e como o dinheiro funciona de uma maneira divertida com a Turma da Mônica.",
    videoUrl: "https://vimeo.com/457000000", // Changed to Vimeo
    premium: false,
    recommended: true
  }
];