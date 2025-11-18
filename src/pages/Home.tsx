import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, User, LogIn } from "lucide-react";
import AgeSelectionModal from "@/components/AgeSelectionModal";
import { useAge } from "@/context/AgeContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Home = () => {
  const { ageGroup } = useAge();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleActionClick = () => {
    // Em modo liberado, se a idade já estiver definida, vamos direto para /activities
    if (ageGroup) {
      navigate("/activities");
      return;
    }
    
    // Se a idade não estiver definida, abrimos o modal de seleção de idade
    setModalOpen(true);
  };

  return (
    <div className={cn(
      "min-h-[100dvh] flex flex-col items-center justify-center text-center p-4",
      "bg-background" // Usando o fundo base, o AmbientBackground cuidará da nebulosa
    )}>
      <div 
        className={cn(
          "relative z-10 max-w-lg mx-auto glass-card p-8 md:p-12",
          "shadow-[0_0_60px_rgba(124,58,237,0.4)] border-primary/50", // Neumorfismo Luminoso
          "animate-float-subtle" // Flutuação sutil
        )}
      >
        {/* Anel de luz pulsante ao redor do ícone */}
        <div className="relative mx-auto w-fit mb-6">
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-50 animate-ping" />
          <Sparkles className="h-16 w-16 text-yellow-400 mx-auto relative z-10 animate-slow-glow" />
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tighter text-shadow-lg bg-gradient-to-r from-primary via-fuchsia-500 to-yellow-400 text-transparent bg-clip-text">
          Bem-vindo ao EDUKIDS+
        </h1>
        <p className="mt-4 text-xl text-white/80 text-shadow-md">
          Aprenda, jogue e evolua. Conteúdo educativo e jogos para crianças de 4 a 12 anos.
        </p>

        <div className="mt-8 space-y-4">
          {ageGroup ? (
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 animate-pulse-subtle"
              onClick={() => navigate("/activities")}
            >
              Continuar como Explorador ({ageGroup})
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 animate-pulse-subtle"
                onClick={handleActionClick}
              >
                <LogIn className="mr-2 h-5 w-5" /> Começar a Explorar
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-white/40 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]" // Efeito Neon Border
                onClick={handleActionClick}
              >
                <User className="mr-2 h-5 w-5" /> Definir Idade
              </Button>
            </>
          )}
        </div>
        
        <p className="mt-6 text-xs text-muted-foreground">
          O aplicativo está em modo de análise. O progresso é salvo localmente.
        </p>
      </div>

      <AgeSelectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Home;