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
    title: "Inglês para Crianças: Primeiros Passos",
    instructor: "Teacher Liza (Especialista em Bilinguismo Infantil)",
    duration: "3h 45m",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9', '10-12'],
    description: "Um curso interativo e imersivo que utiliza a abordagem TPR (Total Physical Response). Seu filho aprenderá vocabulário essencial (cores, números, animais, família) através de músicas cativantes, jogos de repetição e atividades lúdicas, construindo uma base sólida para a fluência futura.",
    videoUrl: "https://www.youtube.com/embed/hdhQk_DBp-E",
    premium: false,
    recommended: true
  },
  {
    id: "violao-para-iniciantes",
    title: "Violão Kids: Despertando o Músico",
    instructor: "Maestro Léo (Mestre em Educação Musical)",
    duration: "4h 20m",
    imageUrl: "https://images.unsplash.com/photo-1558020245-70c1a53218a9?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Desenvolva a coordenação motora fina e a disciplina musical. Este curso ensina postura correta, leitura de tablaturas simplificadas e os acordes fundamentais (C, G, D, Em) para que a criança possa tocar suas primeiras canções populares em poucas semanas. Foco na prática e na alegria de criar música.",
    videoUrl: "https://www.youtube.com/embed/APa-t_H3_e4",
    premium: true,
    recommended: true
  },
  {
    id: "desenho-e-pintura-digital",
    title: "Arte Digital Criativa: Personagens e Cenários",
    instructor: "Artista Gabi (Designer Gráfico e Ilustradora)",
    duration: "5h 00m",
    imageUrl: "https://images.unsplash.com/photo-1589150306321-458c3d39c37a?q=80&w=1974&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Transforme a criatividade em arte digital profissional. O curso cobre técnicas de esboço, teoria das cores, sombreamento e uso de camadas em softwares gratuitos. Seu filho aprenderá a criar personagens originais e a construir cenários digitais com profundidade e estilo.",
    videoUrl: "https://www.youtube.com/embed/u-46ksm_Y2I",
    premium: true,
    recommended: false
  },
  {
    id: "pequenos-cientistas",
    title: "Pequenos Cientistas: Explorando o Mundo com Experimentos",
    instructor: "Dr. Elara (Doutora em Química e Educadora)",
    duration: "2h 15m",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2080&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9'],
    description: "Incentive o pensamento crítico e a curiosidade científica. Este curso apresenta experimentos seguros e supervisionados (usando materiais domésticos) para explicar conceitos de física e química, como densidade, reações e estados da matéria. Ideal para despertar o amor pela ciência.",
    videoUrl: "https://www.youtube.com/embed/p5n2x0-nL-E",
    premium: false,
    recommended: true
  },
  {
    id: "robotica-com-lego",
    title: "Robótica e Programação com LEGO Education",
    instructor: "Eng. Rick (Especialista em Automação e STEM)",
    duration: "6h 30m",
    imageUrl: "https://images.unsplash.com/photo-1678922619217-061b7a23b0e1?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Introdução prática à engenharia e programação. Usando blocos LEGO (ou simuladores virtuais), os alunos constroem e programam robôs para realizar tarefas específicas, desenvolvendo lógica sequencial, resolução de problemas complexos e fundamentos de codificação por blocos.",
    videoUrl: "https://www.youtube.com/embed/j2Q-hG5dyGk",
    premium: true,
    recommended: true
  },
  {
    id: "teclado-magico",
    title: "Teclado Mágico: Primeiras Melodias",
    instructor: "Maestra Ana (Pianista e Pedagoga Musical)",
    duration: "4h 00m",
    imageUrl: "https://images.unsplash.com/photo-1612021459339-39989c23165a?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9', '10-12'],
    description: "Um método divertido para aprender a ler partituras básicas e encontrar as notas no teclado. Foco na coordenação mão-olho e no desenvolvimento do ouvido musical, permitindo que a criança toque melodias simples e reconheça ritmos.",
    videoUrl: "https://www.youtube.com/embed/g-5-YI6t-8k",
    premium: false,
    recommended: false
  },
  {
    id: "matematica-fundamental-1",
    title: "Matemática Fundamental: Dominando Números e Operações",
    instructor: "Prof. Marta (Pedagoga com foco em Ensino Fundamental)",
    duration: "3h 00m",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Reforço essencial em adição, subtração, e introdução à multiplicação. O curso utiliza exemplos visuais e problemas do mundo real para garantir que a criança não apenas memorize, mas compreenda a lógica por trás das operações matemáticas básicas.",
    videoUrl: "https://www.youtube.com/embed/3P7Q2v3k6nQ",
    premium: false,
    recommended: true
  },
  {
    id: "matematica-fundamental-2",
    title: "Matemática Avançada: Frações, Decimais e Porcentagem",
    instructor: "Prof. Júlio (Especialista em Raciocínio Lógico)",
    duration: "2h 50m",
    imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702f?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Desmistifique conceitos complexos. Usando modelos visuais (como pizzas e barras), este curso ensina a comparar, somar e subtrair frações e decimais, preparando o aluno para o raciocínio proporcional e introduzindo a base da porcentagem.",
    videoUrl: "https://www.youtube.com/embed/OBk7r0m6S1M",
    premium: true,
    recommended: false
  },
  {
    id: "portugues-leitura",
    title: "Português: Leitura Crítica e Interpretação de Texto",
    instructor: "Profª. Carla (Mestre em Linguística)",
    duration: "3h 20m",
    imageUrl: "https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Vá além da leitura superficial. O curso foca em técnicas de interpretação, identificação de ideias centrais, inferência e vocabulário contextual. Seu filho desenvolverá a capacidade de compreender textos complexos e responder a perguntas de forma estruturada.",
    videoUrl: "https://www.youtube.com/embed/ezjJc6nq3C8",
    premium: false,
    recommended: true
  },
  {
    id: "portugues-escrita",
    title: "Português: Produção de Texto e Gramática Aplicada",
    instructor: "Profª. Lúcia (Especialista em Redação Criativa)",
    duration: "2h 40m",
    imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Desenvolva a escrita clara e persuasiva. O curso aborda planejamento textual, estrutura narrativa (início, meio, fim), uso correto de pontuação e concordância. Os alunos praticam a criação de diferentes gêneros textuais, como contos e descrições.",
    videoUrl: "https://www.youtube.com/embed/57sH3Z6X3fE",
    premium: true,
    recommended: false
  },
  {
    id: "ciencias-planta-e-animal",
    title: "Ciências Naturais: Biodiversidade e Ecossistemas",
    instructor: "Dr. Marina (Bióloga e Educadora Ambiental)",
    duration: "1h 45m",
    imageUrl: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9'],
    description: "Uma jornada pelo mundo vivo. O curso explora o ciclo de vida das plantas, a classificação dos animais (vertebrados e invertebrados) e a importância da preservação dos ecossistemas. Foco na observação e no respeito à natureza.",
    videoUrl: "https://www.youtube.com/embed/5a0D3kJw8FI",
    premium: false,
    recommended: false
  },
  {
    id: "historia-brasil",
    title: "História do Brasil: Da Colônia à República",
    instructor: "Prof. Renato (Historiador e Curador)",
    duration: "2h 10m",
    imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Entenda a formação da identidade brasileira. O curso utiliza linhas do tempo interativas e narrativas envolventes para cobrir os principais períodos históricos, desde o 'descobrimento' até os eventos modernos, incentivando a análise crítica dos fatos.",
    videoUrl: "https://www.youtube.com/embed/8N1z7v7u2bI",
    premium: false,
    recommended: false
  },
  {
    id: "geografia-mapas",
    title: "Geografia: Leitura de Mapas e Orientação Espacial",
    instructor: "Profª. Paula (Geógrafa e Cartógrafa)",
    duration: "1h 30m",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Desenvolva habilidades de orientação e interpretação cartográfica. Aprenda sobre coordenadas, escalas, legendas e como diferentes tipos de mapas representam o mundo. Essencial para a compreensão do espaço geográfico.",
    videoUrl: "https://www.youtube.com/embed/BVbU8gJ9dW4",
    premium: false,
    recommended: false
  },
  {
    id: "artes-desenho",
    title: "Artes Visuais: Fundamentos do Desenho Realista",
    instructor: "Artista Nina (Ilustradora e Professora de Belas Artes)",
    duration: "2h 00m",
    imageUrl: "https://images.unsplash.com/photo-1496317556649-f930d733eea2?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Foco em técnicas de observação, proporção e sombreamento. O curso ensina a usar materiais simples (lápis e papel) para criar profundidade e volume, transformando esboços em ilustrações detalhadas. Ideal para aprimorar a percepção visual.",
    videoUrl: "https://www.youtube.com/embed/Wd8eF3X1b0s",
    premium: true,
    recommended: true
  },
  {
    id: "musica-ritmo",
    title: "Música: Ritmo, Pulso e Coordenação Auditiva",
    instructor: "Maestro Tom (Regente e Compositor)",
    duration: "1h 20m",
    imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['4-6', '7-9'],
    description: "Exercícios práticos e jogos rítmicos para desenvolver a percepção musical e a coordenação motora. Aprenda a identificar diferentes tempos e a manter o pulso, habilidades cruciais para qualquer instrumento musical.",
    videoUrl: "https://www.youtube.com/embed/1G4isv_Fylg",
    premium: false,
    recommended: false
  },
  {
    id: "programacao-inicial",
    title: "Pensamento Computacional: Lógica e Algoritmos",
    instructor: "Eng. Sofia (Desenvolvedora de Software e Educadora)",
    duration: "3h 10m",
    imageUrl: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "O futuro da lógica começa aqui. Este curso ensina os fundamentos do pensamento computacional: decomposição de problemas, reconhecimento de padrões e criação de algoritmos. Prepara o aluno para linguagens de programação reais, focando na resolução estruturada de desafios.",
    videoUrl: "https://www.youtube.com/embed/7Yk5t8f4u1o",
    premium: true,
    recommended: false
  },
  {
    id: "educacao-financeira",
    title: "Educação Financeira: Poupança e Orçamento Inteligente",
    instructor: "Prof. Marina (Consultora Financeira e Pedagoga)",
    duration: "1h 50m",
    imageUrl: "https://images.unsplash.com/photo-1520975913231-4d8f72f8a0a3?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Ensine seu filho a valorizar o dinheiro e a planejar o futuro. O curso aborda conceitos de renda, despesa, poupança e investimento de forma lúdica, usando jogos de simulação para estabelecer metas financeiras realistas.",
    videoUrl: "https://www.youtube.com/embed/2X6q8bXbQ1I",
    premium: false,
    recommended: true
  },
  {
    id: "laboratorio-caseiro",
    title: "Laboratório Caseiro: Experimentos de Física e Química",
    instructor: "Dr. Hélio (Físico e Divulgador Científico)",
    duration: "2h 25m",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "A ciência acontece na cozinha! Este curso oferece uma série de experimentos seguros e fáceis de replicar em casa, com explicações científicas detalhadas, transformando materiais domésticos em ferramentas de aprendizado.",
    videoUrl: "https://www.youtube.com/embed/6f2dSwcQK6M",
    premium: false,
    recommended: false
  },
  {
    id: "cultura-popular",
    title: "Cultura e Tradições: Folclore e Diversidade",
    instructor: "Profª. Clara (Antropóloga Cultural)",
    duration: "1h 10m",
    imageUrl: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Uma exploração da riqueza cultural brasileira e mundial. O curso apresenta lendas, festividades, músicas e histórias populares, promovendo o respeito à diversidade e a valorização das tradições.",
    videoUrl: "https://www.youtube.com/embed/0pXYp72XMMI",
    premium: false,
    recommended: false
  },
  {
    id: "quimica-basica",
    title: "Química para Jovens: A Matéria ao Nosso Redor",
    instructor: "Prof. Raul (Químico Industrial)",
    duration: "2h 45m",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Introdução fascinante aos estados da matéria, elementos e reações químicas simples. O curso utiliza demonstrações visuais e linguagem acessível para desmistificar a química, focando na segurança e na aplicação prática dos conceitos.",
    videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
    premium: true,
    recommended: false
  },
  {
    id: "filosofia-para-criancas",
    title: "Filosofia Kids: Pensamento Crítico e Ética",
    instructor: "Profª. Helena (Filósofa e Mediadora de Debates)",
    duration: "1h 40m",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['10-12'],
    description: "Desenvolva a capacidade de argumentação e o raciocínio ético. O curso propõe debates simples sobre grandes questões (o que é justiça? o que é verdade?), ensinando a criança a formular ideias, ouvir diferentes perspectivas e pensar criticamente.",
    videoUrl: "https://www.youtube.com/embed/4rKsv3d0z_A",
    premium: false,
    recommended: false
  },
  {
    id: "fotografia-crianca",
    title: "Fotografia Criativa: Composição e Olhar Artístico",
    instructor: "Fotógrafa Sara (Especialista em Fotografia de Natureza)",
    duration: "2h 05m",
    imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=2070&auto=format&fit=crop",
    ageGroups: ['7-9', '10-12'],
    description: "Transforme o celular em uma ferramenta de arte. Este curso ensina os fundamentos da composição (regra dos terços, simetria), enquadramento e uso da luz natural, incentivando a criança a desenvolver um olhar artístico e a contar histórias através de imagens.",
    videoUrl: "https://www.youtube.com/embed/NLQ2M7q88DI",
    premium: true,
    recommended: false
  }
];