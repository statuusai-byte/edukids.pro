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

  // Se a idade já estiver definida, redirecionamos para /activities
  if (ageGroup) {
    // Redirecionamento imediato se a idade já estiver definida
    // No entanto, para manter a tela de boas-vindas visível, vamos apenas mostrar o botão de continuar.
  }

  return (
    <div className={cn(
      "min-h-[100dvh] flex flex-col items-center justify-center text-center p-4",
      "bg-starry-sky bg-cover bg-center" // Usando a classe de fundo de estrelas
    )}>
      <div className="relative z-10 max-w-lg mx-auto glass-card p-8 md:p-12">
        <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-slow-glow" />
        <h1 className="text-5xl font-extrabold tracking-tighter text-shadow-lg">
          Bem-vindo ao EDUKIDS+
        </h1>
        <p className="mt-4 text-xl text-white/80 text-shadow-md">
          Aprenda, jogue e evolua. Conteúdo educativo e jogos para crianças de 4 a 12 anos.
        </p>

        <div className="mt-8 space-y-4">
          {ageGroup ? (
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => navigate("/activities")}
            >
              Continuar como Explorador ({ageGroup})
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleActionClick}
              >
                <LogIn className="mr-2 h-5 w-5" /> Começar a Explorar
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-white/20 text-white hover:bg-white/10"
                onClick={handleActionClick}
              >
                <User className="mr-2 h-5 w-5" /> CRIAR CONTA
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