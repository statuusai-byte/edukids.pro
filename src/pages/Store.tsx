import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Bot, BookOpen, Users, Palette, BarChart3 } from "lucide-react";

const Store = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-2 text-center">Explore todos os recursos Premium</h1>
      <p className="text-muted-foreground text-center mb-12">O modo de teste está ativo. Aproveite o acesso total!</p>
      
      {/* Planos de Assinatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="glass-card p-4 flex flex-col opacity-60">
          <CardHeader>
            <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
            <CardDescription>Acesso a atividades e recursos básicos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-grow">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Acesso a atividades básicas</li>
              <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> IA de texto para ajuda simples</li>
              <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Suporte da comunidade</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" disabled>Plano Anterior</Button>
          </CardFooter>
        </Card>
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75"></div>
          <Card className="relative glass-card p-4 border-primary/50 flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-primary">Plano Premium</CardTitle>
                <div className="flex items-center gap-1 text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                  <Star className="h-4 w-4" /> Teste Ativo
                </div>
              </div>
              <CardDescription>Desbloqueie todo o potencial do EDUKIDS+.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
              <ul className="space-y-3 text-foreground">
                <li className="flex items-center"><BookOpen className="mr-3 h-5 w-5 text-primary" /> Acesso ilimitado a todas as atividades</li>
                <li className="flex items-center"><Users className="mr-3 h-5 w-5 text-primary" /> Todos os cursos e vídeo aulas</li>
                <li className="flex items-center"><Bot className="mr-3 h-5 w-5 text-primary" /> IA Premium interativa e avançada</li>
                <li className="flex items-center"><BarChart3 className="mr-3 h-5 w-5 text-primary" /> Painel dos Pais completo</li>
                <li className="flex items-center"><Palette className="mr-3 h-5 w-5 text-primary" /> Temas visuais personalizáveis</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-primary/50 text-primary" disabled>Seu Plano Atual</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Store;