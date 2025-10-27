import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Store = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-center">Nossos Planos</h1>
      <p className="text-muted-foreground text-center mb-8">Escolha o plano perfeito para a jornada do seu filho.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Plano Gratuito</CardTitle>
            <CardDescription>Comece a aprender agora mesmo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Acesso a atividades básicas</li>
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> IA de texto para ajuda simples</li>
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Suporte da comunidade</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Plano Atual</Button>
          </CardFooter>
        </Card>
        <Card className="border-blue-500 shadow-lg">
          <CardHeader>
            <CardTitle>Plano Premium</CardTitle>
            <CardDescription>Desbloqueie todo o potencial do EDUKIDS+.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="space-y-2">
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Acesso ilimitado a todas as atividades</li>
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Todos os cursos e vídeo aulas</li>
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> IA Premium interativa e avançada</li>
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Painel dos Pais completo</li>
              <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Temas visuais personalizáveis</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Fazer Upgrade</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Store;