import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Bot, BookOpen, Users, BarChart3, Loader2, Lightbulb, Zap, Gift } from "lucide-react";
import { usePremium } from "@/context/PremiumContext";
import { useState } from "react";
import { showLoading, showError, dismissToast, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";
import { Icon } from "@/components/Icon";
import { useHelpPackages } from "@/hooks/useHelpPackages";
import { useHintBalance } from "@/hooks/useHintBalance"; // Importando o hook de saldo de dicas

const Store = () => {
  const { isPremium } = usePremium();
  const { user } = useSupabase();
  const { purchasePackage, hasPackage } = useHelpPackages();
  const { balance: hintBalance, addHints } = useHintBalance();
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

  const handleBuyPackage = (subjectSlug: string, packageName: string) => {
    if (!user) {
      showError("Você precisa estar logado para comprar pacotes.");
      return;
    }
    
    showLoading(`Comprando pacote ${packageName}...`);
    setTimeout(() => {
      purchasePackage(subjectSlug);
      dismissToast(0); // Dismiss loading
      showSuccess(`Pacote de Ajuda '${packageName}' comprado com sucesso!`);
    }, 1500);
  };

  const handleBuyHints = (amount: number, price: string) => {
    if (!user) {
      showError("Você precisa estar logado para comprar dicas.");
      return;
    }
    
    showLoading(`Processando compra de ${amount} dicas...`);
    setTimeout(() => {
      addHints(amount);
      dismissToast(0); // Dismiss loading
      showSuccess(`Parabéns! Você adicionou ${amount} dicas ao seu saldo.`);
    }, 1500);
  };

  const helpPackages = [
    { id: 'matematica', name: 'Pacote de Ajuda: Matemática', price: 'R$ 9,90', icon: 'Sigma', description: 'Dicas e soluções detalhadas para todos os exercícios de Matemática.', slug: 'matematica' },
    { id: 'portugues', name: 'Pacote de Ajuda: Português', price: 'R$ 9,90', icon: 'BookOpen', description: 'Acesso a gabaritos e explicações de gramática e interpretação.', slug: 'portugues' },
    { id: 'ciencias', name: 'Pacote de Ajuda: Ciências', price: 'R$ 9,90', icon: 'FlaskConical', description: 'Guias de experimentos e informações extras sobre o corpo humano e natureza.', slug: 'ciencias' },
    { id: 'historia', name: 'Pacote de Ajuda: História', price: 'R$ 9,90', icon: 'Landmark', description: 'Linhas do tempo interativas e resumos de eventos históricos.', slug: 'historia' },
    { id: 'geografia', name: 'Pacote de Ajuda: Geografia', price: 'R$ 9,90', icon: 'Globe', description: 'Mapas interativos e informações detalhadas sobre regiões e capitais.', slug: 'geografia' },
    { id: 'ingles', name: 'Pacote de Ajuda: Inglês', price: 'R$ 9,90', icon: 'SpellCheck', description: 'Traduções, pronúncias e exercícios extras para vocabulário.', slug: 'ingles' },
  ];

  const hintPackages = [
    { amount: 5, price: 'R$ 4,90', description: 'Pacote inicial de dicas para começar a usar a ajuda imediata.' },
    { amount: 15, price: 'R$ 9,90', description: 'Pacote intermediário, ideal para quem precisa de ajuda ocasional.' },
    { amount: 30, price: 'R$ 14,90', description: 'Pacote avançado, o melhor custo-benefício para suporte contínuo.' },
  ];

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
                <li className="flex items-center"><Lightbulb className="mr-3 h-5 w-5 text-primary" /> Acesso Ilimitado a todos os Pacotes de Ajuda</li>
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

      {/* Seção de Itens Avulsos (Dicas) */}
      <div className="max-w-4xl mx-auto space-y-8 mt-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-6 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-400" /> Dicas Avulsas (Saldo: {hintBalance})
        </h2>
        <p className="text-muted-foreground mb-6">
          Use dicas para obter ajuda imediata em qualquer lição, sem precisar de um pacote completo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hintPackages.map(pkg => (
            <Card key={pkg.amount} className="glass-card flex flex-col h-full text-center">
              <CardHeader className="pb-2">
                <Gift className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-2xl">{pkg.amount} Dicas</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{pkg.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  onClick={() => handleBuyHints(pkg.amount, pkg.price)} 
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                  disabled={isPremium}
                >
                  {isPremium ? 'Incluído no Premium' : `Comprar (${pkg.price})`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Seção de Pacotes de Ajuda por Matéria */}
      <div className="max-w-4xl mx-auto space-y-8 mt-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-6 flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" /> Pacotes de Ajuda por Matéria
        </h2>
        <p className="text-muted-foreground mb-6">
          Compre pacotes individuais para obter dicas e soluções avançadas em matérias específicas, ou assine o Premium para ter acesso a todos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {helpPackages.map(pkg => {
            const isPurchased = hasPackage(pkg.slug, isPremium);
            
            return (
              <Card key={pkg.id} className="glass-card flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name.split(': ')[1]}</CardTitle>
                    <Icon name={pkg.icon as any} className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{pkg.description}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  {isPurchased ? (
                    <Button variant="outline" className="w-full bg-green-600/20 text-green-400 border-green-600/50" disabled>
                      {isPremium ? 'Acesso Premium' : 'Pacote Ativo'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleBuyPackage(pkg.slug, pkg.name)} 
                      className="w-full bg-secondary hover:bg-secondary/80 text-foreground"
                      disabled={isPremium}
                    >
                      {isPremium ? 'Incluído no Premium' : `Comprar (${pkg.price})`}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Seção de Recursos Premium (mantida) */}
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold tracking-tighter mt-12 mb-6">Recursos Exclusivos</h2>
        
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