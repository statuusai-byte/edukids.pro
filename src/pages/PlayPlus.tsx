import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useAge } from "@/context/AgeContext";
import { useNavigate } from "react-router-dom";
import DailyQuests from "@/components/DailyQuests";
import StudyTracks from "@/components/StudyTracks";
import { usePremium } from "@/context/PremiumContext";
import { Link } from "react-router-dom";

const PlayPlus = () => {
  const { ageGroup } = useAge();
  const { isPremium } = usePremium();
  const navigate = useNavigate();

  if (!isPremium) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-yellow-400" />
        <h1 className="text-3xl font-bold">Desbloqueie o Play+ com o Premium!</h1>
        <p className="mt-2 text-muted-foreground">
          A área Play+ com Trilhas de Estudo e Missões Diárias é um benefício exclusivo para assinantes Premium.
        </p>
        <Button className="mt-6 bg-yellow-400 text-black hover:bg-yellow-500" asChild>
          <Link to="/store">
            Ver Vantagens do Premium
          </Link>
        </Button>
      </div>
    );
  }

  if (!ageGroup) {
    return (
      <div className="glass-card p-8 text-center">
        <Sparkles className="mx-auto mb-4 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold">Defina a faixa etária para personalizar o Play+</h1>
        <p className="mt-2 text-muted-foreground">
          Vá até as configurações para escolher a idade e destravar as trilhas de estudo e missões.
        </p>
        <Button className="mt-6" onClick={() => navigate("/settings")}>
          Abrir Configurações
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tighter">Play+ • Trilhas e Missões</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Siga trilhas de estudo recomendadas e conclua missões diárias para manter o ritmo.
        </p>
      </section>

      <section>
        <DailyQuests />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Trilhas por Matéria</h2>
        <p className="text-sm text-muted-foreground">
          Continue de onde parou e avance no seu ritmo.
        </p>
        <StudyTracks />
      </section>
    </div>
  );
};

export default PlayPlus;