import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgeSelectionModal from "@/components/AgeSelectionModal";
import { ShieldCheck, BrainCircuit, Trophy, Sparkles, Users, Star, PlayCircle, GraduationCap } from "lucide-react";

const SKIP_REDIRECT_KEY = "edukids_skip_auto_redirect";

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Segurança em primeiro lugar",
    description: "Ambiente protegido, controle parental com PIN e recomendações alinhadas a cada idade.",
  },
  {
    icon: BrainCircuit,
    title: "Conteúdo inteligente",
    description: "Quizzes ilimitados, atividades gamificadas e IA assistente para desbloquear o aprendizado.",
  },
  {
    icon: Trophy,
    title: "Motivação contínua",
    description: "Sistema de recompensas, dicas extras e incentivos para manter o estudo divertido todos os dias.",
  },
] as const;

const impactStats = [
  { value: "5.200+", label: "Crianças aprendendo agora" },
  { value: "98%", label: "Pais satisfeitos com os relatórios" },
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
      "“O modo Premium salvou nossos estudos em casa. O assistente e as dicas deixaram tudo mais leve.”",
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
        // ignore storage errors and fall back to normal behavior
      }
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, ageGroup, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"entrar" | "cadastrar" | null>(null);

  const openFor = (a: "entrar" | "cadastrar") => {
    setAction(a);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col">
      <section className="relative flex h-[92vh] min-h-[640px] w-full items-center justify-center overflow-hidden px-6 text-center sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 10% 10%, rgba(124,58,237,0.22), transparent 25%), radial-gradient(ellipse at 90% 90%, rgba(236,72,153,0.15), transparent 30%), linear-gradient(180deg, rgba(6,7,26,0.92), rgba(9,10,25,0.96))",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 mix-blend-screen"
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
          className="absolute right-10 top-16 hidden w-[420px] opacity-25 pointer-events-none lg:block"
        />

        <motion.div
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
            <Sparkles className="h-4 w-4" /> EDUKIDS+ Premium Learning
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Aprendizagem maravilhosa para crianças curiosas
          </h1>

          <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Cursos, trilhas e missões criadas por especialistas, com IA assistente, controle parental completo e experiências multimídia — tudo em um só lugar.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              onClick={() => openFor("entrar")}
              className="flex-1 bg-white text-black font-bold py-3 hover:bg-white/90"
              aria-label="Entrar"
            >
              Entrar agora
            </Button>

            <Button
              onClick={() => openFor("cadastrar")}
              className="flex-1 border border-white/40 text-white/90 py-3 bg-white/5 hover:bg-white/15"
              aria-label="Cadastrar"
            >
              Criar conta Premium
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Parental Control com PIN
            </span>
            <span className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" /> +120 aulas em vídeo
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Pedagogia validada
            </span>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 -mt-16 px-6 pb-20 sm:px-10">
        <motion.div
          className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-secondary/60 px-6 py-10 shadow-[0_25px_80px_rgba(76,29,149,0.28)] backdrop-blur-2xl sm:px-10"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-fuchsia-400 to-amber-300 drop-shadow">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-6 pb-16 sm:px-10">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col gap-3 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Premium por dentro
            </span>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Uma plataforma feita para encantar crianças e tranquilizar famílias
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
              Cada experiência EDUKIDS+ é construída com propósito pedagógico, visual impecável e tecnologia que permite personalizar o ritmo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <motion.div
                key={feature.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-secondary/50 p-6 shadow-lg shadow-primary/10"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute -top-20 right-0 h-40 w-40 rotate-12 bg-primary/20 blur-3xl" />
                <feature.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-secondary/50 p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-primary">
                <Users className="h-4 w-4" /> Comunidade EDUKIDS+
              </div>
              <h3 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                Escolha número 1 das famílias que buscam evolução contínua
              </h3>
              <p className="mt-4 text-sm text-muted-foreground sm:text-base">
                Ao assinar EDUKIDS+, você libera conteúdos ilimitados, dicas com IA, relatórios detalhados para pais e experiências exclusivas em parceria com educadores e artistas.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
                  <Star className="h-4 w-4 text-yellow-400" /> Avaliação média 4.9/5
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
                  <Sparkles className="h-4 w-4 text-primary" /> Novos conteúdos toda semana
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.name}
                  className="rounded-2xl border border-white/10 bg-secondary/60 p-6 shadow-inner shadow-black/20"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full border border-white/20 object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/85">{testimonial.quote}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-indigo-500/20 to-emerald-400/10 p-10 text-center shadow-[0_30px_120px_rgba(76,29,149,0.35)] backdrop-blur-2xl">
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">Pronto para uma nova rotina de estudos?</h3>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            Comece gratuitamente, ative o modo Premium quando quiser e acompanhe cada pequena conquista do seu explorador ou exploradora.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => openFor("entrar")} className="bg-white text-black font-semibold hover:bg-white/90">
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
        </div>
      </section>

      <AgeSelectionModal open={modalOpen} onOpenChange={setModalOpen} action={action} />
    </div>
  );
};

export default Home;