import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, PlayCircle, Rocket } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[85vh]">
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 p-4 bg-primary/20 border border-primary/50 rounded-full animate-fade-in-up shadow-lg">
          <Rocket className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter animate-fade-in-up bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
          Sua Aventura do Saber
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Olá, Alex! Pronto para explorar, aprender e conquistar? Escolha seu caminho e vamos começar!
        </p>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/activities">
            <TiltCard className="p-8 h-full flex flex-col items-center justify-center text-center group">
              <div className="mb-4 p-4 bg-secondary rounded-full border border-white/10">
                <BookOpen className="h-12 w-12 text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h2 className="text-3xl font-bold text-white">Atividades</h2>
              <p className="text-muted-foreground mt-2">Desafios e jogos interativos para testar seus conhecimentos.</p>
              <Button variant="link" className="mt-4 text-primary text-lg">
                Começar a Jogar <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </TiltCard>
          </Link>
          
          <Link to="/courses">
            <TiltCard className="p-8 h-full flex flex-col items-center justify-center text-center group">
              <div className="mb-4 p-4 bg-secondary rounded-full border border-white/10">
                <PlayCircle className="h-12 w-12 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h2 className="text-3xl font-bold text-white">Cursos</h2>
              <p className="text-muted-foreground mt-2">Aulas em vídeo para aprender novas habilidades e conceitos.</p>
              <Button variant="link" className="mt-4 text-primary text-lg">
                Explorar Cursos <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </TiltCard>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;