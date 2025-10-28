import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Zap, CheckCircle, BookOpen, FlaskConical, Landmark, Globe, SpellCheck } from 'lucide-react';

interface HelpPackageContentProps {
  subjectSlug: string;
  lessonTitle: string;
}

const getHelpContent = (subjectSlug: string, lessonTitle: string) => {
  switch (subjectSlug) {
    case 'matematica':
      return {
        title: "Dica de Matemática Avançada",
        icon: <Zap className="h-6 w-6 text-yellow-400" />,
        content: `Para a lição "${lessonTitle}", lembre-se de que a chave é a visualização. Se for contagem, use os dedos ou desenhe. Se for multiplicação, pense em grupos iguais. Solução rápida: A resposta correta geralmente envolve o número que aparece com mais frequência no problema.`,
      };
    case 'portugues':
      return {
        title: "Ajuda de Português: Foco na Sílaba",
        icon: <BookOpen className="h-6 w-6 text-primary" />,
        content: `Na lição "${lessonTitle}", se estiver com dificuldade em formar palavras, tente pronunciar a palavra lentamente. Cada som que você faz é uma sílaba. Para rimas, concentre-se no som final da palavra.`,
      };
    case 'ciencias':
      return {
        title: "Guia de Ciências: O que procurar",
        icon: <FlaskConical className="h-6 w-6 text-green-400" />,
        content: `Para a lição "${lessonTitle}", a dica é focar na função principal do objeto ou sistema. Por exemplo, o pulmão serve para respirar, o estômago para digerir. Pense no que o corpo precisa para sobreviver.`,
      };
    case 'historia':
      return {
        title: "Resumo Histórico Rápido",
        icon: <Landmark className="h-6 w-6 text-orange-400" />,
        content: `Sobre a lição "${lessonTitle}", a história é sobre causa e efeito. Quem fez o quê e por quê? Lembre-se das datas importantes (como 1500) e dos nomes dos líderes.`,
      };
    case 'geografia':
      return {
        title: "Dica de Geografia: Localização",
        icon: <Globe className="h-6 w-6 text-teal-400" />,
        content: `Para a lição "${lessonTitle}", use um mapa mental. Tente associar a capital a uma imagem famosa do estado. Por exemplo, São Paulo = Avenida Paulista.`,
      };
    case 'ingles':
      return {
        title: "Dica de Inglês: Vocabulário",
        icon: <SpellCheck className="h-6 w-6 text-indigo-400" />,
        content: `Na lição "${lessonTitle}", a melhor forma de memorizar é repetir em voz alta. Tente usar a palavra em uma frase simples. Exemplo: 'The apple is red.'`,
      };
    default:
      return {
        title: "Ajuda Geral",
        icon: <Lightbulb className="h-6 w-6 text-primary" />,
        content: "Esta é uma dica geral. Para ajuda específica, compre o pacote da matéria!",
      };
  }
};

export const HelpPackageContent = ({ subjectSlug, lessonTitle }: HelpPackageContentProps) => {
  const help = getHelpContent(subjectSlug, lessonTitle);

  return (
    <Card className="glass-card border-yellow-500/50 bg-yellow-900/20 p-4 mb-6">
      <CardHeader className="p-0 pb-2 flex flex-row items-center gap-3">
        {help.icon}
        <CardTitle className="text-xl text-yellow-300">{help.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-yellow-200/90">{help.content}</p>
        <div className="mt-3 flex items-center text-sm text-yellow-300/80">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Conteúdo exclusivo do Pacote de Ajuda.</span>
        </div>
      </CardContent>
    </Card>
  );
};