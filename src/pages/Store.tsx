import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const Store = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-2 text-center">Nossos Planos</h1>
      <p className="text-muted-foreground text-center mb-12">Escolha o plano perfeito para a jornada do seu filho.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="glass-card p-4">
          <CardHeader>
            <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
            <CardDescription>Comece a aprender agora mesmo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Acesso a atividades básicas</li>
              <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> IA de texto para ajuda simples</li>
              <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Suporte da comunidade</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">Plano Atual</Button>
          </CardFooter>
        </Card>
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75"></div>
          <Card className="relative glass-card p-4 border-primary/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-primary">Plano Premium</CardTitle>
                <div className="flex items-center gap-1 text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                  <Star className="h-4 w-4" /> Popular
                </div>
              </div>
              <CardDescription>Desbloqueie todo o potencial do EDUKIDS+.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-3 text-foreground">
                <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Acesso ilimitado a todas as atividades</li>
                <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Todos os cursos e vídeo aulas</li>
                <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> IA Premium interativa e avançada</li>
                <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Painel dos Pais completo</li>
                <li className="flex items-center"><Check className="mr-3 h-5 w-5 text-primary" /> Temas visuais personalizáveis</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Fazer Upgrade</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Store;