import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Bot, BookOpen, Users, Palette, BarChart3 } from "lucide-react";

const Store = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-2 text-center">Nossos Planos</h1>
      <p className="text-muted-foreground text-center mb-12">Escolha o plano perfeito para a jornada do seu filho.</p>
      
      {/* Planos de Assinatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="glass-card p-4 flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Plano Gratuito</CardTitle>
            <CardDescription>Comece a aprender agora mesmo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex-grow">
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
          <Card className="relative glass-card p-4 border-primary/50 flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl text-primary">Plano Premium</CardTitle>
                <div className="flex items-center gap-1 text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                  <Star className="h-4 w-4" /> Popular
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
              <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Fazer Upgrade</Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Compras Avulsas */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold tracking-tighter">Ou compre adicionais separadamente</h2>
        <p className="text-muted-foreground mt-2 mb-8">Melhore sua experiência sem a assinatura completa.</p>
        <Card className="glass-card max-w-md mx-auto p-4 text-left">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg border border-primary/50">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>Pacote de Temas Visuais</CardTitle>
                <CardDescription>Personalize toda a aparência do app.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Leve para casa todos os temas visuais premium para criar o ambiente de aprendizado perfeito. Inclui:</p>
            <div className="flex justify-around items-center mb-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mx-auto mb-1 border-2 border-white/20"></div>
                <span className="text-xs">Nébula</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 mx-auto mb-1 border-2 border-white/20"></div>
                <span className="text-xs">Cosmos</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lime-400 to-green-600 mx-auto mb-1 border-2 border-white/20"></div>
                <span className="text-xs">Selva</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 mx-auto mb-1 border-2 border-white/20"></div>
                <span className="text-xs">Oceano</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Esta é uma compra única e não uma assinatura.</p>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2">
            <div className="text-center mb-2">
              <span className="text-3xl font-bold">R$ 19,90</span>
              <span className="text-muted-foreground"> / Pagamento Único</span>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Comprar Pacote de Temas</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Store;