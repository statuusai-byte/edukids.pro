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
              { id: "m1-l1", title: "Quantas maçãs? (1-3)", description: "Contando até 3 com maçãs.", content: "Conte em voz alta: 🍎. Quantas são? (Resposta: 1). Conte: 🍎🍎. Quantas são? (Resposta: 2).", type: "exercise" },
              { id: "m1-l2", title: "Contando Maçãs (4-5)", description: "Expandindo até 5.", content: "Conte: 🍎🍎🍎🍎. Quantas são? (Resposta: 4). Conte: 🍎🍎🍎🍎🍎. Quantas são? (Resposta: 5).", type: "exercise" }
            ]
          },
          {
            id: "m1-mod-atividades",
            title: "Atividades Interativas",
            description: "Jogos e desafios para fixação.",
            lessons: [
              { id: "m1-l3", title: "Jogo Rápido: Escolha o Número", description: "Escolha quantas maçãs aparecem.", content: "Clique no número correto.", type: "game" },
              { id: "m1-l4", title: "Desafio de Tempo", description: "Conte rapidamente para ganhar estrelas.", content: "Desafio: Em 10 segundos, conte quantos objetos aparecem na tela. (Simulação de quiz rápido).", type: "exercise" }
            ]
          },
          {
            id: "m1-mod-revisao",
            title: "Revisão e Prática",
            description: "Reforce o que aprendeu com atividades variadas.",
            lessons: [
              { id: "m1-l5", title: "Mix de Frutas", description: "Conte diferentes frutas misturadas.", content: "Pergunta: Se você tem 3 bananas 🍌🍌🍌 e 2 laranjas 🍊🍊, quantas frutas tem no total? (Resposta: 5).", type: "exercise" },
              { id: "m1-l6", title: "Autoavaliação", description: "Repita os exercícios que teve dificuldade.", content: "Revisão: Qual é o número que vem depois do 4? (Resposta: 5).", type: "exercise" }
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
              { id: "m2-l1", title: "O que é um círculo?", description: "Identifique círculos em imagens.", content: "O círculo é redondo como uma bola. Qual objeto abaixo é um círculo? (Opções: ⏹️, 🔺, ⭕).", type: "exercise" },
              { id: "m2-l2", title: "Quadrados e Triângulos", description: "Compare formas básicas.", content: "O quadrado tem 4 lados iguais. O triângulo tem 3 lados. Quantos lados tem um quadrado? (Resposta: 4).", type: "exercise" }
            ]
          },
          {
            id: "m2-mod-2",
            title: "Formas no Mundo",
            lessons: [
              { id: "m2-l3", title: "Formas em Casa", description: "Encontre objetos que representem cada forma.", content: "Tarefa: Olhe pela janela. O que tem formato de retângulo? (Exemplo: a porta).", type: "exercise" },
              { id: "m2-l4", title: "Atividade Criativa", description: "Desenhe uma cena usando 5 formas diferentes.", content: "Desenhe uma casa usando um triângulo (telhado) e um quadrado (corpo).", type: "exercise" }
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
              { id: "m3-l1", title: "1+1 e 2+1", description: "Somando pequenas quantidades com blocos.", content: "Se você tem 1 bloco azul e ganha mais 1 bloco azul, quantos blocos tem? (Resposta: 2).", type: "exercise" },
              { id: "m3-l2", title: "Objetos do Dia a Dia", description: "Some brinquedos e conte o total.", content: "Você tem 3 carrinhos e 2 bonecas. Quantos brinquedos no total? (Resposta: 5).", type: "exercise" }
            ]
          },
          {
            id: "m3-mod-visual",
            title: "Visualizando Somatórios",
            lessons: [
              { id: "m3-l3", title: "Barra de Somas", description: "Use barras para juntar números.", content: "Pergunta: 4 + 3 = ? (Resposta: 7).", type: "exercise" },
              { id: "m3-l4", title: "Problema com Figuras", description: "Pequenos problemas que ativam o raciocínio.", content: "Havia 5 pássaros na árvore. 2 voaram. Quantos restaram? (Resposta: 3).", type: "exercise" }
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
              { id: "m4-l1", title: "Tabuada do 1 ao 5", description: "Aprenda com jogos e repetições.", content: "Quiz: 3 x 4 = ? (Resposta: 12). 5 x 5 = ? (Resposta: 25).", type: "exercise" },
              { id: "m4-l2", title: "Quiz Rápido", description: "Responda multiplicações simples.", content: "Teste de velocidade: Qual é o resultado de 2 x 7? (Resposta: 14).", type: "exercise" }
            ]
          },
          {
            id: "m4-mod-2",
            title: "Velocidade e Precisão",
            lessons: [
              { id: "m4-l3", title: "Tabuada do 6 ao 10", description: "Continue a prática com suporte visual.", content: "Quiz: 8 x 9 = ? (Resposta: 72). 6 x 6 = ? (Resposta: 36).", type: "exercise" },
              { id: "m4-l4", title: "Desafio de 60s", description: "Quantas respostas corretas em 60s?", content: "Desafio: Responda 10 perguntas de multiplicação em 60 segundos.", type: "exercise" }
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
              { id: "m5-l2", title: "Dividindo Reais", description: "Se você dividir uma maçã em 4 partes iguais, cada parte é chamada de: (Resposta: Um quarto).", content: "Exercícios práticos com imagens.", type: "exercise" }
            ]
          },
          {
            id: "m5-mod-2",
            title: "Frações Equivalentes",
            lessons: [
              { id: "m5-l3", title: "Comparando Frações", description: "Identifique frações equivalentes.", content: "Qual fração é igual a 1/2? (Opções: 2/4, 1/3, 3/5).", type: "exercise" },
              { id: "m5-l4", title: "Desafio Visual", description: "Jogo com comparação e equivalência.", content: "Se 2/8 da pizza foi comida, qual fração equivalente sobrou? (Resposta: 6/8 ou 3/4).", type: "exercise" }
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
              { id: "m6-l1", title: "Desafios Iniciais", description: "Problemas simples de raciocínio.", content: "Se um trem sai às 8h e viaja por 3 horas, a que horas ele chega? (Resposta: 11h).", type: "exercise" },
              { id: "m6-l2", title: "Pense em Etapas", description: "Divida problemas em passos.", content: "Um fazendeiro tem 10 galinhas. Se ele vender 4 e comprar 2, quantas galinhas ele tem agora? (Resposta: 8).", type: "exercise" }
            ]
          },
          {
            id: "m6-mod-2",
            title: "Raciocínio Composto",
            lessons: [
              { id: "m6-l3", title: "Problemas com Várias Etapas", description: "Desafios que exigem persistência.", content: "Se o preço de um livro é R$ 20 e você tem um desconto de 10%, quanto você paga? (Resposta: R$ 18).", type: "exercise" },
              { id: "m6-l4", title: "Resolução Criativa", description: "Encontre soluções alternativas.", content: "Desafio: Use os números 2, 3, 5 e 8 para formar o número 50 usando adição e multiplicação.", type: "exercise" }
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
              { id: "m7-l2", title: "Perímetro Básico", description: "Meça e calcule perímetros.", content: "Qual é o perímetro de um quadrado com lados de 5cm? (Resposta: 20cm).", type: "exercise" }
            ]
          },
          {
            id: "m7-mod-2",
            title: "Área e Aplicações",
            lessons: [
              { id: "m7-l3", title: "Área de Retângulos", description: "Calcule áreas simples.", content: "Qual é a área de um retângulo com 4cm de largura e 6cm de comprimento? (Resposta: 24cm²).", type: "exercise" },
              { id: "m7-l4", title: "Problemas do Mundo Real", description: "Aplicações práticas de área.", content: "Se você precisa pintar uma parede de 3m x 4m, qual é a área total a ser pintada? (Resposta: 12m²).", type: "exercise" }
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
              { id: "p1-l1", title: "A a Z - Sons Iniciais", description: "Associe letras a sons e imagens.", content: "Qual letra faz o som de 'A' de 'Abelha'? (Resposta: A).", type: "exercise" },
              { id: "p1-l2", title: "Letras em Palavras", description: "Identifique letras no começo das palavras.", content: "Qual é a primeira letra da palavra 'CASA'? (Resposta: C).", type: "exercise" }
            ]
          },
          {
            id: "p1-mod-2",
            title: "Brincando com Letras",
            lessons: [
              { id: "p1-l3", title: "Montando Palavras Simples", description: "Junte letras para formar palavras curto.", content: "Junte as letras B-O-L-A. Qual palavra você formou? (Resposta: BOLA).", type: "exercise" },
              { id: "p1-l4", title: "Caça às Letras", description: "Localize letras em textos curtos.", content: "Leitura: 'O gato comeu o peixe.' Quantas vezes a letra 'O' aparece?", type: "exercise" }
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
              { id: "p2-l1", title: "Dividindo em Sílabas", description: "Entenda a separação por sílaba.", content: "Quantas sílabas tem a palavra 'PATO'? (Resposta: 2).", type: "exercise" },
              { id: "p2-l2", title: "Sílabas e Sons", description: "Combine sílabas para formar palavras.", content: "Junte as sílabas 'CA' e 'LO'. Qual palavra você formou? (Resposta: CALO).", type: "exercise" }
            ]
          },
          {
            id: "p2-mod-2",
            title: "Montando Palavras",
            lessons: [
              { id: "p2-l3", title: "Forme palavras com imagens", description: "Associe imagens a palavras formadas.", type: "game" },
              { id: "p2-l4", title: "Jogos de Montagem", description: "Desafios progressivos de montagem.", type: "game" }
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
              { id: "p3-l1", title: "Rimas Simples", description: "Encontre pares que rimam.", content: "Qual palavra rima com 'PÃO'? (Opções: MÃO, GATO, BOLA).", type: "exercise" },
              { id: "p3-l2", title: "Crie Sua Rima", description: "Escreva rimas simples.", content: "Complete a frase: 'O sapo pulou no _____' (Sugestão: RIO).", type: "exercise" }
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
              { id: "p4-l1", title: "Leia e Responda", description: "Perguntas de múltipla escolha sobre o texto.", content: "Texto: 'O cachorro Rex gosta de correr no parque.' Pergunta: O que o Rex gosta de fazer? (Resposta: Correr no parque).", type: "reading" },
              { id: "p4-l2", title: "Resumo do Texto", description: "Aprenda a resumir ideias principais.", content: "Leia a história do coelho e da tartaruga e escreva em uma frase quem ganhou a corrida.", type: "exercise" }
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
              { id: "p5-l1", title: "Acentos Básicos", description: "Regras de acentuação.", content: "Qual palavra precisa de acento: 'cafe' ou 'mesa'? (Resposta: CAFÉ).", type: "exercise" },
              { id: "p5-l2", title: "Exercícios Práticos", description: "Aplique as regras em palavras reais.", content: "Acentue corretamente: 'voce', 'pijama', 'arvore'. (Respostas: VOCÊ, ARVORE).", type: "exercise" }
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
              { id: "p6-l1", title: "Identificando Substantivos", description: "Marque substantivos em frases.", content: "Na frase 'O menino comeu a maçã', qual é o substantivo? (Resposta: menino, maçã).", type: "exercise" },
              { id: "p6-l2", title: "Transformando Frases", description: "Use adjetivos para enriquecer frases.", content: "Adicione um adjetivo à frase: 'O cachorro é grande.' (Sugestão: O cachorro é peludo/rápido).", type: "exercise" }
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
              { id: "p7-l1", title: "Planejando a História", description: "Estruture início, meio e fim.", content: "Escreva um parágrafo sobre o que acontece no início de uma aventura espacial.", type: "exercise" },
              { id: "p7-l2", title: "Escrevendo com Emoção", description: "Use adjetivos e verbos para dar vida ao texto.", content: "Reescreva a frase 'Ele andou rápido' usando um verbo mais forte (Ex: Ele disparou).", type: "exercise" }
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
              { id: "c1-l1", title: "Sistema Digestório", description: "Como os alimentos são processados no corpo.", content: "Onde a comida é digerida? (Resposta: Estômago e intestinos).", type: "reading" },
              { id: "c1-l2", title: "Sistema Respiratório", description: "Como respiramos.", content: "Qual órgão usamos para respirar? (Resposta: Pulmões).", type: "exercise" }
            ]
          },
          {
            id: "c1-mod-2",
            title: "Cuidados e Saúde",
            lessons: [
              { id: "c1-l3", title: "Higiene e Hábitos Saudáveis", description: "Práticas para manter o corpo saudável.", content: "Por que é importante lavar as mãos antes de comer? (Resposta: Para remover germes).", type: "exercise" },
              { id: "c1-l4", title: "Experimento Simples", description: "Experimentos seguros para entender funções.", content: "Experimento: Encha um balão com um canudo para simular a respiração dos pulmões.", type: "exercise" }
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
              { id: "h1-l1", title: "Povos Indígenas", description: "Quem vivia no Brasil antes de 1500?", content: "Antes da chegada dos europeus, quem habitava o Brasil? (Resposta: Povos Indígenas).", type: "reading" },
              { id: "h1-l2", title: "Rotas e Viagens", description: "Como chegaram os portugueses?", content: "Quem liderou a frota portuguesa que chegou ao Brasil em 1500? (Resposta: Pedro Álvares Cabral).", type: "exercise" }
            ]
          },
          {
            id: "h1-mod-2",
            title: "Consequências",
            lessons: [
              { id: "h1-l3", title: "Impactos Culturais", description: "Mudanças geradas pelo encontro.", content: "Cite uma mudança que ocorreu na vida dos indígenas após a chegada dos portugueses.", type: "exercise" },
              { id: "h1-l4", title: "Revisão e Debate", description: "Questões para discutir em sala.", content: "Debate: O 'descobrimento' foi bom ou ruim para os povos que já viviam aqui?", type: "exercise" }
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
              { id: "g1-l1", title: "Mapa do Brasil", description: "Localize estados e capitais.", content: "Qual é a capital do estado de São Paulo? (Resposta: São Paulo).", type: "exercise" },
              { id: "g1-l2", title: "Curiosidades por Capital", description: "Fatos interessantes sobre capitais.", content: "Qual capital brasileira é famosa por ter o Cristo Redentor? (Resposta: Rio de Janeiro).", type: "reading" }
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
              { id: "i1-l1", title: "Cores em Inglês", description: "Nomes das cores e como usá-las.", content: "Como se diz 'azul' em inglês? (Resposta: Blue).", type: "exercise" },
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
              { id: "l1-l1", title: "Sequências Simples", description: "Identifique o próximo item.", content: "Qual é o próximo: 🔴, 🔵, 🔴, 🔵, ___? (Resposta: 🔴).", type: "exercise" },
              { id: "l1-l2", title: "Sequências com Cores", description: "Padrões coloridos.", content: "Qual é o próximo: 🟩, 🟨, 🟨, 🟩, 🟨, ___? (Resposta: 🟨).", type: "exercise" }
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
              { id: "a1-l1", title: "Conhecendo Pincéis", description: "Tipos de pincéis e usos.", content: "Qual pincel você usaria para pintar uma linha fina? (Resposta: Pincel fino/detalhe).", type: "reading" },
              { id: "a1-l2", title: "Criando um Personagem", description: "Do esboço à cor.", content: "Tarefa: Desenhe um monstro amigável usando apenas as cores primárias (vermelho, azul, amarelo).", type: "exercise" }
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
              { id: "mu1-l1", title: "Cordas e Sopro", description: "Identifique famílias de instrumentos.", content: "O violão é um instrumento de corda ou de sopro? (Resposta: Corda).", type: "exercise" },
              { id: "mu1-l2", title: "Ritmos Simples", description: "Marque o tempo com palmas.", content: "Bata palmas no ritmo da música que está tocando (Instrução para o pai/professor).", type: "exercise" }
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
              { id: "pr1-l1", title: "Sequência de Comandos", description: "Ordem de execução e instruções.", content: "Se você der os comandos 'Andar', 'Virar Esquerda', 'Andar', onde você termina? (Resposta: 2 passos à frente, virado para a esquerda).", type: "exercise" },
              { id: "pr1-l2", title: "Loops Simples", description: "Repetição com objetivos.", content: "O que acontece se você usar o comando 'Repetir 5 vezes: Pular'? (Resposta: Você pula 5 vezes).", type: "exercise" }
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
              { id: "r1-l1", title: "Sensores e Motores", description: "Tipos de sensores e funções.", content: "Qual peça faz o robô se mover? (Resposta: Motor).", type: "reading" },
              { id: "r1-l2", title: "Montagem Básica", description: "Monte a estrutura do robô.", content: "Tarefa: Desenhe um diagrama de um robô que possa detectar uma parede e parar.", type: "exercise" }
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
              { id: "f1-l1", title: "Renda e Despesas", description: "Entenda o que é renda e despesas.", content: "Se você ganha R$ 10 (renda) e gasta R$ 3 em doces (despesa), quanto sobra? (Resposta: R$ 7).", type: "exercise" },
              { id: "f1-l2", title: "Planejando uma Meta", description: "Defina uma meta de economia.", content: "Se você quer comprar um brinquedo de R$ 50 e economiza R$ 10 por semana, em quantas semanas você consegue comprar? (Resposta: 5 semanas).", type: "exercise" }
            ]
          }
        ]
      }
    ]
  }
];