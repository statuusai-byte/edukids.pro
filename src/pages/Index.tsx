"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgeSelectionModal from "@/components/AgeSelectionModal";
import PageTransition from "@/components/PageTransition";
import { Play, Rocket, ShieldCheck, Sparkles } from "lucide-react";

const SKIP_REDIRECT_KEY = "edukids_skip_auto_redirect";

const Index = () => {
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
      } catch (e) {
        // ignore storage errors
      }
      navigate("/activities", { replace: true });
    }
  }, [isLoading, ageGroup, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"entrar" | "cadastrar" | "explore" | null>(null);

  const openFor = (a: "entrar" | "cadastrar" | "explore") => {
    setAction(a);
    setModalOpen(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full overflow-x-hidden">
        <section className="relative h-screen w-full flex flex-col items-center justify-center text-center p-4">
          <div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 50% at 50% -20%, hsla(var(--primary), 0.3), transparent), radial-gradient(ellipse 80% 50% at 50% 120%, hsla(var(--accent), 0.3), transparent)",
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-300 to-yellow-300 text-shadow-lg">
              EDUKIDS+
            </h1>

            <p className="mt-4 max-w-2xl text-base sm:text-lg text-foreground/80 leading-relaxed">
              Aprendizagem lúdica e segura para crianças — jogos, quizzes e conteúdo pedagógico para todas as idades.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                onClick={() => openFor("explore")}
                className="flex-1 bg-primary text-primary-foreground font-bold text-lg py-6 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                aria-label="Começar a Explorar"
              >
                <Play className="h-5 w-5 mr-2" /> Começar a Explorar
              </Button>
            </div>

            <div className="mt-4 flex gap-4 w-full max-w-md">
              <Button
                onClick={() => openFor("entrar")}
                className="flex-1 border border-white/20 text-foreground/90 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                aria-label="Entrar"
              >
                Entrar
              </Button>

              <Button
                onClick={() => openFor("cadastrar")}
                className="flex-1 border border-white/20 text-foreground/90 py-3 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                aria-label="Cadastrar"
              >
                Cadastrar
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="py-16 sm:py-24 px-4">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 glass-card">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Aprender Brincando</h3>
              <p className="text-muted-foreground mt-2">Atividades lúdicas feitas para envolver crianças e ensinar conceitos complexos de forma simples.</p>
            </div>
            <div className="p-6 glass-card">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Segurança & Controle</h3>
              <p className="text-muted-foreground mt-2">Painel dos pais, limite de tempo de tela e PIN parental para total tranquilidade.</p>
            </div>
            <div className="p-6 glass-card">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold">Dicas & Suporte</h3>
              <p className="text-muted-foreground mt-2">Assistente de estudos, dicas por recompensa e pacotes de ajuda para nunca deixar uma dúvida para trás.</p>
            </div>
          </div>
        </section>
      </div>
      <AgeSelectionModal open={modalOpen} onOpenChange={setModalOpen} action={action} />
    </PageTransition>
  );
};

export default Index;