import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Bot, Loader2, Lightbulb, Send, X } from "lucide-react";
import { usePremium } from "@/context/PremiumContext";
import { showLoading, showError, dismissToast, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";
import { useHintsContext } from "@/context/HintsContext";
import { Input } from "@/components/ui/input";

const Store = () => {
  const { isPremium } = usePremium();
  const { user } = useSupabase();
  const { addHints } = useHintsContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      showError("Você precisa estar logado para iniciar uma assinatura.");
      return;
    }

    setIsCheckingOut(true);
    const loadingToast = showLoading("Iniciando checkout...");

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await supabase.auth.getSession().then((s) => s.data.session?.access_token)}`,
        },
      });

      if (error) throw new Error(error.message);
      if (!data || !data.checkout_url) throw new Error("Falha ao obter URL de checkout.");

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Checkout failed:", error);
      dismissToast(loadingToast);
      showError("Erro ao processar a assinatura. Tente novamente.");
      setIsCheckingOut(false);
    }
  };

  const handleBuyHints = (amount: number, packageName: string) => {
    if (!user) {
      showError("Você precisa estar logado para comprar dicas.");
      return;
    }

    const loading = showLoading(`Comprando ${packageName}...`);
    setTimeout(() => {
      addHints(amount);
      dismissToast(loading);
      showSuccess(`${packageName} comprado! ${amount} dicas foram adicionadas ao seu saldo.`);
    }, 1200);
  };

  const hintPackages = [
    { amount: 3, name: "Pacote Básico", price: "R$ 1,00", description: "Para começar a desvendar os desafios." },
    { amount: 8, name: "Pacote Padrão", price: "R$ 3,00", description: "Um bom suprimento de ajuda para continuar a aventura." },
    { amount: 15, name: "Pacote Explorador", price: "R$ 5,00", description: "O melhor valor! Dicas de sobra para os maiores exploradores." },
  ];

  const simulateAiResponse = (q: string) => {
    const text = q.trim().toLowerCase();
    if (!text) return "Tente escrever sua pergunta com palavras simples, por exemplo: 'Como eu resolvo 2+2?'.";
    if (/\b(soma|adicion|somar|\+)\b/.test(text)) return "Para somar, faça pequenos grupos e una-os: por exemplo, 3 + 2 = (1,2,3) + (1,2) → total 5.";
    return "Legal! Tente dividir a pergunta em passos curtinhos. Se não funcionar, peça ajuda a um adulto ou use uma dica para ver explicações detalhadas.";
  };

  const handleAiAsk = async () => {
    if (isPremium) {
      showError("IA Premium com voz estará disponível em breve para assinantes.");
      return;
    }
    if (!aiQuery.trim()) {
      showError("Digite uma pergunta para receber ajuda.");
      return;
    }
    setIsAiProcessing(true);
    const loading = showLoading("Pensando...");
    setTimeout(() => {
      const resp = simulateAiResponse(aiQuery);
      setAiResponse(resp);
      dismissToast(loading);
      showSuccess("Aqui vai uma dica rápida!");
      setIsAiProcessing(false);
    }, 900);
  };

  return (
    <div className="space-y-10">
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Loja EDUKIDS+</h1>
            <p className="mt-2 text-lg text-white/90 max-w-2xl">
              Desbloqueie a assinatura Premium ou compre pacotes de dicas para potencializar o aprendizado.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleCheckout} className="bg-white text-black font-bold shadow-md hover:scale-[1.02] transform transition" disabled={isCheckingOut}>
                {isCheckingOut ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando...</> : "Assinar Premium (R$ 19,90/mês)"}
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-96">
            <Card className="p-6 bg-white/10 border-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-300" /><div className="text-sm text-yellow-100">Plano Premium</div></div>
                  <h3 className="text-2xl font-bold mt-3">Acesso Total</h3>
                  <p className="text-sm text-white/90 mt-1">Atividades, relatórios e dicas ilimitadas.</p>
                </div>
                <div className="text-right"><div className="text-3xl font-extrabold">R$ 19,90</div><div className="text-sm text-white/80">/ mês</div></div>
              </div>
              <ul className="mt-5 space-y-3">
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-400" /> Acesso ilimitado a todas as atividades</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-400" /> Dicas de ajuda ilimitadas</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-400" /> Relatórios avançados dos pais</li>
              </ul>
              <CardFooter className="pt-4">
                {isPremium ? <Button variant="outline" className="w-full border-white/30 text-white/90" disabled>Seu Plano Atual</Button> : <Button onClick={handleCheckout} className="w-full bg-yellow-400 text-black font-bold hover:brightness-95">Assinar Agora</Button>}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Comprar Pacotes de Dicas</h2>
        <p className="text-muted-foreground mb-6">Ficou preso em um desafio? Compre dicas que podem ser usadas em qualquer matéria. Assinantes Premium têm dicas ilimitadas.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hintPackages.map((pkg) => (
            <Card key={pkg.name} className="glass-card p-4 flex flex-col h-full hover:scale-[1.01] transform transition">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-white/6 rounded-lg"><Lightbulb className="h-6 w-6 text-yellow-400" /></div>
                  <CardTitle>{pkg.name}</CardTitle>
                </div>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-extrabold text-yellow-400">{pkg.amount}</div>
                  <div className="text-lg text-muted-foreground">Dicas</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleBuyHints(pkg.amount, pkg.name)} className="w-full bg-secondary hover:bg-secondary/80 text-foreground">
                  Comprar ({pkg.price})
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center text-xs text-muted-foreground mt-6">
        <p>Para testes, use a opção de Assinar Premium ou os Pacotes de Dicas individuais.</p>
        <div className="mt-4"><Link to="/test-account" className="underline text-primary">Criar conta de teste</Link></div>
      </div>
    </div>
  );
};

export default Store;