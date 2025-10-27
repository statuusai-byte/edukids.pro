import { IconName } from '@/components/Icon';
import { QuizQuestion } from '@/components/QuizComponent'; // Importando o tipo para clareza

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

// Conteúdo de Quiz para reuso (melhorando a qualidade das perguntas)
const quizM1L1: QuizQuestion[] = [
  { question: "Quantas maçãs 🍎🍎 você vê?", options: ["1", "2", "3"], correctAnswer: "2" },
  { question: "Qual número vem imediatamente depois do 1?", options: ["3", "2", "4"], correctAnswer: "2" },
];
const quizM1L2: QuizQuestion[] = [
  { question: "Se você tem 3 bolas e ganha mais 1, quantas tem no total?", options: ["4", "3", "5"], correctAnswer: "4" },
  { question: "Qual número está entre 4 e 6?", options: ["5", "7", "3"], correctAnswer: "5" },
];
const quizM1L4: QuizQuestion[] = [
  { question: "Se você tem 2 laranjas e 2 bananas, quantas frutas são?", options: ["3", "4", "5"], correctAnswer: "4" },
  { question: "Qual número é maior que 5, mas menor que 7?", options: ["5", "6", "7"], correctAnswer: "6" },
];
const quizM1L5: QuizQuestion[] = [
  { question: "Se você tem 5 doces e come 2, quantos sobram?", options: ["3", "4", "2"], correctAnswer: "3" },
  { question: "Qual é o maior número: 1, 5 ou 3?", options: ["1", "5", "3"], correctAnswer: "5" },
];
const quizM1L6: QuizQuestion[] = [
  { question: "Conte os círculos: ⭕⭕⭕", options: ["2", "3", "4"], correctAnswer: "3" },
  { question: "Qual número vem antes do 5?", options: ["6", "4", "3"], correctAnswer: "4" },
];

const quizM2L1: QuizQuestion[] = [
  { question: "Qual forma é redonda como uma bola?", options: ["Quadrado", "Círculo", "Triângulo"], correctAnswer: "Círculo" },
  { question: "Quantos lados tem um triângulo?", options: ["4", "3", "2"], correctAnswer: "3" },
];
const quizM2L2: QuizQuestion[] = [
  { question: "Qual forma tem 4 lados iguais?", options: ["Círculo", "Triângulo", "Quadrado"], correctAnswer: "Quadrado" },
  { question: "Uma fatia de pizza tem formato de:", options: ["Círculo", "Triângulo", "Quadrado"], correctAnswer: "Triângulo" },
];
const quizM2L3: QuizQuestion[] = [
  { question: "Uma porta geralmente tem formato de:", options: ["Círculo", "Retângulo", "Triângulo"], correctAnswer: "Retângulo" },
  { question: "Um relógio de parede redondo tem formato de:", options: ["Quadrado", "Círculo", "Estrela"], correctAnswer: "Círculo" },
];

const quizM3L1: QuizQuestion[] = [
  { question: "Quanto é 1 + 1?", options: ["3", "2", "1"], correctAnswer: "2" },
  { question: "Quanto é 2 + 1?", options: ["4", "3", "2"], correctAnswer: "3" },
];
const quizM3L2: QuizQuestion[] = [
  { question: "Você tem 3 carrinhos e 2 bonecas. Quantos brinquedos no total?", options: ["5", "6", "4"], correctAnswer: "5" },
  { question: "Se você tem 4 lápis e perde 1, quantos sobram?", options: ["3", "5", "2"], correctAnswer: "3" },
];
const quizM3L3: QuizQuestion[] = [
  { question: "Quanto é 4 + 3?", options: ["6", "7", "8"], correctAnswer: "7" },
  { question: "Quanto é 5 + 5?", options: ["9", "10", "11"], correctAnswer: "10" },
];
const quizM3L4: QuizQuestion[] = [
  { question: "Havia 5 pássaros na árvore. 2 voaram. Quantos restaram?", options: ["3", "7", "2"], correctAnswer: "3" },
  { question: "João tem 6 adesivos. Maria tem 3. Quantos adesivos eles têm juntos?", options: ["8", "9", "10"], correctAnswer: "9" },
];

const quizM4L1: QuizQuestion[] = [
  { question: "Quanto é 3 x 4?", options: ["7", "12", "10"], correctAnswer: "12" },
  { question: "Quanto é 5 x 5?", options: ["20", "25", "30"], correctAnswer: "25" },
];
const quizM4L2: QuizQuestion[] = [
  { question: "Qual é o resultado de 2 x 7?", options: ["14", "9", "12"], correctAnswer: "14" },
  { question: "Quanto é 4 x 8?", options: ["32", "28", "36"], correctAnswer: "32" },
];
const quizM4L3: QuizQuestion[] = [
  { question: "Quanto é 8 x 9?", options: ["72", "81", "64"], correctAnswer: "72" },
  { question: "Quanto é 6 x 6?", options: ["30", "36", "42"], correctAnswer: "36" },
];
const quizM4L4: QuizQuestion[] = [
  { question: "Quanto é 7 x 7?", options: ["49", "56", "42"], correctAnswer: "49" },
  { question: "Quanto é 9 x 10?", options: ["90", "100", "80"], correctAnswer: "90" },
];

