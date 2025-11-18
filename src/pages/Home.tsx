import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-starry-sky bg-cover bg-center text-white">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black/50 p-4 sm:p-8">
        <main className="text-center max-w-3xl">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4 animate-slow-glow" />
          <h1 className="text-5xl font-extrabold tracking-tighter text-shadow-lg">
            Bem-vindo ao{' '}
            <span className="relative">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent blur-md opacity-75">
                EDUKIDS+
              </span>
              <span className="relative bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                EDUKIDS+
              </span>
            </span>
          </h1>
          <p className="mt-4 text-xl text-white/80 text-shadow-md">
            A plataforma onde o aprendizado se transforma em uma aventura espacial!
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white/20">
              <Link to="/activities">
                <Rocket className="mr-2 h-5 w-5" />
                Começar a Aventura
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:text-white font-bold py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              <Link to="/about">
                <BookOpen className="mr-2 h-5 w-5" />
                Saber Mais
              </Link>
            </Button>
          </div>
        </main>

        <footer className="absolute bottom-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} EDUKIDS+. Todos os direitos reservados.</p>
          <p className="text-sm mt-1">Feito com ❤️ para os pequenos exploradores do conhecimento.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;