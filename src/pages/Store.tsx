import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Bot, Users, BarChart3, Loader2, X, Send } from "lucide-react";
import { usePremium } from "@/context/PremiumContext";
import { showLoading, showError, dismissToast, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";
import { Icon } from "@/components/Icon";
import { useHelpPackages } from "@/hooks/useHelpPackages";
import { Input } from "@/components/ui/input";

const Store = () => {
  const { isPremium } = usePremium();
  const { user } = useSupabase();
  const { purchasePackage, hasPackage } = useHelpPackages();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // IA simples (apenas para FREE: simula respostas de texto)
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

  const handleBuyPackage = (subjectSlug: string, packageName: string) => {
    if (!user) {
      showError("Você precisa estar logado para comprar pacotes.");
      return;
    }

    const loading = showLoading(`Comprando pacote ${packageName}...`);
    setTimeout(() => {
      purchasePackage(subjectSlug);
      dismissToast(loading);
      showSuccess(`Pacote de Ajuda '${packageName}' comprado com sucesso!`);
    }, 1200);
  };

  const helpPackages = [
    { id: "matematica", name: "Pacote de Ajuda: Matemática", price: "R$ 9,90", icon: "Sigma", description: "Dicas e soluções detalhadas para todos os exercícios de Matemática.", slug: "matematica" },
    { id: "portugues", name: "Pacote de Ajuda: Português", price: "R$ 9,90", icon: "BookOpen", description: "Acesso a gabaritos e explicações de gramática e interpretação.", slug: "portugues" },
    { id: "ciencias", name: "Pacote de Ajuda: Ciências", price: "R$ 9,90", icon: "FlaskConical", description: "Guias de experimentos e informações extras sobre o corpo humano e natureza.", slug: "ciencias" },
    { id: "historia", name: "Pacote de Ajuda: História", price: "R$ 9,90", icon: "Landmark", description: "Linhas do tempo interativas e resumos de eventos históricos.", slug: "historia" },
    { id: "geografia", name: "Pacote de Ajuda: Geografia", price: "R$ 9,90", icon: "Globe", description: "Mapas interativos e informações detalhadas sobre regiões e capitais.", slug: "geografia" },
    { id: "ingles", name: "Pacote de Ajuda: Inglês", price: "R$ 9,90", icon: "SpellCheck", description: "Traduções, pronúncias e exercícios extras para vocabulário.", slug: "ingles" },
  ];

  // Resposta simulada simples (para usuários free)
  const simulateAiResponse = (q: string) => {
    const text = q.trim().toLowerCase();

    if (!text) return "Tente escrever sua pergunta com palavras simples, por exemplo: 'Como eu resolvo 2+2?'.";

    if (/\b(conta|contar|quantos|quantas|número|numero)\b/.test(text)) {
      return "Dica de contagem: conte um por um e marque com o dedo ou desenhe objetos; depois junte grupos iguais para somar.";
    }

    if (/\b(soma|adicion|somar|\+)\b/.test(text)) {
      return "Para somar, faça pequenos grupos e una-os: por exemplo, 3 + 2 = (1,2,3) + (1,2) → total 5.";
    }

    if (/\b(subtra|menos|-)\b/.test(text)) {
      return "Para subtrair, retire objetos de um conjunto: se tem 5 e tira 2, sobra 3. Use desenhos para visualizar.";
    }

    if (/\b(palavra|sílaba|silaba|ler|escrever)\b/.test(text)) {
      return "Para formar palavras, separe em sílabas e junte devagar: BO + LA = BOLA. Leia em voz alta para ajudar.";
    }

    if (/\b(porque|por que)\b/.test(text)) {
      return "Boa pergunta! Tente dividir o problema em passos e olhar cada parte: muitas respostas aparecem assim.";
    }

    return "Legal! Tente dividir a pergunta em passos curtinhos. Se não funcionar, peça ajuda a um adulto ou compre o pacote de ajuda para ver explicações detalhadas.";
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
      {/* Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 p-8 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Loja EDUKIDS+</h1>
            <p className="mt-2 text-lg text-white/90 max-w-2xl">
              Desbloqueie conteúdos exclusivos, pacotes de ajuda por matéria e recursos Premium para potencializar o aprendizado.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleCheckout} className="bg-white text-black font-bold shadow-md hover:scale-[1.02] transform transition" disabled={isCheckingOut}>
                {isCheckingOut ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando...</> : "Assinar Premium (R$ 19,90/mês)"}
              </Button>
              <Button variant="ghost" className="border border-white/20 text-white/90" onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}>
                Ver Pacotes de Ajuda
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-96">
            <Card className="p-6 bg-white/10 border-white/20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <div className="text-sm text-yellow-100">Mais Popular</div>
                  </div>
                  <h3 className="text-2xl font-bold mt-3">Plano Premium</h3>
                  <p className="text-sm text-white/90 mt-1">Acesso completo a tudo: atividades, pacotes, relatórios e IA premium.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold">R$ 19,90</div>
                  <div className="text-sm text-white/80">/ mês</div>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-400" /> Acesso ilimitado a todas as atividades</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-400" /> Relatórios avançados dos alunos</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-400" /> Pacotes de Ajuda inclusos</li>
              </ul>

              <CardFooter className="pt-4">
                {isPremium ? (
                  <Button variant="outline" className="w-full border-white/30 text-white/90" disabled>
                    Seu Plano Atual
                  </Button>
                ) : (
                  <Button onClick={handleCheckout} className="w-full bg-yellow-400 text-black font-bold hover:brightness-95">
                    Assinar Agora
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Pacotes */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Pacotes de Ajuda por Matéria</h2>
        <p className="text-muted-foreground mb-6">Compre pacotes individuais para obter dicas e soluções avançadas em matérias específicas, ou assine o Premium para ter acesso a todos.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpPackages.map((pkg) => {
            const isPurchased = hasPackage(pkg.slug, isPremium);

            return (
              <Card key={pkg.id} className="glass-card p-4 flex flex-col h-full hover:scale-[1.01] transform transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/6 rounded-lg">
                      <Icon name={pkg.icon as any} className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{pkg.name.split(": ")[1]}</div>
                      <div className="text-xs text-muted-foreground">{pkg.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{pkg.price}</div>
                    <div className="text-xs text-muted-foreground">Pagamento único</div>
                  </div>
                </div>

                <CardContent className="mt-4 flex-grow">
                  <div className="text-sm text-muted-foreground line-clamp-3">{pkg.description}</div>

                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Dicas passo-a-passo</div>
                    <div className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> Conteúdos extras</div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  {isPurchased ? (
                    <Button variant="outline" className="w-full bg-green-600/10 text-green-300 border-green-600/30" disabled>
                      {isPremium ? "Acesso Premium" : "Pacote Ativo"}
                    </Button>
                  ) : (
                    <Button onClick={() => handleBuyPackage(pkg.slug, pkg.name)} className="w-full bg-secondary hover:bg-secondary/80 text-foreground">
                      Comprar ({pkg.price})
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Recursos Premium */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card p-4">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Relatórios Avançados
              </CardTitle>
              <CardDescription>Visualize progresso, tempo de tela por matéria e recomendações.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-secondary/50 rounded-lg mt-4 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Pré-visualização do gráfico de desempenho.</p>
              </div>
            </CardContent>
          </Card>

          {/* IA Card */}
          <Card className="glass-card p-4 relative">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> {isPremium ? "IA Premium (em breve)" : "IA de Texto — Ajuda Rápida"}
              </CardTitle>
              <CardDescription>
                {isPremium
                  ? "Em breve: Open AiGemini 2.5pro (voz natural) para ajudar nos estudos — exclusivo para assinantes Premium."
                  : "Use o botão abaixo para abrir o assistente e pedir uma dica curta sobre exercícios e palavras."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="text-sm text-muted-foreground">
                  {isPremium
                    ? "Estamos trabalhando para trazer IA com voz natural que leia explicações e interaja com a criança — fique atento!"
                    : "Crie perguntas simples e receba dicas amigáveis e passo a passo."}
                </div>

                {/* Área de resposta (se houver) */}
                {aiResponse && (
                  <div className="p-3 bg-secondary/30 rounded-md border border-white/6 text-sm text-foreground">
                    <div className="font-medium mb-2">Dica rápida</div>
                    <div>{aiResponse}</div>
                  </div>
                )}

                {/* Campo de entrada (aparece quando o painel está aberto) */}
                {aiOpen && (
                  <div className="space-y-2">
                    <Input
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder={isPremium ? "Disponível em breve no Premium" : "Escreva sua pergunta aqui..."}
                      disabled={isPremium}
                      aria-label="Pergunta ao assistente"
                    />
                    <div className="flex items-center gap-2">
                      <Button onClick={handleAiAsk} disabled={isPremium || isAiProcessing} className="flex items-center gap-2">
                        {isAiProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Perguntar
                      </Button>
                      <Button variant="ghost" onClick={() => { setAiOpen(false); setAiResponse(null); }}>
                        <X className="h-4 w-4" />
                        Fechar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão circular para abrir o assistente */}
              <div className="mt-6 flex items-center justify-center">
                <button
                  aria-label="Abrir assistente"
                  onClick={() => {
                    if (isPremium) {
                      // Para premium apenas exibimos a informação "em breve"
                      showSuccess("IA Premium com voz estará disponível em breve!");
                      return;
                    }
                    setAiOpen((v) => !v);
                  }}
                  className={`group relative inline-flex items-center justify-center h-14 w-14 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none ${
                    isPremium ? "bg-primary/30 cursor-not-allowed opacity-80" : "bg-yellow-400"
                  }`}
                >
                  <Bot className={`h-7 w-7 ${isPremium ? "text-white/70" : "text-black"}`} />
                  <span className="sr-only">Abrir assistente de ajuda</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="text-center text-xs text-muted-foreground mt-6">
        <p>Nota: a IA integrada aqui é uma versão de ajuda rápida; o IA Premium com voz natural será lançado em breve para assinantes.</p>
        <p className="mt-2">Para testes, use a opção de Assinar Premium ou os Pacotes de Ajuda individuais.</p>
        <div className="mt-4">
          <Link to="/test-account" className="underline text-primary">Criar conta de teste</Link>
        </div>
      </div>
    </div>
  );
};

export default Store;