const quizM5L2: QuizQuestion[] = [
  { question: "Se você dividir uma maçã em 4 partes iguais, cada parte é chamada de:", options: ["Um meio", "Um quarto", "Um terço"], correctAnswer: "Um quarto" },
  { question: "Qual fração representa metade de um bolo?", options: ["1/4", "1/2", "2/3"], correctAnswer: "1/2" },
];
const quizM5L3: QuizQuestion[] = [
  { question: "Qual fração é igual a 1/2?", options: ["2/4", "1/3", "3/5"], correctAnswer: "2/4" },
  { question: "Qual é maior: 1/4 ou 3/4?", options: ["1/4", "3/4", "São iguais"], correctAnswer: "3/4" },
];
const quizM5L4: QuizQuestion[] = [
  { question: "Se 2/8 da pizza foi comida, qual fração equivalente sobrou?", options: ["1/4", "3/4", "1/2"], correctAnswer: "3/4" },
  { question: "Quantos 1/8 cabem em 1/2?", options: ["2", "4", "8"], correctAnswer: "4" },
];

const quizM6L1: QuizQuestion[] = [
  { question: "Se um trem sai às 8h e viaja por 3 horas, a que horas ele chega?", options: ["10h", "11h", "12h"], correctAnswer: "11h" },
  { question: "Um pato, dois patos, quantos pés no total?", options: ["2", "4", "6"], correctAnswer: "4" },
];
const quizM6L2: QuizQuestion[] = [
  { question: "Um fazendeiro tem 10 galinhas. Se ele vender 4 e comprar 2, quantas galinhas ele tem agora?", options: ["6", "8", "12"], correctAnswer: "8" },
  { question: "Se hoje é terça-feira, que dia será depois de amanhã?", options: ["Quarta", "Quinta", "Sexta"], correctAnswer: "Quinta" },
];
const quizM6L3: QuizQuestion[] = [
  { question: "Se o preço de um livro é R$ 20 e você tem um desconto de 10%, quanto você paga?", options: ["R$ 18", "R$ 19", "R$ 10"], correctAnswer: "R$ 18" },
  { question: "Um quadrado tem 4 lados. Se o perímetro é 24cm, qual é o tamanho de cada lado?", options: ["4cm", "6cm", "8cm"], correctAnswer: "6cm" },
];
const quizM6L4: QuizQuestion[] = [
  { question: "Qual é o próximo número na sequência: 1, 4, 9, 16, ...?", options: ["20", "25", "30"], correctAnswer: "25" },
  { question: "Se 5 máquinas fazem 5 produtos em 5 minutos, quanto tempo 100 máquinas levam para fazer 100 produtos?", options: ["100 minutos", "5 minutos", "1 minuto"], correctAnswer: "5 minutos" },
];

const quizM7L2: QuizQuestion[] = [
  { question: "Qual é o perímetro de um quadrado com lados de 5cm?", options: ["10cm", "20cm", "25cm"], correctAnswer: "20cm" },
  { question: "O que é perímetro?", options: ["A área interna", "A soma dos lados", "O centro da figura"], correctAnswer: "A soma dos lados" },
];
const quizM7L3: QuizQuestion[] = [
  { question: "Qual é a área de um retângulo com 4cm de largura e 6cm de comprimento?", options: ["10cm²", "24cm²", "12cm²"], correctAnswer: "24cm²" },
  { question: "A fórmula da área do retângulo é:", options: ["Lado + Lado", "Largura x Comprimento", "Lado x 4"], correctAnswer: "Largura x Comprimento" },
];
const quizM7L4: QuizQuestion[] = [
  { question: "Se você precisa pintar uma parede de 3m x 4m, qual é a área total a ser pintada?", options: ["7m²", "12m²", "14m²"], correctAnswer: "12m²" },
  { question: "Se um tapete tem 2m x 3m, qual é a área dele?", options: ["5m²", "6m²", "9m²"], correctAnswer: "6m²" },
];

const quizP1L1: QuizQuestion[] = [
  { question: "Qual letra começa a palavra 'BOLA'?", options: ["P", "B", "D"], correctAnswer: "B" },
  { question: "Qual letra faz o som de 'M' de 'MACACO'?", options: ["N", "M", "P"], correctAnswer: "M" },
];
const quizP1L2: QuizQuestion[] = [
  { question: "Qual é a primeira letra da palavra 'CASA'?", options: ["S", "C", "A"], correctAnswer: "C" },
  { question: "Qual é a última letra da palavra 'PATO'?", options: ["O", "A", "T"], correctAnswer: "O" },
];
const quizP1L3: QuizQuestion[] = [
  { question: "Junte as letras L-U-A. Qual palavra você formou?", options: ["SOL", "LUA", "RUA"], correctAnswer: "LUA" },
  { question: "Qual palavra tem 3 letras?", options: ["CASA", "PÉ", "JANELA"], correctAnswer: "PÉ" },
];
const quizP1L4: QuizQuestion[] = [
  { question: "Na frase 'O gato comeu o peixe.', quantas vezes a letra 'O' aparece?", options: ["1", "2", "3"], correctAnswer: "3" },
  { question: "Qual palavra na frase 'A menina é feliz' é um nome (substantivo)?", options: ["A", "menina", "feliz"], correctAnswer: "menina" },
];

const quizP2L1: QuizQuestion[] = [
  { question: "Quantas sílabas tem a palavra 'PATO'?", options: ["1", "2", "3"], correctAnswer: "2" },
  { question: "Qual sílaba falta para formar 'CA___LO'?", options: ["SA", "VA", "VA"], correctAnswer: "VA" },
];
const quizP2L2: QuizQuestion[] = [
  { question: "Junte as sílabas 'CA' e 'LO'. Qual palavra você formou?", options: ["CALO", "CASA", "COLA"], correctAnswer: "CALO" },
  { question: "Qual palavra é formada por 'MA' e 'LÁ'?", options: ["MALA", "LAMA", "MOLA"], correctAnswer: "MALA" },
];

