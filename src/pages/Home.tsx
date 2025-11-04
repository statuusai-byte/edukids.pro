import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgeSelectionModal from "@/components/AgeSelectionModal";
import {
  ShieldCheck,
  BrainCircuit,
  Trophy,
  Sparkles,
  Users,
  Star,
  Gamepad2,
  GraduationCap,
  Download,
  Smartphone,
  Globe,
} from "lucide-react";

const SKIP_REDIRECT_KEY = "edukids_skip_auto_redirect";

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Segurança em primeiro lugar",
    description:
      "Ambiente protegido, controle parental com PIN e recomendações alinhadas a cada idade.",
  },
  {
    icon: BrainCircuit,
    title: "Play+ inteligente",
    description:
      "Jogos educativos interativos, quizzes ilimitados e um assistente que dá dicas quando precisa.",
  },
  {
    icon: Trophy,
    title: "Motivação contínua",
    description:
      "Recompensas, dicas extras e incentivos para manter o estudo divertido todos os dias.",
  },
] as const;

const impactStats = [
  { value: "5.200+", label: "Crianças aprendendo agora" },
  { value: "98%", label: "Pais satisfeitos com relatórios" },
  { value: "120+", label: "Jogos e atividades Play+" },
  { value: "∞", label: "Dicas para assinantes Premium" },
] as const;

const testimonials = [
  {
    name: "Carolina Souza",
    role: "Mãe do Theo (7 anos)",
    avatar: "https://i.pravatar.cc/120?u=carolina-edukids",
    quote:
      "“Meu filho pede para estudar sozinho! Os relatórios deixam tudo claro e as atividades são incríveis.”",
  },
  {
    name: "Marcelo Duarte",
    role: "Pai da Valentina (10 anos)",
    avatar: "https://i.pravatar.cc/120?u=marcelo-edukids",
    quote:
      "“O modo Premium salvou nossos estudos em casa. O assistente e as dicas deixam tudo mais leve.”",
  },
] as const;

