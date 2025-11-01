import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Star, Loader2, Lightbulb, Sparkles, ShieldCheck, WifiOff } from "lucide-react";
import { usePremium } from "@/context/PremiumContext";
import { showLoading, showError, dismissToast, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";
import { useHintsContext } from "@/context/HintsContext";
import { cn } from "@/lib/utils";

type HintPackage = {
  amount: number;
  name: string;
  price: string;
  description: string;
  popular?: boolean;
  accent: string;
};

const hintPackages: HintPackage[] = [
  { amount: 3, name: "Pacote Explorador", price: "R$ 1,00", description: "Para desbloquear uma ajuda rápida.", accent: "from-amber-300 to-orange-400" },
  { amount: 8, name: "Pacote Comandante", price: "R$ 3,00", description: "Equilíbrio ideal para a semana inteira.", popular: true, accent: "from-fuchsia-300 to-purple-500" },
  { amount: 15, name: "Pacote Mestre", price: "R$ 5,00", description: "Reserve dicas para missões avançadas.", accent: "from-sky-300 to-blue-500" },
];

const freeFeatures = [
  "Acesso a jogos e quizzes grátis",
  "Controle de idade e acesso",
  "Assistente com dicas limitadas",
  "Anúncios leves entre atividades",
];

const premiumFeatures = [
  "Acesso a todos os jogos Play+",
  "Dicas ilimitadas nos estudos",
  "Experiência sem anúncios",
  "IA de voz explicativa (em breve)",
  "Relatórios de progresso",
  "Controle parental avançado",
  "Lições e quizzes exclusivos",
  "Modo offline (via PWA)",
  "Suporte prioritário",
  "Novidades toda semana",
];

const Store = () => {
  const { isPremium } = usePremium();
  const { user } = useSupabase();
  const { addHints } = useHintsContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      showError("Você precisa estar logado para iniciar uma assinatura.");
      return;
    }

    setIsCheckingOut(true);
    const loadingToast = showLoading("Iniciando checkout...");

    try {
      const sessionRes = await supabase.auth.getSession();
      const token = sessionRes.data.session?.access_token;

      const invokeOptions: Record<string, unknown> = {
        method: "POST",
      };
      if (token) {
        invokeOptions.headers = { Authorization: `Bearer ${token}` };
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", invokeOptions);

      if (error) throw new Error(error.message || "Erro ao criar sessão de checkout.");
      if (!data || !data.checkout_url) throw new Error("Falha ao obter URL de checkout.");

      window.location.href = data.checkout_url;
    } catch (error: any) {
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

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#6d28d9] via-[#8b5cf6] to-[#ec4899] p-8 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{ backgroundImage: "radial-gradient(circle at top, #f9fafb33, transparent 55%)" }} />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Loja EDUKIDS+</h1>
            <p className="max-w-2xl text-lg text-white/90">
              O plano Premium libera todo o Play+, remove anúncios e em breve trará uma IA de voz de alta qualidade lendo e explicando as atividades.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-white/80">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Sem anúncios para assinantes
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <Sparkles className="h-4 w-4 text-yellow-200" />
                IA de voz em desenvolvimento
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <WifiOff className="h-4 w-4 text-sky-200" />
                Compatível com PWA offline
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCheckout}
                className="bg-white text-black font-bold shadow-md hover:bg-white/90"
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Assinar Premium (R$ 19,90/mês)"
                )}
              </Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10" asChild>
                <Link to="/test-account">Criar conta de teste</Link>
              </Button>
            </div>
          </div>

          <Card className="w-full max-w-md border-white/20 bg-white/10 backdrop-blur-lg">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-yellow-100">
                    <Star className="h-4 w-4" />
                    Plano Premium
                  </div>
                  <h3 className="mt-3 text-2xl font-bold text-white">Acesso Total + IA de voz (em breve)</h3>
                  <p className="text-sm text-white/85">
                    Conteúdo completo, zero anúncios e um assistente que em breve fala com a criança.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-white">R$ 19,90</span>
                  <div className="text-sm text-white/80">/ mês</div>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Jogos exclusivos do Play+ liberados na hora
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  Relatórios avançados para responsáveis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300" />
                  IA de voz de qualidade chegando em breve
                </li>
              </ul>
              <Button
                onClick={handleCheckout}
                className="w-full bg-yellow-300 text-black font-bold hover:bg-yellow-200"
                disabled={isPremium || isCheckingOut}
              >
                {isPremium ? "Você já é Premium" : "Quero ser Premium"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-2">Comparativo rápido</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Entenda o que cada plano oferece — equilibramos recursos para quem continua no modo gratuito e para quem decide assinar.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-secondary/70">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-3">
                  <Sparkles className="h-6 w-6 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Plano Free</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Gratuito, sem necessidade de cartão
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-300/80" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/40 bg-secondary/80 shadow-[0_15px_45px_rgba(79,70,229,0.25)]">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Plano Premium</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary/80">
                    Tudo do Free + extras poderosos
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-foreground">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-2">
        <h2 className="text-3xl font-bold mb-2">Comprar pacotes de dicas</h2>
        <p className="text-muted-foreground mb-6">
          Os pacotes funcionam como reforço extra. Assinantes Premium já possuem dicas ilimitadas e podem aguardar a IA de voz que está chegando.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hintPackages.map((pkg) => (
            <div
              key={pkg.name}
              className={cn(
                "relative rounded-3xl border border-white/10 bg-secondary/80 p-px shadow-lg transition-transform hover:-translate-y-1",
                pkg.popular && "shadow-[0_20px_60px_rgba(168,85,247,0.35)]"
              )}
            >
              <div className={cn("rounded-[calc(theme(borderRadius.3xl)-1px)] p-6 h-full bg-secondary/95 flex flex-col")}>
                {pkg.popular && (
                  <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                    Mais Popular
                  </div>
                )}
                <div className="flex-grow space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br", pkg.accent)}>
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70">{pkg.amount}</span>
                    <span className="ml-2 text-lg text-muted-foreground">dicas</span>
                  </div>
                </div>
                <CardFooter className="p-0 pt-6">
                  <Button
                    onClick={() => handleBuyHints(pkg.amount, pkg.name)}
                    className="w-full"
                    disabled={isPremium}
                  >
                    {isPremium ? "Dicas Ilimitadas" : `Comprar (${pkg.price})`}
                  </Button>
                </CardFooter>
              </div>
            </div>
          ))}
        </div>
        {isPremium && (
          <p className="mt-4 text-center text-sm text-yellow-400">
            Você é um assinante Premium e já possui dicas ilimitadas!
          </p>
        )}
      </section>
    </div>
  );
};

export default Store;