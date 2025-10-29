import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgeSelectionModal from "@/components/AgeSelectionModal";

const Home = () => {
  const { ageGroup, isLoading } = useAge();
  const navigate = useNavigate();

  // If the user already selected an age on a previous run, open the app directly.
  useEffect(() => {
    if (!isLoading && ageGroup) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, ageGroup, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<"entrar" | "cadastrar" | null>(null);

  const openFor = (a: "entrar" | "cadastrar") => {
    setAction(a);
    setModalOpen(true);
  };

  // Decorative stars layer (kept) and a subtle nebula gradient background to replace placeholder image
  const starsUrl =
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1920&auto=format&fit=crop";
  const earthUrl =
    "https://images.unsplash.com/photo-1531206715517-5c0ba8f1d6d8?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="h-screen w-screen overflow-hidden">
      <section className="relative h-full w-full flex items-center justify-center text-center">
        {/* Nebula gradient background (no placeholder text) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 10% 10%, rgba(124,58,237,0.18), transparent 20%), radial-gradient(ellipse at 90% 90%, rgba(236,72,153,0.10), transparent 30%), linear-gradient(180deg, rgba(6,7,26,0.9), rgba(9,10,25,0.95))",
            zIndex: 0,
          }}
        />

        {/* Stars overlay for depth */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${starsUrl})`,
            opacity: 0.18,
            mixBlendMode: "screen",
            zIndex: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Decorative earth/asset (keeps design richness) */}
        <img
          src={earthUrl}
          alt=""
          aria-hidden
          className="absolute right-8 top-8 opacity-28 pointer-events-none w-64 lg:w-[420px] z-10"
          style={{ zIndex: 2 }}
        />

        {/* Foreground content */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center px-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-fuchsia-500 to-yellow-400 drop-shadow-lg">
            EDUKIDS+
          </h1>

          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
            Aprendizagem lúdica e segura para crianças — jogos, quizzes e conteúdo pedagógico para todas as idades.
          </p>

          <div className="mt-6 flex gap-3 w-full max-w-md">
            <Button
              onClick={() => openFor("entrar")}
              className="flex-1 bg-white text-black font-bold py-3"
              aria-label="Entrar"
            >
              Entrar
            </Button>

            <Button
              onClick={() => openFor("cadastrar")}
              className="flex-1 border border-white/20 text-white/90 py-3 bg-secondary/30 hover:bg-secondary/40"
              aria-label="Cadastrar"
            >
              Cadastrar
            </Button>
          </div>

          <div className="mt-4 text-xs text-white/70">
            <span>Selecione Entrar ou Cadastrar — em seguida escolha a faixa etária do explorador.</span>
          </div>
        </motion.div>

        {/* Modal that opens when Entrar/Cadastrar is pressed */}
        <AgeSelectionModal open={modalOpen} onOpenChange={setModalOpen} action={action} />
      </section>
    </div>
  );
};

export default Home;