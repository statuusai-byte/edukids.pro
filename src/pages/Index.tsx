"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Gift, Lightbulb, Play } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-6xl">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Hero content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 rounded-full w-fit">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-sm font-semibold text-primary">EDUKIDS+</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Aprenda brincando. Explore. Descubra. Cresça.
            </h1>

            <p className="text-muted-foreground max-w-xl">
              Jogos educativos, quizzes e vídeos feitos para crianças — com painéis dos pais, controle de tempo e ferramentas para ajudar no aprendizado.
              Escolha uma faixa etária, entre em atividades e, se quiser, desbloqueie todo o conteúdo com EDUKIDS+.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/activities">
                <Button className="bg-white text-black flex items-center gap-2">
                  <Play className="h-4 w-4" /> Começar a Explorar
                </Button>
              </Link>

              <Link to="/store">
                <Button variant="outline" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" /> Assinar Premium
                </Button>
              </Link>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Dica: se você fechar uma lição por acidente, volte para esta página para decidir o que fazer a seguir — revisar, jogar outro desafio ou continuar a jornada.
            </div>
          </div>

          {/* Right: Decorative card with explanation */}
          <div>
            <Card className="glass-card p-6 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Ajuda & Dicas</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Quando uma lição fica difícil, você pode:
                </p>

                <ul className="list-disc list-inside text-sm space-y-2">
                  <li><strong>Usar uma Dica</strong> — consome 1 dica do seu saldo (mostramos o saldo antes da compra).</li>
                  <li><strong>Assistir a um anúncio</strong> — ganhe 1 dica gratuita ao assistir um anúncio curto.</li>
                  <li><strong>Comprar pacotes de dicas</strong> — vá à Loja para escolher pacotes de 3, 8 ou 15 dicas.</li>
                  <li><strong>Assinar Premium</strong> — assinantes têm dicas ilimitadas e acesso a todo o conteúdo.</li>
                </ul>

                <div className="p-3 rounded-md bg-secondary/30 border border-white/6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-yellow-400 mt-1" />
                    <div>
                      <div className="font-semibold">Como usar uma dica?</div>
                      <div className="text-xs text-muted-foreground">
                        Clique no botão "Usar Dica" dentro de um quiz ou jogo; se você não tiver dicas, a loja irá sugerir opções para comprar ou assistir anúncio para ganhar.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <div className="font-medium mb-1">Ao comprar</div>
                  <div className="text-xs text-muted-foreground">
                    Após comprar na Loja, as dicas são aplicadas ao seu saldo imediatamente. Se você assinar Premium, liberamos dicas ilimitadas e relatórios para os pais.
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Link to="/store">
                    <Button className="bg-yellow-400 text-black flex-1">
                      Ver Planos e Pacotes
                    </Button>
                  </Link>
                  <Link to="/test-account">
                    <Button variant="outline" className="flex-1">Experimentar (Conta Teste)</Button>
                  </Link>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  Se precisar de ajuda para decidir, peça aos pais para abrir o <strong>Painel dos Pais</strong> e ajustar as preferências.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Secondary section: benefits */}
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/30 rounded-2xl border border-white/6 text-center">
            <div className="text-2xl font-bold">Aprender Brincando</div>
            <div className="text-sm text-muted-foreground mt-2">Atividades lúdicas feitas para envolver crianças e ensinar conceitos.</div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-2xl border border-white/6 text-center">
            <div className="text-2xl font-bold">Segurança & Controle</div>
            <div className="text-sm text-muted-foreground mt-2">Painel dos pais, limite de tempo e PIN parental para compras.</div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-2xl border border-white/6 text-center">
            <div className="text-2xl font-bold">Dicas & Suporte</div>
            <div className="text-sm text-muted-foreground mt-2">Use dicas, assista anúncios para ganhar dicas ou adquira pacotes na Loja.</div>
          </div>
        </section>
      </main>
    </div>
  );
}