import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Rocket, UserPlus, Loader2 } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseContext';
import { useEffect } from 'react';

const Home = () => {
  const { user, isLoading } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/activities', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-starry-sky bg-cover bg-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-center p-4 bg-starry-sky bg-cover bg-center text-white">
      <header className="w-full p-6 z-20">
        <h1 className="relative text-4xl font-bold tracking-tighter">
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent blur-md opacity-75">
            EDUKIDS TOP
          </span>
          <span className="relative bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            EDUKIDS TOP
          </span>
        </h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-shadow-lg animate-fade-in-down">
          Desbloqueie o Universo do Conhecimento
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/80 animate-fade-in-up animation-delay-300">
          Uma plataforma de aprendizado divertida e interativa para crianças, transformando a educação em uma aventura épica.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Link to="/login">
              <Rocket className="mr-2 h-5 w-5" />
              Começar a Aprender
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:text-white font-bold py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
            <Link to="/register">
              <UserPlus className="mr-2 h-5 w-5" />
              Criar Conta
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;