const quizP3L1: QuizQuestion[] = [
  { question: "Qual palavra rima com 'PÃO'?", options: ["GATO", "MÃO", "BOLA"], correctAnswer: "MÃO" },
  { question: "Qual palavra rima com 'FOGUETE'?", options: ["PLANETA", "CHICLETE", "ESTRELA"], correctAnswer: "CHICLETE" },
];
const quizP3L2: QuizQuestion[] = [
  { question: "Qual palavra rima com 'CÃO'?", options: ["PÉ", "BALÃO", "SOL"], correctAnswer: "BALÃO" },
  { question: "Complete a frase: 'O sapo pulou no _____' (Sugestão: RIO)", options: ["LAGO", "RIO", "MAR"], correctAnswer: "RIO" },
];

const quizP4L1: QuizQuestion[] = [
  { question: "O cachorro Rex gosta de correr no parque. Ele é marrom e muito rápido. Pergunta: De que cor é o cachorro Rex?", options: ["Preto", "Branco", "Marrom"], correctAnswer: "Marrom" },
  { question: "Qual é a ideia principal do texto: 'O sol nasceu, os pássaros cantaram e o dia começou feliz'?", options: ["O sol é quente", "O dia começou", "Os pássaros cantam"], correctAnswer: "O dia começou" },
];
const quizP4L2: QuizQuestion[] = [
  { question: "A tartaruga e o coelho fizeram uma corrida. O coelho parou para dormir e a tartaruga, devagar, ganhou. Pergunta: Quem ganhou a corrida?", options: ["O coelho", "A tartaruga", "Ninguém"], correctAnswer: "A tartaruga" },
  { question: "Qual lição podemos tirar da história da tartaruga e do coelho?", options: ["Correr é melhor", "A pressa é inimiga da perfeição", "Coelhos dormem muito"], correctAnswer: "A pressa é inimiga da perfeição" },
];

const quizP5L1: QuizQuestion[] = [
  { question: "Qual palavra precisa de acento: 'cafe' ou 'mesa'?", options: ["MESA", "CAFÉ", "BOLO"], correctAnswer: "CAFÉ" },
  { question: "Qual é o acento usado na palavra 'VÔO'?", options: ["Agudo", "Circunflexo", "Til"], correctAnswer: "Circunflexo" },
];
const quizP5L2: QuizQuestion[] = [
  { question: "Acentue corretamente: 'voce'", options: ["VOCE", "VOCÊ", "VOCÊS"], correctAnswer: "VOCÊ" },
  { question: "Acentue corretamente: 'arvore'", options: ["ARVORE", "ÁRVORE", "ARVORE"], correctAnswer: "ÁRVORE" },
];

const quizP6L1: QuizQuestion[] = [
  { question: "Na frase 'O menino comeu a maçã', qual é o substantivo?", options: ["comeu", "menino", "a"], correctAnswer: "menino" },
  { question: "Qual palavra é um verbo (ação)?", options: ["CASA", "CORRER", "AZUL"], correctAnswer: "CORRER" },
];
const quizP6L2: QuizQuestion[] = [
  { question: "Qual palavra é um adjetivo (qualidade)?", options: ["PULAR", "FELIZ", "MESA"], correctAnswer: "FELIZ" },
  { question: "Na frase 'O carro é rápido', qual é o adjetivo?", options: ["carro", "é", "rápido"], correctAnswer: "rápido" },
];

const quizP7L1: QuizQuestion[] = [
  { question: "Qual é a primeira parte de uma história?", options: ["Meio", "Fim", "Início/Introdução"], correctAnswer: "Início/Introdução" },
  { question: "O que define o 'conflito' de uma história?", options: ["O final feliz", "O problema principal", "A descrição do personagem"], correctAnswer: "O problema principal" },
];
const quizP7L2: QuizQuestion[] = [
  { question: "Qual verbo é mais forte que 'andou rápido'?", options: ["Caminhou", "Disparou", "Parou"], correctAnswer: "Disparou" },
  { question: "O que um adjetivo faz?", options: ["Indica uma ação", "Dá nome a algo", "Dá qualidade a um substantivo"], correctAnswer: "Dá qualidade a um substantivo" },
];

const quizC1L2: QuizQuestion[] = [
  { question: "Qual órgão usamos para respirar?", options: ["Coração", "Pulmões", "Estômago"], correctAnswer: "Pulmões" },
  { question: "O que o corpo absorve do ar?", options: ["Gás carbônico", "Oxigênio", "Água"], correctAnswer: "Oxigênio" },
];
const quizC1L3: QuizQuestion[] = [
  { question: "Por que é importante lavar as mãos antes de comer?", options: ["Para secar as mãos", "Para remover germes", "Para esfriar as mãos"], correctAnswer: "Para remover germes" },
  { question: "Qual alimento é bom para os ossos?", options: ["Refrigerante", "Leite", "Doce"], correctAnswer: "Leite" },
];

