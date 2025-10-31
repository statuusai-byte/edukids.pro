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
  PlayCircle,
  GraduationCap,
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
    title: "Conteúdo inteligente",
    description:
      "Quizzes ilimitados, atividades gamificadas e IA assistente para desbloquear o aprendizado.",
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
  { value: "120+", label: "Cursos e trilhas exclusivas" },
  { value: "∞", label: "Dicas para assinantes Premium" },
] as const;

const testimonials = [
  {
    name: "Carolina Souza",
    role: "Mãe do Theo (7 anos)",
    avatar: "https://i.pravatar.cc/120?u=carolina-edukids",
    quote:
      "“Meu filho pede para estudar sozinho! Os relatórios deixam tudo claro e as aulas são incríveis.”",
  },
  {
    name: "Marcelo Duarte",
    role: "Pai da Valentina (10 anos)",
    avatar: "https://i.pravatar.cc/120?u=marcelo-edukids",
    quote:
      "“O modo Premium salvou nossos estudos em casa. O assistente e as dicas deixaram tudo mais leves.”",
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
            Trilhando conteúdo pedagógico, IA assistente e controle parental — tudo dentro de um
            ambiente seguro e interativo que cabe na palma da mão.
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
              <PlayCircle className="h-4 w-4" />
              +120 aulas em vídeo
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
              Conteúdo pensado para telas pequenas: cards interativos, vídeos responsivos e quizzes
              ilimitados para estudar em qualquer lugar.
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

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-10">
        <motion.div
          className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-primary/18 via-indigo-500/18 to-emerald-400/12 p-8 text-center shadow-[0_30px_100px_rgba(76,29,149,0.35)] backdrop-blur-2xl sm:p-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
            Pronto para levar o EDUKIDS+ para o seu app?
          </h3>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            Instale o PWA, acesse os conteúdos offline e acompanhe cada conquista. Comece grátis e
            ative o Premium quando quiser.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <Button onClick={() => openFor("entrar")} className="bg-white text-black font-semibold">
              Já tenho conta
            </Button>
            <Button
              onClick={() => openFor("cadastrar")}
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10"
            >
              Criar conta grátis
            </Button>
          </div>
        </motion.div>
      </section>

      <AgeSelectionModal open={modalOpen} onOpenChange={setModalOpen} action={action} />
    </div>
  );
};

export default Home;