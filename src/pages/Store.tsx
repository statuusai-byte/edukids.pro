import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Bot, BookOpen, Users, Palette, BarChart3, Loader2 } from "lucide-react";
import { ThemePreviewCard } from "@/components/ThemePreviewCard";
import { usePremium } from "@/context/PremiumContext";
import { useState } from "react";
import { showLoading, showError, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";

const Store = () => {
  const { isPremium } = usePremium();
  const { user } = useSupabase();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      showError("Você precisa estar logado para iniciar uma assinatura.");
      return;
    }

    setIsCheckingOut(true);
    const loadingToast = showLoading("Iniciando checkout...");

    try {
      // 1. Chamar a Edge Function para criar a sessão de checkout
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await supabase.auth.getSession().then(s => s.data.session?.access_token)}`,
        },
      });

      if (error) throw new Error(error.message);
      if (!data || !data.checkout_url) throw new Error("Falha ao obter URL de checkout.");

      // 2. Redirecionar o usuário para a URL de checkout simulada
      window.location.href = data.checkout_url;

    } catch (error) {
      console.error("Checkout failed:", error);
      dismissToast(loadingToast);
      showError("Erro ao processar a assinatura. Tente novamente.");
      setIsCheckingOut(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-2 text-center">Explore todos os recursos Premium</h1>
      <p className="text-muted-foreground text-center mb-12">
        {isPremium ? "Você é Premium! Aproveite o acesso total." : "Assine o Premium para desbloquear tudo."}
      </p>
      
      {/* Planos de Assinatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
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
                {isPremium && (
                  <div className="flex items-center gap-1 text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                    <Star className="h-4 w-4" /> Ativo
                  </div>
                )}
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
              {isPremium ? (
                <Button variant="outline" className="w-full border-primary/50 text-primary" disabled>Seu Plano Atual</Button>
              ) : (
                <Button 
                  onClick={handleCheckout} 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                    </>
                  ) : (
                    "Assinar Agora (R$ 19,90/mês)"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Seção de Recursos Premium */}
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter mt-12 mb-6">Recursos Exclusivos</h2>
        
        {/* Passa o status real de Premium */}
        <ThemePreviewCard />

        <Card className="glass-card p-4">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Relatórios Avançados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Acompanhe o progresso detalhado, tempo de tela por matéria e identifique áreas que precisam de mais atenção com relatórios semanais e mensais.</p>
            <div className="h-32 bg-secondary/50 rounded-lg mt-4 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Pré-visualização do gráfico de desempenho.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Store;