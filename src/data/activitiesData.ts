import { IconName } from '@/components/Icon';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content?: string; // Agora armazena JSON string para QuizQuestions ou texto para leitura
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
              { id: "m1-l1", title: "Quantas maçãs? (1-3)", description: "Contando até 3 com maçãs.", content: JSON.stringify([
                { question: "Quantas maçãs 🍎🍎 você vê?", options: ["1", "2", "3"], correctAnswer: "2" },
                { question: "Qual número vem depois do 1?", options: ["3", "2", "4"], correctAnswer: "2" },
              ]), type: "exercise" },
              { id: "m1-l2", title: "Contando Maçãs (4-5)", description: "Expandindo até 5.", content: JSON.stringify([
                { question: "Quantos dedos você tem em uma mão?", options: ["3", "5", "10"], correctAnswer: "5" },
                { question: "Se você tem 3 bolas e ganha mais 1, quantas tem?", options: ["4", "3", "5"], correctAnswer: "4" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-atividades",
            title: "Atividades Interativas",
            description: "Jogos e desafios para fixação.",
            lessons: [
              { id: "m1-l3", title: "Jogo Rápido: Escolha o Número", description: "Escolha quantas maçãs aparecem.", content: "Clique no número correto.", type: "game" },
              { id: "m1-l4", title: "Desafio de Tempo", description: "Conte rapidamente para ganhar estrelas.", content: JSON.stringify([
                { question: "Se você tem 2 laranjas e 2 bananas, quantas frutas são?", options: ["3", "4", "5"], correctAnswer: "4" },
                { question: "Qual número está entre 4 e 6?", options: ["5", "7", "3"], correctAnswer: "5" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-revisao",
            title: "Revisão e Prática",
            description: "Reforce o que aprendeu com atividades variadas.",
            lessons: [
              { id: "m1-l5", title: "Mix de Frutas", description: "Conte diferentes frutas misturadas.", content: JSON.stringify([
                { question: "Se você tem 5 doces e come 2, quantos sobram?", options: ["3", "4", "2"], correctAnswer: "3" },
                { question: "Qual é o maior número: 1, 5 ou 3?", options: ["1", "5", "3"], correctAnswer: "5" },
              ]), type: "exercise" },
              { id: "m1-l6", title: "Autoavaliação", description: "Repita os exercícios que teve dificuldade.", content: JSON.stringify([
                { question: "Conte os círculos: ⭕⭕⭕", options: ["2", "3", "4"], correctAnswer: "3" },
                { question: "Qual número vem antes do 5?", options: ["6", "4", "3"], correctAnswer: "4" },
              ]), type: "exercise" }
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
              { id: "m2-l1", title: "O que é um círculo?", description: "Identifique círculos em imagens.", content: JSON.stringify([
                { question: "Qual forma é redonda como uma bola?", options: ["Quadrado", "Círculo", "Triângulo"], correctAnswer: "Círculo" },
                { question: "Quantos lados tem um triângulo?", options: ["4", "3", "2"], correctAnswer: "3" },
              ]), type: "exercise" },
              { id: "m2-l2", title: "Quadrados e Triângulos", description: "Compare formas básicas.", content: JSON.stringify([
                { question: "Qual forma tem 4 lados iguais?", options: ["Círculo", "Triângulo", "Quadrado"], correctAnswer: "Quadrado" },
                { question: "Uma fatia de pizza tem formato de:", options: ["Círculo", "Triângulo", "Quadrado"], correctAnswer: "Triângulo" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m2-mod-2",
            title: "Formas no Mundo",
            lessons: [
              { id: "m2-l3", title: "Formas em Casa", description: "Encontre objetos que representem cada forma.", content: JSON.stringify([
                { question: "Uma porta geralmente tem formato de:", options: ["Círculo", "Retângulo", "Triângulo"], correctAnswer: "Retângulo" },
                { question: "Um relógio de parede redondo tem formato de:", options: ["Quadrado", "Círculo", "Estrela"], correctAnswer: "Círculo" },
              ]), type: "exercise" },
              { id: "m2-l4", title: "Atividade Criativa", description: "Desenhe uma cena usando 5 formas diferentes.", content: "Tarefa: Desenhe uma casa usando um triângulo (telhado) e um quadrado (corpo).", type: "exercise" }
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
              { id: "m3-l1", title: "1+1 e 2+1", description: "Somando pequenas quantidades com blocos.", content: JSON.stringify([
                { question: "Quanto é 1 + 1?", options: ["3", "2", "1"], correctAnswer: "2" },
                { question: "Quanto é 2 + 1?", options: ["4", "3", "2"], correctAnswer: "3" },
              ]), type: "exercise" },
              { id: "m3-l2", title: "Objetos do Dia a Dia", description: "Some brinquedos e conte o total.", content: JSON.stringify([
                { question: "Você tem 3 carrinhos e 2 bonecas. Quantos brinquedos no total?", options: ["5", "6", "4"], correctAnswer: "5" },
                { question: "Se você tem 4 lápis e perde 1, quantos sobram?", options: ["3", "5", "2"], correctAnswer: "3" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m3-mod-visual",
            title: "Visualizando Somatórios",
            lessons: [
              { id: "m3-l3", title: "Barra de Somas", description: "Use barras para juntar números.", content: JSON.stringify([
                { question: "Quanto é 4 + 3?", options: ["6", "7", "8"], correctAnswer: "7" },
                { question: "Quanto é 5 + 5?", options: ["9", "10", "11"], correctAnswer: "10" },
              ]), type: "exercise" },
              { id: "m3-l4", title: "Problema com Figuras", description: "Pequenos problemas que ativam o raciocínio.", content: JSON.stringify([
                { question: "Havia 5 pássaros na árvore. 2 voaram. Quantos restaram?", options: ["3", "7", "2"], correctAnswer: "3" },
                { question: "João tem 6 adesivos. Maria tem 3. Quantos adesivos eles têm juntos?", options: ["8", "9", "10"], correctAnswer: "9" },
              ]), type: "exercise" }
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
              { id: "m4-l1", title: "Tabuada do 1 ao 5", description: "Aprenda com jogos e repetições.", content: JSON.stringify([
                { question: "Quanto é 3 x 4?", options: ["7", "12", "10"], correctAnswer: "12" },
                { question: "Quanto é 5 x 5?", options: ["20", "25", "30"], correctAnswer: "25" },
              ]), type: "exercise" },
              { id: "m4-l2", title: "Quiz Rápido", description: "Responda multiplicações simples.", content: JSON.stringify([
                { question: "Qual é o resultado de 2 x 7?", options: ["14", "9", "12"], correctAnswer: "14" },
                { question: "Quanto é 4 x 8?", options: ["32", "28", "36"], correctAnswer: "32" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m4-mod-2",
            title: "Velocidade e Precisão",
            lessons: [
              { id: "m4-l3", title: "Tabuada do 6 ao 10", description: "Continue a prática com suporte visual.", content: JSON.stringify([
                { question: "Quanto é 8 x 9?", options: ["72", "81", "64"], correctAnswer: "72" },
                { question: "Quanto é 6 x 6?", options: ["30", "36", "42"], correctAnswer: "36" },
              ]), type: "exercise" },
              { id: "m4-l4", title: "Desafio de 60s", description: "Quantas respostas corretas em 60s?", content: JSON.stringify([
                { question: "Quanto é 7 x 7?", options: ["49", "56", "42"], correctAnswer: "49" },
                { question: "Quanto é 9 x 10?", options: ["90", "100", "80"], correctAnswer: "90" },
              ]), type: "exercise" }
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
              { id: "m5-l2", title: "Dividindo Reais", description: "Se você dividir uma maçã em 4 partes iguais, cada parte é chamada de:", content: JSON.stringify([
                { question: "Se você dividir uma maçã em 4 partes iguais, cada parte é chamada de:", options: ["Um meio", "Um quarto", "Um terço"], correctAnswer: "Um quarto" },
                { question: "Qual fração representa metade de um bolo?", options: ["1/4", "1/2", "2/3"], correctAnswer: "1/2" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m5-mod-2",
            title: "Frações Equivalentes",
            lessons: [
              { id: "m5-l3", title: "Comparando Frações", description: "Identifique frações equivalentes.", content: JSON.stringify([
                { question: "Qual fração é igual a 1/2?", options: ["2/4", "1/3", "3/5"], correctAnswer: "2/4" },
                { question: "Qual é maior: 1/4 ou 3/4?", options: ["1/4", "3/4", "São iguais"], correctAnswer: "3/4" },
              ]), type: "exercise" },
              { id: "m5-l4", title: "Desafio Visual", description: "Jogo com comparação e equivalência.", content: JSON.stringify([
                { question: "Se 2/8 da pizza foi comida, qual fração equivalente sobrou?", options: ["1/4", "3/4", "1/2"], correctAnswer: "3/4" },
                { question: "Quantos 1/8 cabem em 1/2?", options: ["2", "4", "8"], correctAnswer: "4" },
              ]), type: "exercise" }
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
              { id: "m6-l1", title: "Desafios Iniciais", description: "Problemas simples de raciocínio.", content: JSON.stringify([
                { question: "Se um trem sai às 8h e viaja por 3 horas, a que horas ele chega?", options: ["10h", "11h", "12h"], correctAnswer: "11h" },
                { question: "Um pato, dois patos, quantos pés no total?", options: ["2", "4", "6"], correctAnswer: "4" },
              ]), type: "exercise" },
              { id: "m6-l2", title: "Pense em Etapas", description: "Divida problemas em passos.", content: JSON.stringify([
                { question: "Um fazendeiro tem 10 galinhas. Se ele vender 4 e comprar 2, quantas galinhas ele tem agora?", options: ["6", "8", "12"], correctAnswer: "8" },
                { question: "Se hoje é terça-feira, que dia será depois de amanhã?", options: ["Quarta", "Quinta", "Sexta"], correctAnswer: "Quinta" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m6-mod-2",
            title: "Raciocínio Composto",
            lessons: [
              { id: "m6-l3", title: "Problemas com Várias Etapas", description: "Desafios que exigem persistência.", content: JSON.stringify([
                { question: "Se o preço de um livro é R$ 20 e você tem um desconto de 10%, quanto você paga?", options: ["R$ 18", "R$ 19", "R$ 10"], correctAnswer: "R$ 18" },
                { question: "Um quadrado tem 4 lados. Se o perímetro é 24cm, qual é o tamanho de cada lado?", options: ["4cm", "6cm", "8cm"], correctAnswer: "6cm" },
              ]), type: "exercise" },
              { id: "m6-l4", title: "Resolução Criativa", description: "Encontre soluções alternativas.", content: JSON.stringify([
                { question: "Qual é o próximo número na sequência: 1, 4, 9, 16, ...?", options: ["20", "25", "30"], correctAnswer: "25" },
                { question: "Se 5 máquinas fazem 5 produtos em 5 minutos, quanto tempo 100 máquinas levam para fazer 100 produtos?", options: ["100 minutos", "5 minutos", "1 minuto"], correctAnswer: "5 minutos" },
              ]), type: "exercise" }
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
              { id: "m7-l2", title: "Perímetro Básico", description: "Meça e calcule perímetros.", content: JSON.stringify([
                { question: "Qual é o perímetro de um quadrado com lados de 5cm?", options: ["10cm", "20cm", "25cm"], correctAnswer: "20cm" },
                { question: "O que é perímetro?", options: ["A área interna", "A soma dos lados", "O centro da figura"], correctAnswer: "A soma dos lados" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "m7-mod-2",
            title: "Área e Aplicações",
            lessons: [
              { id: "m7-l3", title: "Área de Retângulos", description: "Calcule áreas simples.", content: JSON.stringify([
                { question: "Qual é a área de um retângulo com 4cm de largura e 6cm de comprimento?", options: ["10cm²", "24cm²", "12cm²"], correctAnswer: "24cm²" },
                { question: "A fórmula da área do retângulo é:", options: ["Lado + Lado", "Largura x Comprimento", "Lado x 4"], correctAnswer: "Largura x Comprimento" },
              ]), type: "exercise" },
              { id: "m7-l4", title: "Problemas do Mundo Real", description: "Aplicações práticas de área.", content: JSON.stringify([
                { question: "Se você precisa pintar uma parede de 3m x 4m, qual é a área total a ser pintada?", options: ["7m²", "12m²", "14m²"], correctAnswer: "12m²" },
                { question: "Se um tapete tem 2m x 3m, qual é a área dele?", options: ["5m²", "6m²", "9m²"], correctAnswer: "6m²" },
              ]), type: "exercise" }
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
              { id: "p1-l1", title: "A a Z - Sons Iniciais", description: "Associe letras a sons e imagens.", content: JSON.stringify([
                { question: "Qual letra começa a palavra 'BOLA'?", options: ["P", "B", "D"], correctAnswer: "B" },
                { question: "Qual letra faz o som de 'M' de 'MACACO'?", options: ["N", "M", "P"], correctAnswer: "M" },
              ]), type: "exercise" },
              { id: "p1-l2", title: "Letras em Palavras", description: "Identifique letras no começo das palavras.", content: JSON.stringify([
                { question: "Qual é a primeira letra da palavra 'CASA'?", options: ["S", "C", "A"], correctAnswer: "C" },
                { question: "Qual é a última letra da palavra 'PATO'?", options: ["O", "A", "T"], correctAnswer: "O" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "p1-mod-2",
            title: "Brincando com Letras",
            lessons: [
              { id: "p1-l3", title: "Montando Palavras Simples", description: "Junte letras para formar palavras curto.", content: JSON.stringify([
                { question: "Junte as letras L-U-A. Qual palavra você formou?", options: ["SOL", "LUA", "RUA"], correctAnswer: "LUA" },
                { question: "Qual palavra tem 3 letras?", options: ["CASA", "PÉ", "JANELA"], correctAnswer: "PÉ" },
              ]), type: "exercise" },
              { id: "p1-l4", title: "Caça às Letras", description: "Localize letras em textos curtos.", content: JSON.stringify([
                { question: "Na frase 'O gato comeu o peixe.', quantas vezes a letra 'O' aparece?", options: ["1", "2", "3"], correctAnswer: "3" },
                { question: "Qual palavra na frase 'A menina é feliz' é um nome?", options: ["A", "menina", "feliz"], correctAnswer: "menina" },
              ]), type: "exercise" }
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
              { id: "p2-l1", title: "Dividindo em Sílabas", description: "Entenda a separação por sílaba.", content: JSON.stringify([
                { question: "Quantas sílabas tem a palavra 'PATO'?", options: ["1", "2", "3"], correctAnswer: "2" },
                { question: "Qual sílaba falta para formar 'CA___LO'?", options: ["SA", "VA", "VA"], correctAnswer: "VA" },
              ]), type: "exercise" },
              { id: "p2-l2", title: "Sílabas e Sons", description: "Combine sílabas para formar palavras.", content: JSON.stringify([
                { question: "Junte as sílabas 'CA' e 'LO'. Qual palavra você formou?", options: ["CALO", "CASA", "COLA"], correctAnswer: "CALO" },
                { question: "Qual palavra é formada por 'MA' e 'LÁ'?", options: ["MALA", "LAMA", "MOLA"], correctAnswer: "MALA" },
              ]), type: "exercise" }
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
              { id: "p3-l1", title: "Rimas Simples", description: "Encontre pares que rimam.", content: JSON.stringify([
                { question: "Qual palavra rima com 'PÃO'?", options: ["GATO", "MÃO", "BOLA"], correctAnswer: "MÃO" },
                { question: "Qual palavra rima com 'FOGUETE'?", options: ["PLANETA", "CHICLETE", "ESTRELA"], correctAnswer: "CHICLETE" },
              ]), type: "exercise" },
              { id: "p3-l2", title: "Crie Sua Rima", description: "Escreva rimas simples.", content: JSON.stringify([
                { question: "Complete a frase: 'O sapo pulou no _____' (Sugestão: RIO)", options: ["LAGO", "RIO", "MAR"], correctAnswer: "RIO" },
                { question: "Qual palavra rima com 'CÃO'?", options: ["PÉ", "BALÃO", "SOL"], correctAnswer: "BALÃO" },
              ]), type: "exercise" }
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
              { id: "p4-l1", title: "Leia e Responda", description: "Perguntas de múltipla escolha sobre o texto.", content: "Texto: 'O cachorro Rex gosta de correr no parque. Ele é marrom e muito rápido.' Pergunta: De que cor é o cachorro Rex?", options: ["Preto", "Branco", "Marrom"], correctAnswer: "Marrom" },
              { id: "p4-l2", title: "Resumo do Texto", description: "Aprenda a resumir ideias principais.", content: "Texto: 'A tartaruga e o coelho fizeram uma corrida. O coelho parou para dormir e a tartaruga, devagar, ganhou.' Pergunta: Quem ganhou a corrida?", options: ["O coelho", "A tartaruga", "Ninguém"], correctAnswer: "A tartaruga" },
            ].map(q => ({ ...q, content: JSON.stringify([q]) })).map(q => q.content).join(''), type: "exercise" }
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
              { id: "p5-l1", title: "Acentos Básicos", description: "Regras de acentuação.", content: JSON.stringify([
                { question: "Qual palavra precisa de acento: 'cafe' ou 'mesa'?", options: ["MESA", "CAFÉ", "BOLO"], correctAnswer: "CAFÉ" },
                { question: "Qual é o acento usado na palavra 'VÔO'?", options: ["Agudo", "Circunflexo", "Til"], correctAnswer: "Circunflexo" },
              ]), type: "exercise" },
              { id: "p5-l2", title: "Exercícios Práticos", description: "Aplique as regras em palavras reais.", content: JSON.stringify([
                { question: "Acentue corretamente: 'voce'", options: ["VOCE", "VOCÊ", "VOCÊS"], correctAnswer: "VOCÊ" },
                { question: "Acentue corretamente: 'arvore'", options: ["ARVORE", "ÁRVORE", "ARVORE"], correctAnswer: "ÁRVORE" },
              ]), type: "exercise" }
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
              { id: "p6-l1", title: "Identificando Substantivos", description: "Marque substantivos em frases.", content: JSON.stringify([
                { question: "Na frase 'O menino comeu a maçã', qual é o substantivo?", options: ["comeu", "menino", "a"], correctAnswer: "menino" },
                { question: "Qual palavra é um verbo (ação)?", options: ["CASA", "CORRER", "AZUL"], correctAnswer: "CORRER" },
              ]), type: "exercise" },
              { id: "p6-l2", title: "Transformando Frases", description: "Use adjetivos para enriquecer frases.", content: JSON.stringify([
                { question: "Qual palavra é um adjetivo (qualidade)?", options: ["PULAR", "FELIZ", "MESA"], correctAnswer: "FELIZ" },
                { question: "Na frase 'O carro é rápido', qual é o adjetivo?", options: ["carro", "é", "rápido"], correctAnswer: "rápido" },
              ]), type: "exercise" }
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
              { id: "p7-l1", title: "Planejando a História", description: "Estruture início, meio e fim.", content: "Pergunta: Qual é a primeira parte de uma história? (Resposta: Início/Introdução)", options: ["Meio", "Fim", "Início/Introdução"], correctAnswer: "Início/Introdução" },
              { id: "p7-l2", title: "Escrevendo com Emoção", description: "Use adjetivos e verbos para dar vida ao texto.", content: "Pergunta: Qual verbo é mais forte que 'andou rápido'? (Resposta: Disparou)", options: ["Caminhou", "Disparou", "Parou"], correctAnswer: "Disparou" },
            ].map(q => ({ ...q, content: JSON.stringify([q]) })).map(q => q.content).join(''), type: "exercise" }
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
              { id: "c1-l2", title: "Sistema Respiratório", description: "Como respiramos.", content: JSON.stringify([
                { question: "Qual órgão usamos para respirar?", options: ["Coração", "Pulmões", "Estômago"], correctAnswer: "Pulmões" },
                { question: "O que o corpo absorve do ar?", options: ["Gás carbônico", "Oxigênio", "Água"], correctAnswer: "Oxigênio" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "c1-mod-2",
            title: "Cuidados e Saúde",
            lessons: [
              { id: "c1-l3", title: "Higiene e Hábitos Saudáveis", description: "Práticas para manter o corpo saudável.", content: JSON.stringify([
                { question: "Por que é importante lavar as mãos antes de comer?", options: ["Para secar as mãos", "Para remover germes", "Para esfriar as mãos"], correctAnswer: "Para remover germes" },
                { question: "Qual alimento é bom para os ossos?", options: ["Refrigerante", "Leite", "Doce"], correctAnswer: "Leite" },
              ]), type: "exercise" },
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
              { id: "h1-l2", title: "Rotas e Viagens", description: "Como chegaram os portugueses?", content: JSON.stringify([
                { question: "Quem liderou a frota portuguesa que chegou ao Brasil em 1500?", options: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama"], correctAnswer: "Pedro Álvares Cabral" },
                { question: "Em que ano o Brasil foi 'descoberto' pelos portugueses?", options: ["1492", "1500", "1600"], correctAnswer: "1500" },
              ]), type: "exercise" }
            ]
          },
          {
            id: "h1-mod-2",
            title: "Consequências",
            lessons: [
              { id: "h1-l3", title: "Impactos Culturais", description: "Mudanças geradas pelo encontro.", content: JSON.stringify([
                { question: "Qual foi um grande impacto da chegada dos portugueses para os indígenas?", options: ["Aumento da população", "Perda de terras", "Novos animais de estimação"], correctAnswer: "Perda de terras" },
                { question: "O que os portugueses buscavam nas novas terras?", options: ["Ouro e especiarias", "Novos amigos", "Livros"], correctAnswer: "Ouro e especiarias" },
              ]), type: "exercise" },
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
              { id: "g1-l1", title: "Mapa do Brasil", description: "Localize estados e capitais.", content: JSON.stringify([
                { question: "Qual é a capital do estado de São Paulo?", options: ["Campinas", "Rio de Janeiro", "São Paulo"], correctAnswer: "São Paulo" },
                { question: "Qual é a capital do Brasil?", options: ["Rio de Janeiro", "Brasília", "Salvador"], correctAnswer: "Brasília" },
              ]), type: "exercise" },
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
              { id: "i1-l1", title: "Cores em Inglês", description: "Nomes das cores e como usá-las.", content: JSON.stringify([
                { question: "Como se diz 'azul' em inglês?", options: ["Red", "Blue", "Green"], correctAnswer: "Blue" },
                { question: "Qual cor é 'Yellow'?", options: ["Vermelho", "Amarelo", "Verde"], correctAnswer: "Amarelo" },
              ]), type: "exercise" },
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
              { id: "l1-l1", title: "Sequências Simples", description: "Identifique o próximo item.", content: JSON.stringify([
                { question: "Qual é o próximo: 🔴, 🔵, 🔴, 🔵, ___?", options: ["🔵", "🔴", "🟢"], correctAnswer: "🔴" },
                { question: "Qual é o próximo: 1, 2, 3, 4, ___?", options: ["5", "6", "7"], correctAnswer: "5" },
              ]), type: "exercise" },
              { id: "l1-l2", title: "Sequências com Cores", description: "Padrões coloridos.", content: JSON.stringify([
                { question: "Qual é o próximo: 🟩, 🟨, 🟨, 🟩, 🟨, ___?", options: ["🟨", "🟩", "🟦"], correctAnswer: "🟨" },
                { question: "Qual é o próximo: A, B, C, D, ___?", options: ["E", "F", "G"], correctAnswer: "E" },
              ]), type: "exercise" }
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
              { id: "a1-l2", title: "Criando um Personagem", description: "Do esboço à cor.", content: JSON.stringify([
                { question: "Quais são as cores primárias?", options: ["Roxo, Verde, Laranja", "Vermelho, Azul, Amarelo", "Preto, Branco, Cinza"], correctAnswer: "Vermelho, Azul, Amarelo" },
                { question: "Misturando azul e amarelo, qual cor obtemos?", options: ["Roxo", "Verde", "Laranja"], correctAnswer: "Verde" },
              ]), type: "exercise" }
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
              { id: "mu1-l1", title: "Cordas e Sopro", description: "Identifique famílias de instrumentos.", content: JSON.stringify([
                { question: "O violão é um instrumento de:", options: ["Sopro", "Percussão", "Corda"], correctAnswer: "Corda" },
                { question: "Qual instrumento é tocado soprando?", options: ["Bateria", "Flauta", "Piano"], correctAnswer: "Flauta" },
              ]), type: "exercise" },
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
              { id: "pr1-l1", title: "Sequência de Comandos", description: "Ordem de execução e instruções.", content: JSON.stringify([
                { question: "Se você der os comandos 'Andar', 'Virar Esquerda', 'Andar', onde você termina?", options: ["No mesmo lugar", "Virado para a direita", "2 passos à frente, virado para a esquerda"], correctAnswer: "2 passos à frente, virado para a esquerda" },
                { question: "O que é um algoritmo?", options: ["Um tipo de robô", "Uma sequência de passos para resolver um problema", "Um código secreto"], correctAnswer: "Uma sequência de passos para resolver um problema" },
              ]), type: "exercise" },
              { id: "pr1-l2", title: "Loops Simples", description: "Repetição com objetivos.", content: JSON.stringify([
                { question: "O que acontece se você usar o comando 'Repetir 5 vezes: Pular'?", options: ["Você pula 1 vez", "Você pula 5 vezes", "O programa trava"], correctAnswer: "Você pula 5 vezes" },
                { question: "Um 'loop' serve para:", options: ["Parar o programa", "Repetir uma ação", "Mudar a cor"], correctAnswer: "Repetir uma ação" },
              ]), type: "exercise" }
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
              { id: "r1-l2", title: "Montagem Básica", description: "Monte a estrutura do robô.", content: JSON.stringify([
                { question: "Qual componente do robô detecta obstáculos?", options: ["Motor", "Sensor", "Bateria"], correctAnswer: "Sensor" },
                { question: "O que a bateria fornece ao robô?", options: ["Peças", "Energia", "Instruções"], correctAnswer: "Energia" },
              ]), type: "exercise" }
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
              { id: "f1-l1", title: "Renda e Despesas", description: "Entenda o que é renda e despesas.", content: JSON.stringify([
                { question: "Se você ganha R$ 10 (renda) e gasta R$ 3 em doces (despesa), quanto sobra?", options: ["R$ 13", "R$ 7", "R$ 3"], correctAnswer: "R$ 7" },
                { question: "O que é 'renda'?", options: ["Dinheiro que você gasta", "Dinheiro que você recebe", "Dinheiro que você economiza"], correctAnswer: "Dinheiro que você recebe" },
              ]), type: "exercise" },
              { id: "f1-l2", title: "Planejando uma Meta", description: "Defina uma meta de economia.", content: JSON.stringify([
                { question: "Se você quer comprar um brinquedo de R$ 50 e economiza R$ 10 por semana, em quantas semanas você consegue comprar?", options: ["4 semanas", "5 semanas", "10 semanas"], correctAnswer: "5 semanas" },
                { question: "O que significa 'poupar'?", options: ["Gastar tudo", "Guardar dinheiro para o futuro", "Comprar doces"], correctAnswer: "Guardar dinheiro para o futuro" },
              ]), type: "exercise" }
            ]
          }
        ]
      }
    ]
  }
];