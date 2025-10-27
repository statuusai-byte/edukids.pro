import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div
        className="w-full rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 md:p-16 shadow-2xl"
        style={{
          perspective: "1000px",
        }}
      >
        <div
          className="transform transition-transform duration-500"
          style={{ transform: "rotateX(10deg) translateZ(50px)" }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Bem-vindo ao EDUKIDS+
          </h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            A plataforma onde a aprendizagem se torna uma aventura inesquecível. Explore, descubra e cresça!
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full shadow-lg">
              Começar Atividades <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 rounded-full shadow-lg">
              Ver Cursos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;