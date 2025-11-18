import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, User, LogIn, Rocket, Loader2 } from "lucide-react";
import AgeSelectionModal from "@/components/AgeSelectionModal";
import { useAge } from "@/context/AgeContext";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/context/SupabaseContext";

const Home = () => {
  const { ageGroup } = useAge();
  const { session, isLoading } = useSupabase();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleActionClick = () => {
    if (ageGroup) {
      navigate("/activities");
      return;
    }
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-[100dvh] flex flex-col items-center justify-center text-center p-4",
      "bg-starry-sky bg-cover bg-center"
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
          {session ? (
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleActionClick}
            >
              <Rocket className="mr-2 h-5 w-5" />
              {ageGroup ? `Continuar como Explorador (${ageGroup})` : 'Selecionar Idade e Começar'}
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Link to="/login">
                  <LogIn className="mr-2 h-5 w-5" /> Entrar
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                <Link to="/register">
                  <User className="mr-2 h-5 w-5" /> CRIAR CONTA
                </Link>
              </Button>
            </>
          )}
        </div>
        
        <p className="mt-6 text-xs text-muted-foreground">
          {session ? "Seu progresso será salvo na sua conta." : "Crie uma conta para salvar seu progresso."}
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