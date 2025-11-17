"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/context/SupabaseContext";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useSupabase(); // Keep isLoading check

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
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-cosmic-nebula bg-cover bg-center">
      {/* Overlay para escurecer a nebulosa e aumentar o contraste */}
      <div className="absolute inset-0 bg-black/70 z-0" />
      
      <section className="relative z-10 max-w-4xl w-full text-center">
        <h1 
          className={cn(
            "text-4xl sm:text-6xl font-extrabold mb-4 text-transparent bg-clip-text animate-fade-in-up",
            "bg-gradient-to-r from-primary via-fuchsia-500 to-orange-400",
            "text-neon-glow"
          )} 
          style={{ animationDelay: '0.1s' }}
        >
          Bem-vindo ao EDUKIDS+
        </h1>

        <p className="text-lg text-gray-300 mb-10 text-shadow-md animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Aprenda e evolua — sua jornada pelo conhecimento começa agora.
        </p>

        <div className={cn(
          "flex flex-col sm:flex-row gap-4 max-w-md mx-auto p-6 rounded-3xl",
          "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.25)]",
          "animate-fade-in-up"
        )} style={{ animationDelay: '0.5s' }}>
          
          {/* Botão Secundário (Entrar) - Ciano Neon Outline */}
          <Button
            onClick={handleLoginClick}
            className={cn(
              "flex-1 py-3 bg-transparent text-cyan-400 border-2 border-cyan-400/50 hover:bg-cyan-400/10",
              "shadow-[0_0_15px_rgba(52,211,255,0.5)]"
            )}
          >
            Entrar
          </Button>

          {/* Botão Principal (Criar Conta) - Gradiente Roxo/Fúcsia */}
          <Button
            onClick={handleRegisterClick}
            className={cn(
              "flex-1 py-3 text-white font-bold",
              "bg-gradient-to-r from-primary to-fuchsia-600 hover:brightness-110",
              "shadow-[0_0_25px_rgba(236,72,153,0.6)]"
            )}
          >
            Criar conta
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Welcome;