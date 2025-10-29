import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Zap, CheckCircle } from 'lucide-react';
import { Lesson } from '@/data/activitiesData';

interface HelpPackageContentProps {
  subjectSlug: string;
  lesson: Lesson;
}

// Nova função "inteligente" para gerar dicas específicas
const getSmartHelpContent = (subjectSlug: string, lesson: Lesson) => {
  // Dica para Quiz de Matemática
  if (subjectSlug === 'matematica' && lesson.type === 'exercise' && lesson.content) {
    try {
      const questions = JSON.parse(lesson.content);
      const firstQuestion = questions[0];
      // Tenta extrair números e operador da pergunta (ex: "Quanto é 5 + 3?")
      const match = firstQuestion.question.match(/(\d+)\s*([+\-×])\s*(\d+)/);
      if (match) {
        const [, num1, op, num2] = match;
        const answer = op === '+' ? +num1 + +num2 : op === '-' ? +num1 - +num2 : +num1 * +num2;
        return {
          title: "Dica de Matemática: Passo a Passo",
          icon: <Zap className="h-6 w-6 text-yellow-400" />,
          content: `Para resolver uma conta como "${num1} ${op} ${num2}", você pode desenhar! Imagine ${num1} bolinhas e ${op === '+' ? 'adicione' : 'remova'} ${num2}. O total será ${answer}.`,
        };
      }
    } catch (e) { /* ignora erro de parse */ }
  }

  // Dica para Jogo de Formar Palavras
  if (lesson.title.includes("Montagem de Palavras") || lesson.title.includes("Formando Palavras")) {
    return {
      title: "Dica de Português: Formando a Palavra",
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      content: "Tente pronunciar as sílabas em voz alta. Uma das palavras secretas é 'BOLA'. Tente juntar as sílabas 'BO' e 'LA' para ver o que acontece!",
    };
  }

  // Dica para Jogo de Contagem
  if (lesson.title.includes("Contando com Jogos")) {
    return {
      title: "Dica de Contagem: Técnica Infalível",
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      content: "Para não se perder na contagem, toque em cada fruta na tela com o dedo e conte em voz alta. O último número que você disser é a resposta correta!",
    };
  }

  // Dica Padrão (fallback)
  return {
    title: "Ajuda Geral",
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    content: `Para a lição "${lesson.title}", preste atenção nos detalhes do enunciado. Ler com calma é o primeiro passo para encontrar a resposta!`,
  };
};

export const HelpPackageContent = ({ subjectSlug, lesson }: HelpPackageContentProps) => {
  const help = getSmartHelpContent(subjectSlug, lesson);

  return (
    <Card className="glass-card border-yellow-500/50 bg-yellow-900/20 p-4 mb-6 animate-fade-in-up">
      <CardHeader className="p-0 pb-2 flex flex-row items-center gap-3">
        {help.icon}
        <CardTitle className="text-xl text-yellow-300">{help.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-yellow-200/90">{help.content}</p>
        <div className="mt-3 flex items-center text-sm text-yellow-300/80">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Dica desbloqueada. Bom trabalho!</span>
        </div>
      </CardContent>
    </Card>
  );
};