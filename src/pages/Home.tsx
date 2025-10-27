import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl p-8 min-h-[80vh]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-80 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20800%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%234A00E0%22%20stroke-width%3D%221%22%3E%3Cpath%20d%3D%22M769%20229L1037%20260.9M927%20880L731%20737%20520%20621%20309%20505%2098%20389%20-113%20273%20-324%20157%20-535%2041%20-746%20-75%22%2F%3E%3Cpath%20d%3D%22M-225%20229L-22%20261%20376%20304%20774%20347%201172%20390%22%2F%3E%3Cpath%20d%3D%22M373%2029L781%20138%201189%20247%22%2F%3E%3Cpath%20d%3D%22M-535%20880L-349%20737%20-163%20594%2023%20451%20209%20308%20395%20165%20581%2022%22%2F%3E%3Cpath%20d%3D%22M-440%20-194L-254%20-51%20-68%2092%20118%20235%20304%20378%20490%20521%20676%20664%20862%20807%22%2F%3E%3Cpath%20d%3D%22M-440%20-194L-254%20-51%20-68%2092%20118%20235%20304%20378%20490%20521%20676%20664%20862%20807%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-10"></div>
      
      <div className="z-10 flex flex-col items-center">
        <div className="mb-4 rounded-full bg-primary/20 p-3 border border-primary/50">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter animate-fade-in-up">
          Sua Aventura do Saber Começa Agora
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          EDUKIDS+ transforma a aprendizagem em uma jornada épica. Explore mundos de conhecimento, complete missões e libere seu potencial!
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/30 transition-transform hover:scale-105">
            Começar Atividades <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 hover:text-white text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105">
            Explorar Cursos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;