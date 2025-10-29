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

  // você pode expandir com mais subjects seguindo o padrão acima
];
/* fim de activitiesData */