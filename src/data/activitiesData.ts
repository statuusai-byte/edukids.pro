import { IconName } from '@/components/Icon';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string;
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
  description: string;
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

/**
 * Each activity now contains modules (pastas de estudo). Each module has multiple lessons.
 * Modules are intentionally varied to avoid repetition and create a stepwise learning path.
 */
export const subjectsData: Subject[] = [
  {
    name: "Matemática",
    slug: "matematica",
    icon: "Sigma",
    color: "cyan",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "m1",
        title: "Contando Frutas",
        description: "Conte as frutas coloridas na cesta.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m1-mod-intro",
            title: "Introdução ao Contar",
            description: "Pequenas práticas para reconhecer números.",
            lessons: [
              { id: "m1-l1", title: "Quantas maçãs? (1-3)", description: "Contando até 3 com maçãs.", content: "Mostre 1 a 3 maçãs e conte em voz alta.", type: "exercise" },
              { id: "m1-l2", title: "Contando Maçãs (4-5)", description: "Expandindo até 5.", content: "Agora conte até 5 com maçãs coloridas.", type: "exercise" }
            ]
          },
          {
            id: "m1-mod-atividades",
            title: "Atividades Interativas",
            description: "Jogos e desafios para fixação.",
            lessons: [
              { id: "m1-l3", title: "Jogo Rápido: Escolha o Número", description: "Escolha quantas maçãs aparecem.", content: "Clique no número correto.", type: "game" },
              { id: "m1-l4", title: "Desafio de Tempo", description: "Conte rapidamente para ganhar estrelas.", content: "Tempo limitado para contar.", type: "exercise" }
            ]
          },
          {
            id: "m1-mod-revisao",
            title: "Revisão e Prática",
            description: "Reforce o que aprendeu com atividades variadas.",
            lessons: [
              { id: "m1-l5", title: "Mix de Frutas", description: "Conte diferentes frutas misturadas.", content: "Conte e escreva os totais.", type: "exercise" },
              { id: "m1-l6", title: "Autoavaliação", description: "Repita os exercícios que teve dificuldade.", content: "Escolha lições completadas para rever.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Formas Divertidas",
        description: "Encontre e identifique quadrados, círculos e triângulos.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m2-mod-1",
            title: "Reconhecendo Formas",
            lessons: [
              { id: "m2-l1", title: "O que é um círculo?", description: "Identifique círculos em imagens.", content: "Atividade de reconhecimento.", type: "exercise" },
              { id: "m2-l2", title: "Quadrados e Triângulos", description: "Compare formas básicas.", content: "Desenhe exemplos e localize objetos.", type: "exercise" }
            ]
          },
          {
            id: "m2-mod-2",
            title: "Formas no Mundo",
            lessons: [
              { id: "m2-l3", title: "Formas em Casa", description: "Encontre objetos que representem cada forma.", content: "Tarefa para casa.", type: "exercise" },
              { id: "m2-l4", title: "Atividade Criativa", description: "Desenhe uma cena usando 5 formas diferentes.", content: "Crie e conte as formas usadas.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m3",
        title: "Soma com Blocos",
        description: "Resolva somas simples com blocos de montar virtuais.",
        ageGroups: ['4-6', '7-9'],
        icon: "Apple",
        modules: [
          {
            id: "m3-mod-basico",
            title: "Soma Básica",
            lessons: [
              { id: "m3-l1", title: "1+1 e 2+1", description: "Somando pequenas quantidades com blocos.", content: "Use blocos para visualizar somas.", type: "exercise" },
              { id: "m3-l2", title: "Objetos do Dia a Dia", description: "Some brinquedos e conte o total.", content: "Exercício prático com objetos.", type: "exercise" }
            ]
          },
          {
            id: "m3-mod-visual",
            title: "Visualizando Somatórios",
            lessons: [
              { id: "m3-l3", title: "Barra de Somas", description: "Use barras para juntar números.", content: "Representações visuais da adição.", type: "exercise" },
              { id: "m3-l4", title: "Problema com Figuras", description: "Pequenos problemas que ativam o raciocínio.", content: "Leia e resolva.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m4",
        title: "Desafio da Tabuada",
        description: "Teste sua velocidade na multiplicação de 1 a 10.",
        ageGroups: ['7-9', '10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m4-mod-1",
            title: "Tabuada Inicial",
            lessons: [
              { id: "m4-l1", title: "Tabuada do 1 ao 5", description: "Aprenda com jogos e repetições.", content: "Prática com flashcards.", type: "exercise" },
              { id: "m4-l2", title: "Quiz Rápido", description: "Responda multiplicações simples.", content: "Quiz cronometrado.", type: "exercise" }
            ]
          },
          {
            id: "m4-mod-2",
            title: "Velocidade e Precisão",
            lessons: [
              { id: "m4-l3", title: "Tabuada do 6 ao 10", description: "Continue a prática com suporte visual.", content: "Exercícios dirigidos.", type: "exercise" },
              { id: "m4-l4", title: "Desafio de 60s", description: "Quantas respostas corretas em 60s?", content: "Teste de velocidade.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m5",
        title: "Frações com Pizza",
        description: "Aprenda frações dividindo pizzas deliciosas.",
        ageGroups: ['7-9', '10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m5-mod-1",
            title: "Meio e Quarto",
            lessons: [
              { id: "m5-l1", title: "Meio e Quarto", description: "Entenda partes básicas de uma pizza.", videoUrl: "https://www.youtube.com/embed/CGyEd0aKWZE", type: "video" },
              { id: "m5-l2", title: "Dividindo Reais", description: "Exercícios práticos com imagens.", content: "Corte e identifique frações.", type: "exercise" }
            ]
          },
          {
            id: "m5-mod-2",
            title: "Frações Equivalentes",
            lessons: [
              { id: "m5-l3", title: "Comparando Frações", description: "Identifique frações equivalentes.", content: "Atividade interativa.", type: "exercise" },
              { id: "m5-l4", title: "Desafio Visual", description: "Jogo com comparação e equivalência.", content: "Exercício de correspondência.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m6",
        title: "Problemas de Lógica",
        description: "Resolva quebra-cabeças matemáticos que desafiam o raciocínio.",
        ageGroups: ['10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m6-mod-1",
            title: "Enigmas Iniciais",
            lessons: [
              { id: "m6-l1", title: "Desafios Iniciais", description: "Problemas simples de raciocínio.", content: "Resolva pequenos enigmas.", type: "exercise" },
              { id: "m6-l2", title: "Pense em Etapas", description: "Divida problemas em passos.", content: "Exercício guiado.", type: "exercise" }
            ]
          },
          {
            id: "m6-mod-2",
            title: "Raciocínio Composto",
            lessons: [
              { id: "m6-l3", title: "Problemas com Várias Etapas", description: "Desafios que exigem persistência.", content: "Problemas mais longos.", type: "exercise" },
              { id: "m6-l4", title: "Resolução Criativa", description: "Encontre soluções alternativas.", content: "Atividade aberta.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m7",
        title: "Geometria Básica",
        description: "Explore ângulos, perímetros e áreas de figuras planas.",
        ageGroups: ['10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m7-mod-1",
            title: "Introdução à Geometria",
            lessons: [
              { id: "m7-l1", title: "Ângulos e Tipos", description: "Aprenda sobre ângulos retos, agudos e obtusos.", videoUrl: "https://www.youtube.com/embed/8ZK0hXp1mvM", type: "video" },
              { id: "m7-l2", title: "Perímetro Básico", description: "Meça e calcule perímetros.", content: "Exercícios práticos de perímetro.", type: "exercise" }
            ]
          },
          {
            id: "m7-mod-2",
            title: "Área e Aplicações",
            lessons: [
              { id: "m7-l3", title: "Área de Retângulos", description: "Calcule áreas simples.", content: "Atividade prática.", type: "exercise" },
              { id: "m7-l4", title: "Problemas do Mundo Real", description: "Aplicações práticas de área.", content: "Questões contextualizadas.", type: "exercise" }
            ]
          }
        ]
      }
    ],
  },
  {
    name: "Português",
    slug: "portugues",
    icon: "BookOpen",
    color: "purple",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "p1",
        title: "Alfabeto Animado",
        description: "Aprenda as letras do alfabeto com animações divertidas.",
        ageGroups: ['4-6'],
        icon: "BookOpen",
        modules: [
          {
            id: "p1-mod-1",
            title: "Letras e Sons",
            lessons: [
              { id: "p1-l1", title: "A a Z - Sons Iniciais", description: "Associe letras a sons e imagens.", content: "Cartões interativos de som.", type: "exercise" },
              { id: "p1-l2", title: "Letras em Palavras", description: "Identifique letras no começo das palavras.", content: "Atividade de correspondência.", type: "exercise" }
            ]
          },
          {
            id: "p1-mod-2",
            title: "Brincando com Letras",
            lessons: [
              { id: "p1-l3", title: "Montando Palavras Simples", description: "Junte letras para formar palavras curto.", content: "Jogo de montar palavras.", type: "exercise" },
              { id: "p1-l4", title: "Caça às Letras", description: "Localize letras em textos curtos.", content: "Exercício de leitura guiada.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p2",
        title: "Formando Palavras",
        description: "Junte as sílabas para formar palavras simples.",
        ageGroups: ['4-6', '7-9'],
        icon: "BookOpen",
        modules: [
          {
            id: "p2-mod-1",
            title: "Sílabas Simples",
            lessons: [
              { id: "p2-l1", title: "Dividindo em Sílabas", description: "Entenda a separação por sílaba.", content: "Atividade com exemplos.", type: "exercise" },
              { id: "p2-l2", title: "Sílabas e Sons", description: "Combine sílabas para formar palavras.", content: "Exercício interativo.", type: "exercise" }
            ]
          },
          {
            id: "p2-mod-2",
            title: "Montando Palavras",
            lessons: [
              { id: "p2-l3", title: "Forme palavras com imagens", description: "Associe imagens a palavras formadas.", content: "Atividade prática.", type: "exercise" },
              { id: "p2-l4", title: "Jogos de Montagem", description: "Desafios progressivos de montagem.", content: "Minijogos com sílabas.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p3",
        title: "Caça-Rimas",
        description: "Encontre as palavras que rimam neste jogo divertido.",
        ageGroups: ['4-6', '7-9'],
        icon: "BookOpen",
        modules: [
          {
            id: "p3-mod-1",
            title: "Rimas Básicas",
            lessons: [
              { id: "p3-l1", title: "Rimas Simples", description: "Encontre pares que rimam.", content: "Atividade com cartões.", type: "exercise" },
              { id: "p3-l2", title: "Crie Sua Rima", description: "Escreva rimas simples.", content: "Exercício criativo.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p4",
        title: "Interpretação de Texto",
        description: "Leia pequenas histórias e responda a perguntas.",
        ageGroups: ['7-9', '10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p4-mod-1",
            title: "Compreensão Básica",
            lessons: [
              { id: "p4-l1", title: "Leia e Responda", description: "Perguntas de múltipla escolha sobre o texto.", content: "Texto curto com perguntas.", type: "reading" },
              { id: "p4-l2", title: "Resumo do Texto", description: "Aprenda a resumir ideias principais.", content: "Tarefa de resumo.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p5",
        title: "Acentuação Correta",
        description: "Aprenda a usar acentos agudos e circunflexos.",
        ageGroups: ['7-9', '10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p5-mod-1",
            title: "Regras e Exemplos",
            lessons: [
              { id: "p5-l1", title: "Acentos Básicos", description: "Regras de acentuação.", content: "Exemplos e exercícios.", type: "exercise" },
              { id: "p5-l2", title: "Exercícios Práticos", description: "Aplique as regras em palavras reais.", content: "Quiz interativo.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p6",
        title: "Classes Gramaticais",
        description: "Identifique substantivos, adjetivos e verbos em frases.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p6-mod-1",
            title: "Substantivos e Verbos",
            lessons: [
              { id: "p6-l1", title: "Identificando Substantivos", description: "Marque substantivos em frases.", content: "Exercício de marcação.", type: "exercise" },
              { id: "p6-l2", title: "Transformando Frases", description: "Use adjetivos para enriquecer frases.", content: "Atividade prática.", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p7",
        title: "Produção de Texto",
        description: "Crie suas próprias histórias a partir de temas sugeridos.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p7-mod-1",
            title: "Planejamento",
            lessons: [
              { id: "p7-l1", title: "Planejando a História", description: "Estruture início, meio e fim.", content: "Guia para criar uma história curta.", type: "exercise" },
              { id: "p7-l2", title: "Escrevendo com Emoção", description: "Use adjetivos e verbos para dar vida ao texto.", content: "Exercício prático.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Ciências",
    slug: "ciencias",
    icon: "FlaskConical",
    color: "green",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "c1",
        title: "Corpo Humano",
        description: "Explore os principais órgãos e sistemas do corpo.",
        ageGroups: ['7-9', '10-12'],
        icon: "FlaskConical",
        modules: [
          {
            id: "c1-mod-1",
            title: "Órgãos e Funções",
            lessons: [
              { id: "c1-l1", title: "Sistema Digestório", description: "Como os alimentos são processados no corpo.", content: "Leitura guiada com imagens.", type: "reading" },
              { id: "c1-l2", title: "Sistema Respiratório", description: "Como respiramos.", content: "Exercício de identificação.", type: "exercise" }
            ]
          },
          {
            id: "c1-mod-2",
            title: "Cuidados e Saúde",
            lessons: [
              { id: "c1-l3", title: "Higiene e Hábitos Saudáveis", description: "Práticas para manter o corpo saudável.", content: "Checklist prático.", type: "exercise" },
              { id: "c1-l4", title: "Experimento Simples", description: "Experimentos seguros para entender funções.", content: "Atividade prática.", type: "exercise" }
            ]
          }
        ]
      },
    ]
  },
  {
    name: "História",
    slug: "historia",
    icon: "Landmark",
    color: "orange",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "h1",
        title: "Descobrimento do Brasil",
        description: "Conheça a chegada dos portugueses ao Brasil.",
        ageGroups: ['7-9', '10-12'],
        icon: "Landmark",
        modules: [
          {
            id: "h1-mod-1",
            title: "Contexto e Povos",
            lessons: [
              { id: "h1-l1", title: "Povos Indígenas", description: "Quem vivia no Brasil antes de 1500?", content: "Leitura com mapa.", type: "reading" },
              { id: "h1-l2", title: "Rotas e Viagens", description: "Como chegaram os portugueses?", content: "Linha do tempo.", type: "exercise" }
            ]
          },
          {
            id: "h1-mod-2",
            title: "Consequências",
            lessons: [
              { id: "h1-l3", title: "Impactos Culturais", description: "Mudanças geradas pelo encontro.", content: "Atividade de reflexão.", type: "exercise" },
              { id: "h1-l4", title: "Revisão e Debate", description: "Questões para discutir em sala.", content: "Debate guiado.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Geografia",
    slug: "geografia",
    icon: "Globe",
    color: "teal",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "g1",
        title: "Capitais do Brasil",
        description: "Teste seus conhecimentos sobre as capitais brasileiras.",
        ageGroups: ['7-9', '10-12'],
        icon: "Globe",
        modules: [
          {
            id: "g1-mod-1",
            title: "Mapa e Localização",
            lessons: [
              { id: "g1-l1", title: "Mapa do Brasil", description: "Localize estados e capitais.", content: "Exercício de mapeamento.", type: "exercise" },
              { id: "g1-l2", title: "Curiosidades por Capital", description: "Fatos interessantes sobre capitais.", content: "Leitura e perguntas.", type: "reading" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Inglês",
    slug: "ingles",
    icon: "SpellCheck",
    color: "indigo",
    ageGroups: ['7-9', '10-12'],
    activities: [
      {
        id: "i1",
        title: "Colors and Numbers",
        description: "Aprenda as cores e os números em inglês.",
        ageGroups: ['7-9'],
        icon: "SpellCheck",
        modules: [
          {
            id: "i1-mod-1",
            title: "Vocabulário Básico",
            lessons: [
              { id: "i1-l1", title: "Cores em Inglês", description: "Nomes das cores e como usá-las.", content: "Flashcards de cores.", type: "exercise" },
              { id: "i1-l2", title: "Números Básicos", description: "Contando em inglês.", videoUrl: "https://www.youtube.com/embed/d3LLHe2fM0w", type: "video" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Lógica",
    slug: "logica",
    icon: "Brain",
    color: "yellow",
    ageGroups: ['4-6', '7-9', '10-12'],
    activities: [
      {
        id: "l1",
        title: "Sequência Lógica",
        description: "Complete as sequências de formas e cores.",
        ageGroups: ['4-6', '7-9'],
        icon: "Brain",
        modules: [
          {
            id: "l1-mod-1",
            title: "Padrões Simples",
            lessons: [
              { id: "l1-l1", title: "Sequências Simples", description: "Identifique o próximo item.", content: "Exercício visual.", type: "exercise" },
              { id: "l1-l2", title: "Sequências com Cores", description: "Padrões coloridos.", content: "Atividade prática.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Artes",
    slug: "artes",
    icon: "Palette",
    color: "red",
    ageGroups: ['4-6', '7-9'],
    activities: [
      {
        id: "a1",
        title: "Pintura Digital",
        description: "Use cores e pincéis para criar sua obra de arte.",
        ageGroups: ['4-6', '7-9'],
        icon: "Palette",
        modules: [
          {
            id: "a1-mod-1",
            title: "Ferramentas Básicas",
            lessons: [
              { id: "a1-l1", title: "Conhecendo Pincéis", description: "Tipos de pincéis e usos.", content: "Leitura e demonstração.", type: "reading" },
              { id: "a1-l2", title: "Criando um Personagem", description: "Do esboço à cor.", content: "Exercício passo-a-passo.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Música",
    slug: "musica",
    icon: "Music",
    color: "pink",
    ageGroups: ['4-6', '7-9'],
    activities: [
      {
        id: "mu1",
        title: "Sons dos Instrumentos",
        description: "Ouça e adivinhe qual instrumento está tocando.",
        ageGroups: ['4-6', '7-9'],
        icon: "Music",
        modules: [
          {
            id: "mu1-mod-1",
            title: "Introdução aos Instrumentos",
            lessons: [
              { id: "mu1-l1", title: "Cordas e Sopro", description: "Identifique famílias de instrumentos.", content: "Atividade auditiva.", type: "exercise" },
              { id: "mu1-l2", title: "Ritmos Simples", description: "Marque o tempo com palmas.", content: "Exercício de ritmo.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Programação",
    slug: "programacao",
    icon: "Code",
    color: "slate",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "pr1",
        title: "Lógica de Blocos",
        description: "Aprenda os fundamentos da programação com blocos visuais.",
        ageGroups: ['10-12'],
        icon: "Code",
        modules: [
          {
            id: "pr1-mod-1",
            title: "Sequência e Comandos",
            lessons: [
              { id: "pr1-l1", title: "Sequência de Comandos", description: "Ordem de execução e instruções.", content: "Atividade com blocos.", type: "exercise" },
              { id: "pr1-l2", title: "Loops Simples", description: "Repetição com objetivos.", content: "Exercícios práticos.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Robótica",
    slug: "robotica",
    icon: "Bot",
    color: "rose",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "r1",
        title: "Monte seu Robô Virtual",
        description: "Escolha as peças e monte um robô em um ambiente 3D.",
        ageGroups: ['10-12'],
        icon: "Bot",
        modules: [
          {
            id: "r1-mod-1",
            title: "Peças e Funções",
            lessons: [
              { id: "r1-l1", title: "Sensores e Motores", description: "Tipos de sensores e funções.", content: "Leitura detalhada.", type: "reading" },
              { id: "r1-l2", title: "Montagem Básica", description: "Monte a estrutura do robô.", content: "Atividade prática.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Finanças",
    slug: "financas",
    icon: "PiggyBank",
    color: "lime",
    ageGroups: ['10-12'],
    activities: [
      {
        id: "f1",
        title: "Jogo da Mesada",
        description: "Aprenda a administrar sua mesada e a poupar.",
        ageGroups: ['10-12'],
        icon: "PiggyBank",
        modules: [
          {
            id: "f1-mod-1",
            title: "Orçamento Básico",
            lessons: [
              { id: "f1-l1", title: "Renda e Despesas", description: "Entenda o que é renda e despesas.", content: "Exercício prático.", type: "exercise" },
              { id: "f1-l2", title: "Planejando uma Meta", description: "Defina uma meta de economia.", content: "Atividade de planejamento.", type: "exercise" }
            ]
          }
        ]
      }
    ]
  }
];