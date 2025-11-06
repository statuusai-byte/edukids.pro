"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-6">
      <section className="max-w-4xl w-full text-center">
        <div className="relative mb-8 flex justify-center items-center">
          <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-3xl animate-pulse duration-[4s]" />
          <Star className="relative mx-auto h-24 w-24 text-yellow-300 fill-yellow-400/80 animate-slow-glow drop-shadow-[0_0_1rem_#facc15]" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
          Bem-vindo ao App
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          Aprenda, jogue e evolua — tudo em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
          <Button
            onClick={handleLoginClick}
            className="flex-1 border border-white/20 text-white/90 py-3 bg-white/5 hover:bg-white/10"
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

        {/* Observação: o botão de assinatura foi removido conforme solicitado,
            pois já existe uma área de assinaturas dentro do app. */}
      </section>
    </main>
  );
};

export default Home;