"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgeSelectionModal from "@/components/AgeSelectionModal";
import PageTransition from "@/components/PageTransition";
import { Play } from "lucide-react"; // Import Play icon

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
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, ageGroup, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"entrar" | "cadastrar" | "explore" | null>(null);

  const openFor = (a: "entrar" | "cadastrar" | "explore") => {
    setAction(a);
    setModalOpen(true);
  };

  const starsUrl =
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1920&auto=format&fit=crop";

  return (
    <PageTransition>
      <div className="h-screen w-screen overflow-hidden">
        <section className="relative h-full w-full flex items-center justify-center text-center">
          {/* More vibrant, playful gradient background */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.3), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(236,72,153,0.3), transparent 50%), linear-gradient(180deg, #6366f1, #a855f7)", // Brighter, more playful gradient
              zIndex: 0,
            }}
          />

          {/* Subtle stars overlay for depth, adjusted opacity */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${starsUrl})`,
              opacity: 0.1, // Reduced opacity
              mixBlendMode: "screen",
              zIndex: 1,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Foreground content */}
          <motion.div
            className="relative z-20 flex flex-col items-center justify-center px-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 drop-shadow-lg"> {/* Adjusted gradient for title */}
              EDUKIDS+
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
              Aprendizagem lúdica e segura para crianças — jogos, quizzes e conteúdo pedagógico para todas as idades.
            </p>

            <div className="mt-6 flex gap-3 w-full max-w-md">
              <Button
                onClick={() => openFor("explore")}
                className="flex-1 bg-white text-purple-700 font-bold py-3 hover:bg-gray-100" // Adjusted button color
                aria-label="Começar a Explorar"
              >
                <Play className="h-4 w-4 mr-2" /> Começar a Explorar
              </Button>
            </div>

            <div className="mt-4 flex gap-3 w-full max-w-md">
              <Button
                onClick={() => openFor("entrar")}
                className="flex-1 border border-white/40 text-white/90 py-3 bg-transparent hover:bg-white/10" // Adjusted button style
                aria-label="Entrar"
              >
                Entrar
              </Button>

              <Button
                onClick={() => openFor("cadastrar")}
                className="flex-1 border border-white/40 text-white/90 py-3 bg-transparent hover:bg-white/10" // Adjusted button style
                aria-label="Cadastrar"
              >
                Cadastrar
              </Button>
            </div>

            <div className="mt-4 text-xs text-white/80"> {/* Adjusted text color */}
              <span>Selecione Entrar ou Cadastrar — em seguida escolha a faixa etária do explorador.</span>
            </div>
          </motion.div>

          <AgeSelectionModal open={modalOpen} onOpenChange={setModalOpen} action={action} />
        </section>

        {/* Secondary section: benefits (already responsive) */}
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center"> {/* Adjusted card background/border */}
            <div className="text-2xl font-bold text-white">Aprender Brincando</div>
            <div className="text-sm text-white/80 mt-2">Atividades lúdicas feitas para envolver crianças e ensinar conceitos.</div>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center"> {/* Adjusted card background/border */}
            <div className="text-2xl font-bold text-white">Segurança & Controle</div>
            <div className="text-sm text-white/80 mt-2">Painel dos pais, limite de tempo e PIN parental para compras.</div>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl border border-white/20 text-center"> {/* Adjusted card background/border */}
            <div className="text-2xl font-bold text-white">Dicas & Suporte</div>
            <div className="text-sm text-white/80 mt-2">Use dicas, assista anúncios para ganhar dicas ou adquira pacotes na Loja.</div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Index;