const Home = () => {
  const { ageGroup, isLoading } = useAge();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && ageGroup) {
      try {
        const skip = localStorage.getItem(SKIP_REDIRECT_KEY);
        if (skip === "true") {
          localStorage.removeItem(SKIP_REDIRECT_KEY);
          return;
        }
      } catch {
        /* ignore storage errors */
      }
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, ageGroup, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"entrar" | "cadastrar" | null>(null);

  const openFor = (nextAction: "entrar" | "cadastrar") => {
    setAction(nextAction);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[560px] w-full items-center justify-center overflow-hidden px-6 text-center sm:min-h-[620px] sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 10% 10%, rgba(124,58,237,0.22), transparent 25%), radial-gradient(ellipse at 90% 90%, rgba(236,72,153,0.15), transparent 30%), linear-gradient(180deg, rgba(6,7,26,0.94), rgba(9,10,25,0.96))",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-15 mix-blend-screen"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1920&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <img
          src="https://images.unsplash.com/photo-1531206715517-5c0ba8f1d6d8?q=80&w=1200&auto=format&fit=crop"
          alt=""
          aria-hidden
          className="absolute right-6 top-16 hidden w-[360px] opacity-25 pointer-events-none lg:block"
        />

        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            <Sparkles className="h-4 w-4" />
            EDUKIDS+ Premium Learning
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl">
            Aprendizagem linda para crianças curiosas
          </h1>

          <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-lg">
            Conteúdo pensado para telas pequenas: Play+ com jogos educativos interativos e quizzes ilimitados, controlados por você.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row sm:gap-4">
            <Button
              onClick={() => openFor("entrar")}
              className="flex-1 bg-white text-black font-bold py-3 hover:bg-white/90"
            >
              Entrar agora
            </Button>
            <Button
              onClick={() => openFor("cadastrar")}
              className="flex-1 border border-white/40 text-white/90 py-3 bg-white/5 hover:bg-white/15"
            >
              Criar conta Premium
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/65 sm:text-xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Parental Control com PIN
            </span>
            <span className="flex items-center gap-1.5">
              <Gamepad2 className="h-4 w-4" />
              Play+ com jogos interativos
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              Pedagogia validada
            </span>
          </div>
        </motion.div>
      </section>

      {/* Impact stats */}
      <section className="relative z-10 -mt-14 px-5 pb-14 sm:px-10">
        <motion.div
          className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-secondary/60 px-4 py-8 shadow-[0_18px_70px_rgba(76,29,149,0.28)] backdrop-blur-2xl sm:px-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth sm:gap-6 md:grid md:grid-cols-4 md:overflow-visible">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-w-[150px] flex-col items-center justify-center rounded-2xl bg-white/5 px-4 py-5 text-center md:min-w-0"
              >
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary/90 via-fuchsia-400 to-amber-300 drop-shadow">
                  {stat.value}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section className="px-5 pb-14 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
              Premium por dentro
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Encanta crianças, tranquiliza famílias
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:max-w-xl sm:text-base">
              Play+ reúne jogos e atividades interativas, com IA para dar dicas na hora certa — tudo num ambiente seguro e supervisionado.
            </p>
          </div>

          <div className="flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible">
            {featureCards.map((feature) => (
              <motion.div
                key={feature.title}
                className="relative flex min-w-[230px] snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-secondary/60 p-5 shadow-lg shadow-primary/10 sm:min-w-0"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="absolute -top-16 right-0 h-36 w-36 rotate-12 bg-primary/20 blur-3xl" />
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-3 text-lg font-bold text-white sm:text-xl">{feature.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 pb-16 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary sm:text-sm">
              <Users className="h-4 w-4" />
              Comunidade EDUKIDS+
            </div>
            <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Escolha nº1 para estudar no celular
            </h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Assinando EDUKIDS+ você libera o modo offline (PWA), monitora o progresso em tempo
              real e garante dicas ilimitadas para qualquer matéria.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-[11px] text-white/80 sm:text-xs">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Star className="h-4 w-4 text-yellow-400" />
                Avaliação média 4.9/5
              </span>
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Conteúdo novo toda semana
              </span>
            </div>
          </div>

          <div className="flex snap-x gap-4 overflow-x-auto sm:grid sm:grid-cols-1 sm:gap-6 sm:overflow-visible">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                className="min-w-[240px] snap-start rounded-2xl border border-white/10 bg-secondary/60 p-5 shadow-inner shadow-black/20 sm:min-w-0"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-11 w-11 rounded-full border border-white/20 object-cover sm:h-12 sm:w-12"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/90">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + instalação */}
      <section className="px-5 pb-20 sm:px-10">
        <motion.div
          className="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/18 via-indigo-500/18 to-emerald-400/12 p-8 shadow-[0_30px_100px_rgba(76,29,149,0.35)] backdrop-blur-2xl sm:p-10 lg:grid-cols-[1.1fr,0.95fr]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:text-xs">
                <Download className="h-3.5 w-3.5" />
                Instale em poucos passos
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Baixe o EDUKIDS+ onde você estiver
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-base">
                Use o aplicativo Android oficial para uma experiência nativa ou instale o modo PWA no navegador e leve o Play+ para qualquer tela.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="flex-1 bg-white text-black font-semibold shadow-lg hover:bg-white/90"
              >
                <a
                  href="https://play.google.com/store/apps/details?id=app.vercel.edukidsspro.twa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baixar no Google Play
                </a>
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/40 text-white hover:bg-white/10"
                onClick={() => openFor("cadastrar")}
              >
                Criar conta e começar grátis
              </Button>
            </div>

            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Play+ completo com dicas ilimitadas para assinantes Premium.
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Parental PIN e painel de acompanhamento em tempo real.
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                Conteúdos semanais, conquistas e jogos testados para celular.
              </li>
            </ul>

            <p className="text-xs text-white/60">
              Preferiu continuar no navegador? Instale a versão PWA e tenha ícone na tela inicial, modo offline e atualização automática.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/15 bg-white/8 p-5 text-white/90 shadow-[0_20px_40px_rgba(15,23,42,0.55)]">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/25 p-3">
                  <Smartphone className="h-5 w-5 text-primary-light" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Instalação no Android</h4>
                  <p className="text-xs text-white/70">Aplicativo oficial otimizado para Play+.</p>
                </div>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-white/80">
                <li>1. Abra o link do Google Play e toque em <strong>Instalar</strong>.</li>
                <li>2. Faça login ou crie sua conta EDUKIDS+.</li>
                <li>3. Ative o Premium ou use o plano Free para começar.</li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/15 bg-secondary/70 p-5 text-foreground shadow-[0_20px_40px_rgba(2,6,23,0.45)]">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-3">
                  <Globe className="h-5 w-5 text-cyan-200" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Instalação PWA (Web App)</h4>
                  <p className="text-xs text-muted-foreground">
                    Sem loja de aplicativos, direto do navegador.
                  </p>
                </div>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>1. Abra <strong>edukids.app</strong> no Chrome, Edge ou Safari.</li>
                <li>2. Toque no menu ⋮ e escolha <strong>Adicionar à tela inicial</strong>.</li>
                <li>3. Confirme e pronto! O ícone aparece ao lado dos outros apps.</li>
              </ol>
              <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-xs text-white/80">
                Dica: o PWA funciona offline após o primeiro acesso e recebe atualizações automáticas através do mecanismo de PWA.
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <AgeSelectionModal open={modalOpen} onOpenChange={setModalOpen} action={action} />
    </div>
  );
};

export default Home;