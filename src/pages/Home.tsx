"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";
import { Sparkles } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSupabase();

  React.useEffect(() => {
    if (!isLoading && user) {
      navigate("/activities", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Sparkles className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-starry-sky bg-cover bg-center">
      <div className="absolute inset-0 bg-black/60 z-0" />
      <section className="relative z-10 max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 text-white text-shadow-lg animate-fade-in-up">
          Bem-vindo ao EDUKIDS+
        </h1>

        <p className="text-lg text-gray-300 mb-8 text-shadow-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Aprenda, jogue e evolua — tudo em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={handleLoginClick}
            className="flex-1 border border-white/20 text-white/90 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          >
            Entrar
          </Button>

          <Button
            onClick={handleRegisterClick}
            className="flex-1 bg-primary text-primary-foreground py-3 hover:brightness-95"
          >
            Criar conta
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Home;