const quizH1L2: QuizQuestion[] = [
  { question: "Quem liderou a frota portuguesa que chegou ao Brasil em 1500?", options: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama"], correctAnswer: "Pedro Álvares Cabral" },
  { question: "Em que ano o Brasil foi 'descoberto' pelos portugueses?", options: ["1492", "1500", "1600"], correctAnswer: "1500" },
];
const quizH1L3: QuizQuestion[] = [
  { question: "Qual foi um grande impacto da chegada dos portugueses para os indígenas?", options: ["Aumento da população", "Perda de terras", "Novos animais de estimação"], correctAnswer: "Perda de terras" },
  { question: "O que os portugueses buscavam nas novas terras?", options: ["Ouro e especiarias", "Novos amigos", "Livros"], correctAnswer: "Ouro e especiarias" },
];

const quizG1L1: QuizQuestion[] = [
  { question: "Qual é a capital do estado de São Paulo?", options: ["Campinas", "Rio de Janeiro", "São Paulo"], correctAnswer: "São Paulo" },
  { question: "Qual é a capital do Brasil?", options: ["Rio de Janeiro", "Brasília", "Salvador"], correctAnswer: "Brasília" },
];

const quizI1L1: QuizQuestion[] = [
  { question: "Como se diz 'azul' em inglês?", options: ["Red", "Blue", "Green"], correctAnswer: "Blue" },
  { question: "Qual cor é 'Yellow'?", options: ["Vermelho", "Amarelo", "Verde"], correctAnswer: "Amarelo" },
];

const quizL1L1: QuizQuestion[] = [
  { question: "Qual é o próximo: 🔴, 🔵, 🔴, 🔵, ___?", options: ["🔵", "🔴", "🟢"], correctAnswer: "🔴" },
  { question: "Qual é o próximo: 1, 4, 7, 10, ___?", options: ["11", "13", "14"], correctAnswer: "13" },
];

const quizA1L2: QuizQuestion[] = [
  { question: "Quais são as cores primárias?", options: ["Roxo, Verde, Laranja", "Vermelho, Azul, Amarelo", "Preto, Branco, Cinza"], correctAnswer: "Vermelho, Azul, Amarelo" },
  { question: "Misturando azul e amarelo, qual cor obtemos?", options: ["Roxo", "Verde", "Laranja"], correctAnswer: "Verde" },
];

const quizMu1L1: QuizQuestion[] = [
  { question: "O violão é um instrumento de:", options: ["Sopro", "Percussão", "Corda"], correctAnswer: "Corda" },
  { question: "Qual instrumento é tocado soprando?", options: ["Bateria", "Flauta", "Piano"], correctAnswer: "Flauta" },
];

const quizPr1L1: QuizQuestion[] = [
  { question: "Se você der os comandos 'Andar', 'Virar Esquerda', 'Andar', onde você termina?", options: ["No mesmo lugar", "Virado para a direita", "2 passos à frente, virado para a esquerda"], correctAnswer: "2 passos à frente, virado para a esquerda" },
  { question: "O que é um algoritmo?", options: ["Um tipo de robô", "Uma sequência de passos para resolver um problema", "Um código secreto"], correctAnswer: "Uma sequência de passos para resolver um problema" },
];
const quizPr1L2: QuizQuestion[] = [
  { question: "O que acontece se você usar o comando 'Repetir 5 vezes: Pular'?", options: ["Você pula 1 vez", "Você pula 5 vezes", "O programa trava"], correctAnswer: "Você pula 5 vezes" },
  { question: "Um 'loop' serve para:", options: ["Parar o programa", "Repetir uma ação", "Mudar a cor"], correctAnswer: "Repetir uma ação" },
];

const quizR1L2: QuizQuestion[] = [
  { question: "Qual componente do robô detecta obstáculos?", options: ["Motor", "Sensor", "Bateria"], correctAnswer: "Sensor" },
  { question: "O que a bateria fornece ao robô?", options: ["Peças", "Energia", "Instruções"], correctAnswer: "Energia" },
];

const quizF1L1: QuizQuestion[] = [
  { question: "Se você ganha R$ 10 (renda) e gasta R$ 3 em doces (despesa), quanto sobra?", options: ["R$ 13", "R$ 7", "R$ 3"], correctAnswer: "R$ 7" },
  { question: "O que é 'renda'?", options: ["Dinheiro que você gasta", "Dinheiro que você recebe", "Dinheiro que você economiza"], correctAnswer: "Dinheiro que você recebe" },
];
const quizF1L2: QuizQuestion[] = [
  { question: "Se você quer comprar um brinquedo de R$ 50 e economiza R$ 10 por semana, em quantas semanas você consegue comprar?", options: ["4 semanas", "5 semanas", "10 semanas"], correctAnswer: "5 semanas" },
  { question: "O que significa 'poupar'?", options: ["Gastar tudo", "Guardar dinheiro para o futuro", "Comprar doces"], correctAnswer: "Guardar dinheiro para o futuro" },
];


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
        title: "Contagem e Reconhecimento Numérico",
        description: "Desenvolvimento da percepção quantitativa e associação de números a quantidades concretas.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m1-mod-intro",
            title: "Números 1 a 5: A Base",
            description: "Foco na contagem sequencial e identificação visual de pequenos grupos.",
            lessons: [
              { id: "m1-l1", title: "Quantidades Iniciais (1-3)", description: "Prática de contagem até 3 com objetos visuais.", content: JSON.stringify(quizM1L1), type: "exercise" },
              { id: "m1-l2", title: "Expandindo a Contagem (4-5)", description: "Introdução ao número 4 e 5 e pequenos problemas de adição.", content: JSON.stringify(quizM1L2), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-atividades",
            title: "Jogos de Fixação Rápida",
            description: "Atividades interativas para reforçar a memorização e a velocidade de resposta.",
            lessons: [
              { id: "m1-l3", title: "Jogo Rápido: Escolha o Número", description: "Jogo de contagem visual rápida (ContandoFrutas).", content: "Clique no número correto que representa a quantidade de maçãs.", type: "game" },
              { id: "m1-l4", title: "Desafio de Adição Visual", description: "Resolução de problemas simples de adição e subtração.", content: JSON.stringify(quizM1L4), type: "exercise" }
            ]
          },
          {
            id: "m1-mod-revisao",
            title: "Revisão e Avaliação",
            description: "Testes finais para garantir a retenção dos conceitos de 1 a 5.",
            lessons: [
              { id: "m1-l5", title: "Mix de Frutas e Subtração", description: "Prática de subtração básica com objetos.", content: JSON.stringify(quizM1L5), type: "exercise" },
              { id: "m1-l6", title: "Autoavaliação Final", description: "Teste abrangente de contagem e raciocínio numérico.", content: JSON.stringify(quizM1L6), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m2",
        title: "Geometria: Formas e Espaço",
        description: "Identificação de formas geométricas básicas e sua aplicação no ambiente.",
        ageGroups: ['4-6'],
        icon: "Apple",
        modules: [
          {
            id: "m2-mod-1",
            title: "Reconhecendo Formas Planas",
            lessons: [
              { id: "m2-l1", title: "Círculos e Triângulos", description: "Aprenda as características e o número de lados de círculos e triângulos.", content: JSON.stringify(quizM2L1), type: "exercise" },
              { id: "m2-l2", title: "Quadrados e Retângulos", description: "Diferenciando formas com quatro lados.", content: JSON.stringify(quizM2L2), type: "exercise" }
            ]
          },
          {
            id: "m2-mod-2",
            title: "Formas no Mundo Real",
            lessons: [
              { id: "m2-l3", title: "Identificação em Objetos", description: "Associe formas geométricas a objetos do dia a dia.", content: JSON.stringify(quizM2L3), type: "exercise" },
              { id: "m2-l4", title: "Atividade Criativa de Desenho", description: "Tarefa prática para usar formas na criação de desenhos.", content: "Tarefa: Desenhe uma cena usando pelo menos um círculo, um quadrado e um triângulo. (Requer supervisão dos pais).", type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m3",
        title: "Adição e Subtração (7-9 anos)",
        description: "Domínio das operações fundamentais com números até 20, utilizando recursos visuais.",
        ageGroups: ['7-9'],
        icon: "Apple",
        modules: [
          {
            id: "m3-mod-basico",
            title: "Fundamentos da Soma e Subtração",
            lessons: [
              { id: "m3-l1", title: "Soma Simples (1 a 5)", description: "Revisão e prática de somas iniciais.", content: JSON.stringify(quizM3L1), type: "exercise" },
              { id: "m3-l2", title: "Problemas com Objetos", description: "Resolução de problemas de adição e subtração com contexto.", content: JSON.stringify(quizM3L2), type: "exercise" }
            ]
          },
          {
            id: "m3-mod-visual",
            title: "Visualização e Raciocínio",
            lessons: [
              { id: "m3-l3", title: "Somas com Barras (até 10)", description: "Uso de modelos de barras para entender a composição numérica.", content: JSON.stringify(quizM3L3), type: "exercise" },
              { id: "m3-l4", title: "Problemas de Duas Etapas", description: "Introdução a problemas que exigem mais de uma operação.", content: JSON.stringify(quizM3L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m4",
        title: "Multiplicação e Tabuada",
        description: "Memorização e compreensão da multiplicação como adição repetida (Tabuada de 1 a 10).",
        ageGroups: ['7-9', '10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m4-mod-1",
            title: "Tabuada Inicial (1 a 5)",
            lessons: [
              { id: "m4-l1", title: "Multiplicação como Soma", description: "Entenda o conceito de grupos iguais.", content: JSON.stringify(quizM4L1), type: "exercise" },
              { id: "m4-l2", title: "Quiz Rápido de 1 a 5", description: "Teste de velocidade e precisão nas tabuadas iniciais.", content: JSON.stringify(quizM4L2), type: "exercise" }
            ]
          },
          {
            id: "m4-mod-2",
            title: "Domínio da Tabuada (6 a 10)",
            lessons: [
              { id: "m4-l3", title: "Tabuada do 6 ao 10", description: "Estratégias de memorização para tabuadas mais difíceis.", content: JSON.stringify(quizM4L3), type: "exercise" },
              { id: "m4-l4", title: "Desafio de 60s", description: "Teste final de fluência na multiplicação.", content: JSON.stringify(quizM4L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m5",
        title: "Frações e Decimais",
        description: "Introdução aos conceitos de partes de um todo, equivalência e comparação de frações.",
        ageGroups: ['7-9', '10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m5-mod-1",
            title: "Conceitos Fundamentais",
            lessons: [
              { id: "m5-l1", title: "O que são Frações?", description: "Vídeo explicativo sobre numerador, denominador e o conceito de partes iguais.", videoUrl: "https://www.youtube.com/embed/CGyEd0aKWZE", type: "video" },
              { id: "m5-l2", title: "Meio, Terço e Quarto", description: "Identificação e nomeação das frações mais comuns.", content: JSON.stringify(quizM5L2), type: "exercise" }
            ]
          },
          {
            id: "m5-mod-2",
            title: "Comparação e Equivalência",
            lessons: [
              { id: "m5-l3", title: "Frações Equivalentes", description: "Identifique frações que representam a mesma quantidade.", content: JSON.stringify(quizM5L3), type: "exercise" },
              { id: "m5-l4", title: "Desafio Visual de Frações", description: "Jogo com comparação e equivalência de frações.", content: JSON.stringify(quizM5L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m6",
        title: "Raciocínio Lógico e Resolução de Problemas",
        description: "Desenvolvimento do pensamento analítico através de problemas matemáticos de múltiplas etapas.",
        ageGroups: ['10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m6-mod-1",
            title: "Estratégias de Raciocínio",
            lessons: [
              { id: "m6-l1", title: "Problemas de Tempo e Distância", description: "Desafios simples de raciocínio envolvendo unidades de medida.", content: JSON.stringify(quizM6L1), type: "exercise" },
              { id: "m6-l2", title: "Pense em Etapas (Fluxograma)", description: "Aprenda a dividir problemas complexos em passos lógicos.", content: JSON.stringify(quizM6L2), type: "exercise" }
            ]
          },
          {
            id: "m6-mod-2",
            title: "Desafios Avançados",
            lessons: [
              { id: "m6-l3", title: "Problemas com Porcentagem e Geometria", description: "Integração de diferentes conceitos matemáticos.", content: JSON.stringify(quizM6L3), type: "exercise" },
              { id: "m6-l4", title: "Sequências Numéricas e Padrões", description: "Identificação de padrões e regras em sequências complexas.", content: JSON.stringify(quizM6L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "m7",
        title: "Geometria: Perímetro e Área",
        description: "Cálculo de medidas espaciais e aplicação de fórmulas geométricas básicas.",
        ageGroups: ['10-12'],
        icon: "Apple",
        modules: [
          {
            id: "m7-mod-1",
            title: "Medidas Lineares e Ângulos",
            lessons: [
              { id: "m7-l1", title: "Ângulos: Tipos e Medidas", description: "Vídeo sobre ângulos retos, agudos e obtusos.", videoUrl: "https://www.youtube.com/embed/8ZK0hXp1mvM", type: "video" },
              { id: "m7-l2", title: "Perímetro: A Volta da Figura", description: "Conceito e cálculo do perímetro de polígonos.", content: JSON.stringify(quizM7L2), type: "exercise" }
            ]
          },
          {
            id: "m7-mod-2",
            title: "Área e Aplicações",
            lessons: [
              { id: "m7-l3", title: "Área de Retângulos e Quadrados", description: "Fórmulas e prática de cálculo de área.", content: JSON.stringify(quizM7L3), type: "exercise" },
              { id: "m7-l4", title: "Problemas do Mundo Real", description: "Aplicação de perímetro e área em situações cotidianas (ex: pintura de parede).", content: JSON.stringify(quizM7L4), type: "exercise" }
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
        title: "Alfabetização: Letras e Fonemas",
        description: "Reconhecimento de letras, associação de sons (fonemas) e formação de palavras simples.",
        ageGroups: ['4-6'],
        icon: "BookOpen",
        modules: [
          {
            id: "p1-mod-1",
            title: "Conhecendo o Alfabeto",
            lessons: [
              { id: "p1-l1", title: "Sons Iniciais e Vogais", description: "Associe letras a sons e imagens iniciais.", content: JSON.stringify(quizP1L1), type: "exercise" },
              { id: "p1-l2", title: "Identificação de Letras", description: "Localize letras no começo e fim de palavras.", content: JSON.stringify(quizP1L2), type: "exercise" }
            ]
          },
          {
            id: "p1-mod-2",
            title: "Formando Palavras Curtas",
            lessons: [
              { id: "p1-l3", title: "Montando Palavras Simples (3-4 letras)", description: "Junte letras para formar palavras curtas e significativas.", content: JSON.stringify(quizP1L3), type: "exercise" },
              { id: "p1-l4", title: "Caça às Letras em Frases", description: "Exercício de atenção e reconhecimento de letras em contexto.", content: JSON.stringify(quizP1L4), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p2",
        title: "Silabação e Construção de Vocabulário",
        description: "Desenvolvimento da consciência fonológica através da divisão e combinação de sílabas.",
        ageGroups: ['4-6', '7-9'],
        icon: "BookOpen",
        modules: [
          {
            id: "p2-mod-1",
            title: "Entendendo as Sílabas",
            lessons: [
              { id: "p2-l1", title: "Divisão Silábica Básica", description: "Conte e separe palavras em sílabas.", content: JSON.stringify(quizP2L1), type: "exercise" },
              { id: "p2-l2", title: "Combinando Sílabas", description: "Combine sílabas para formar novas palavras.", content: JSON.stringify(quizP2L2), type: "exercise" }
            ]
          },
          {
            id: "p2-mod-2",
            title: "Jogos de Formação",
            lessons: [
              { id: "p2-l3", title: "Forme Palavras com Imagens", description: "Jogo interativo de arrastar e soltar sílabas (FormandoPalavras).", type: "game" },
              { id: "p2-l4", title: "Desafio de Velocidade Silábica", description: "Prática rápida de montagem de palavras.", type: "game" }
            ]
          }
        ]
      },
      {
        id: "p3",
        title: "Rimas e Poesia",
        description: "Desenvolvimento da percepção auditiva e criatividade através da identificação e criação de rimas.",
        ageGroups: ['4-6', '7-9'],
        icon: "BookOpen",
        modules: [
          {
            id: "p3-mod-1",
            title: "O Som das Palavras",
            lessons: [
              { id: "p3-l1", title: "Identificando Rimas", description: "Encontre pares de palavras com sons finais semelhantes.", content: JSON.stringify(quizP3L1), type: "exercise" },
              { id: "p3-l2", title: "Criando Versos Simples", description: "Complete frases e crie rimas curtas.", content: JSON.stringify(quizP3L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p4",
        title: "Interpretação e Compreensão de Texto",
        description: "Técnicas para extrair informações, identificar ideias centrais e tirar conclusões de textos curtos.",
        ageGroups: ['7-9', '10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p4-mod-1",
            title: "Leitura Ativa",
            lessons: [
              { id: "p4-l1", title: "Extração de Informação Explícita", description: "Responda a perguntas baseadas em fatos diretamente no texto.", content: JSON.stringify(quizP4L1), type: "exercise" },
              { id: "p4-l2", title: "Inferência e Resumo", description: "Aprenda a identificar a moral da história e a resumir o conteúdo.", content: JSON.stringify(quizP4L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p5",
        title: "Ortografia e Acentuação",
        description: "Domínio das regras básicas de acentuação e ortografia para escrita correta.",
        ageGroups: ['7-9', '10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p5-mod-1",
            title: "Regras de Acentuação",
            lessons: [
              { id: "p5-l1", title: "Acentos Agudo e Circunflexo", description: "Diferencie e aplique os acentos corretamente.", content: JSON.stringify(quizP5L1), type: "exercise" },
              { id: "p5-l2", title: "Exercícios de Correção", description: "Pratique a acentuação em palavras comuns.", content: JSON.stringify(quizP5L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p6",
        title: "Classes Gramaticais Fundamentais",
        description: "Identificação e uso correto de substantivos, adjetivos e verbos para construir frases ricas.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p6-mod-1",
            title: "Estrutura da Frase",
            lessons: [
              { id: "p6-l1", title: "Substantivos e Verbos", description: "Marque substantivos (nomes) e verbos (ações) em frases.", content: JSON.stringify(quizP6L1), type: "exercise" },
              { id: "p6-l2", title: "O Poder dos Adjetivos", description: "Use adjetivos para dar qualidade e detalhe aos substantivos.", content: JSON.stringify(quizP6L2), type: "exercise" }
            ]
          }
        ]
      },
      {
        id: "p7",
        title: "Produção de Texto Criativa",
        description: "Desenvolvimento de habilidades de escrita, desde o planejamento até a revisão final.",
        ageGroups: ['10-12'],
        icon: "BookOpen",
        modules: [
          {
            id: "p7-mod-1",
            title: "Planejamento e Estrutura",
            lessons: [
              { id: "p7-l1", title: "Estrutura Narrativa (Início, Meio, Fim)", description: "Organize as ideias antes de começar a escrever.", content: JSON.stringify(quizP7L1), type: "exercise" },
              { id: "p7-l2", title: "Vocabulário Rico e Expressivo", description: "Escolha palavras fortes para tornar o texto envolvente.", content: JSON.stringify(quizP7L2), type: "exercise" }
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
        title: "Anatomia e Saúde Humana",
        description: "Estudo dos principais sistemas do corpo humano e a importância de hábitos saudáveis.",
        ageGroups: ['7-9', '10-12'],
        icon: "FlaskConical",
        modules: [
          {
            id: "c1-mod-1",
            title: "Sistemas Vitais",
            lessons: [
              { id: "c1-l1", title: "Sistema Digestório", description: "Como os alimentos são transformados em energia.", content: "O sistema digestório começa na boca e termina no intestino grosso. O estômago é o principal órgão onde a quebra dos alimentos acontece. (Leitura e Quiz)", type: "reading" },
              { id: "c1-l2", title: "Sistema Respiratório", description: "A troca gasosa e a função dos pulmões.", content: JSON.stringify(quizC1L2), type: "exercise" }
            ]
          },
          {
            id: "c1-mod-2",
            title: "Cuidados e Prevenção",
            lessons: [
              { id: "c1-l3", title: "Higiene e Nutrição", description: "Práticas essenciais para manter o corpo forte e livre de doenças.", content: JSON.stringify(quizC1L3), type: "exercise" },
              { id: "c1-l4", title: "Experimento Simples: Pulmão", description: "Demonstração prática da função pulmonar usando materiais simples.", content: "Experimento: Use uma garrafa, balões e canudos para simular como os pulmões enchem e esvaziam. (Requer supervisão dos pais).", type: "exercise" }
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
        title: "Fundamentos da História do Brasil",
        description: "Análise dos eventos chave que moldaram o Brasil, desde os povos originários até a colonização.",
        ageGroups: ['7-9', '10-12'],
        icon: "Landmark",
        modules: [
          {
            id: "h1-mod-1",
            title: "O Brasil Antes de 1500",
            lessons: [
              { id: "h1-l1", title: "Povos Indígenas e Culturas", description: "Quem eram e como viviam os habitantes originais do Brasil.", content: "Os povos indígenas tinham culturas ricas e diversas, vivendo em harmonia com a natureza. Eles não tinham o conceito de 'país' como conhecemos hoje. (Leitura e Quiz)", type: "reading" },
              { id: "h1-l2", title: "A Chegada dos Europeus", description: "O contexto das Grandes Navegações e a chegada de Cabral.", content: JSON.stringify(quizH1L2), type: "exercise" }
            ]
          },
          {
            id: "h1-mod-2",
            title: "Impacto da Colonização",
            lessons: [
              { id: "h1-l3", title: "Consequências Culturais e Sociais", description: "O que mudou para os indígenas e o início da exploração.", content: JSON.stringify(quizH1L3), type: "exercise" },
              { id: "h1-l4", title: "Linha do Tempo Interativa", description: "Organize os eventos históricos na ordem correta.", content: "Tarefa: Crie uma linha do tempo visual dos eventos de 1490 a 1550.", type: "exercise" }
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
        title: "Cartografia e Regiões Brasileiras",
        description: "Aprendizado sobre mapas, orientação e as características das regiões do Brasil.",
        ageGroups: ['7-9', '10-12'],
        icon: "Globe",
        modules: [
          {
            id: "g1-mod-1",
            title: "O Mapa Político do Brasil",
            lessons: [
              { id: "g1-l1", title: "Estados e Capitais", description: "Localize e memorize os estados e suas capitais.", content: JSON.stringify(quizG1L1), type: "exercise" },
              { id: "g1-l2", title: "Leitura de Mapas", description: "Entenda o uso de legendas, escalas e pontos cardeais.", content: "Aprenda a usar a rosa dos ventos para se orientar em qualquer mapa. (Leitura e Quiz)", type: "reading" }
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
        title: "Vocabulário Essencial: Cores e Números",
        description: "Construção do vocabulário básico para comunicação diária em inglês.",
        ageGroups: ['7-9'],
        icon: "SpellCheck",
        modules: [
          {
            id: "i1-mod-1",
            title: "Cores e Adjetivos",
            lessons: [
              { id: "i1-l1", title: "Colors in English", description: "Nomes das cores e como usá-las em frases simples.", content: JSON.stringify(quizI1L1), type: "exercise" },
              { id: "i1-l2", title: "Numbers 1 to 10", description: "Contagem e pronúncia correta dos números.", videoUrl: "https://www.youtube.com/embed/d3LLHe2fM0w", type: "video" }
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
        title: "Identificação de Padrões e Sequências",
        description: "Desenvolvimento do raciocínio indutivo e da capacidade de prever o próximo passo em uma série.",
        ageGroups: ['4-6', '7-9'],
        icon: "Brain",
        modules: [
          {
            id: "l1-mod-1",
            title: "Padrões Visuais e Numéricos",
            lessons: [
              { id: "l1-l1", title: "Sequências de Cores e Formas", description: "Identifique e complete padrões visuais e numéricos simples.", content: JSON.stringify(quizL1L1), type: "exercise" }
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
        title: "Teoria das Cores e Desenho",
        description: "Introdução às cores primárias, secundárias e técnicas básicas de desenho.",
        ageGroups: ['4-6', '7-9'],
        icon: "Palette",
        modules: [
          {
            id: "a1-mod-1",
            title: "Fundamentos da Cor",
            lessons: [
              { id: "a1-l1", title: "Cores Primárias e Secundárias", description: "Aprenda quais cores se misturam para criar novas cores.", content: "As cores primárias são Vermelho, Amarelo e Azul. Misturando-as, criamos as cores secundárias. (Leitura e Quiz)", type: "reading" },
              { id: "a1-l2", title: "Mistura de Cores", description: "Teste seus conhecimentos sobre a criação de cores secundárias.", content: JSON.stringify(quizA1L2), type: "exercise" }
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
        title: "Introdução aos Instrumentos e Ritmo",
        description: "Reconhecimento de famílias de instrumentos e desenvolvimento do senso rítmico.",
        ageGroups: ['4-6', '7-9'],
        icon: "Music",
        modules: [
          {
            id: "mu1-mod-1",
            title: "Famílias de Instrumentos",
            lessons: [
              { id: "mu1-l1", title: "Cordas, Sopro e Percussão", description: "Identifique a qual família pertence cada instrumento.", content: JSON.stringify(quizMu1L1), type: "exercise" },
              { id: "mu1-l2", title: "Marcando o Pulso", description: "Exercício prático para manter o ritmo e o tempo musical.", content: "Bata palmas no ritmo da música que está tocando. O pulso é o 'coração' da música.", type: "exercise" }
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
        title: "Fundamentos de Algoritmos e Lógica",
        description: "Introdução ao pensamento sequencial, loops e condicionais, essenciais para a codificação.",
        ageGroups: ['10-12'],
        icon: "Code",
        modules: [
          {
            id: "pr1-mod-1",
            title: "Sequência e Repetição",
            lessons: [
              { id: "pr1-l1", title: "Comandos Sequenciais", description: "Entenda a ordem de execução das instruções.", content: JSON.stringify(quizPr1L1), type: "exercise" },
              { id: "pr1-l2", title: "Loops (Repetição)", description: "Aprenda a usar o comando 'repetir' para economizar passos.", content: JSON.stringify(quizPr1L2), type: "exercise" }
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
        title: "Componentes e Montagem de Robôs",
        description: "Conhecimento das peças básicas de robótica (sensores, motores) e sua função.",
        ageGroups: ['10-12'],
        icon: "Bot",
        modules: [
          {
            id: "r1-mod-1",
            title: "Hardware Básico",
            lessons: [
              { id: "r1-l1", title: "Sensores e Atuadores", description: "Diferencie as peças que 'sentem' e as que 'agem'.", content: "Os sensores permitem que o robô perceba o ambiente (luz, toque). Os atuadores (motores) fazem o robô se mover. (Leitura e Quiz)", type: "reading" },
              { id: "r1-l2", title: "Montagem Estrutural", description: "Teste seus conhecimentos sobre a função dos componentes.", content: JSON.stringify(quizR1L2), type: "exercise" }
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
        title: "Orçamento Pessoal e Poupança",
        description: "Desenvolvimento de responsabilidade financeira através do gerenciamento de mesada e metas.",
        ageGroups: ['10-12'],
        icon: "PiggyBank",
        modules: [
          {
            id: "f1-mod-1",
            title: "Renda, Despesa e Saldo",
            lessons: [
              { id: "f1-l1", title: "Entendendo o Fluxo de Dinheiro", description: "Diferencie o que é ganhar (renda) e o que é gastar (despesa).", content: JSON.stringify(quizF1L1), type: "exercise" },
              { id: "f1-l2", title: "Planejando Metas de Poupança", description: "Calcule quanto tempo leva para atingir um objetivo financeiro.", content: JSON.stringify(quizF1L2), type: "exercise" }
            ]
          }
        ]
      }
    ]
  }
];