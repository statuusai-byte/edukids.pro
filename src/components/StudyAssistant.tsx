"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";
import { useHintsContext } from "@/context/HintsContext"; // New import
import { usePremium } from "@/context/PremiumContext"; // New import
import { Link } from "react-router-dom"; // New import

const encouragePhrases = [
  "Você está indo muito bem! Continue assim 😊",
  "Ótimo! Tente esse passo e me diga como foi.",
  "Muito bem! Quer tentar outra pergunta?",
  "Boa! Você aprendeu algo novo agora.",
];

function pickEncouragement() {
  return encouragePhrases[Math.floor(Math.random() * encouragePhrases.length)];
}

function simulateStudyHelp(query: string, directHint = false): string {
  const text = query.trim().toLowerCase();

  if (!text) {
    return "Tente escrever sua pergunta com palavras simples, por exemplo: 'Como eu resolvo 2+2?'.";
  }

  // More direct answers for paid hints
  if (directHint) {
    if (/\b(conta|contar|quantos|quantas|número|numero)\b/.test(text)) {
      return "Dica direta: Para contar, use os dedos ou desenhe. Se for uma soma, junte os grupos. Se for uma subtração, tire de um grupo. O número final é a resposta!";
    }
    if (/\b(soma|adicion|somar|\+)\b/.test(text)) {
      const match = text.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) {
        const num1 = parseInt(match[1]);
        const num2 = parseInt(match[2]);
        return `Dica direta: Para ${num1} + ${num2}, comece com ${num1} e adicione ${num2} um por um. A resposta é ${num1 + num2}.`;
      }
      return "Dica direta: Somar é juntar. Pense em ter um grupo de coisas e adicionar mais coisas a ele. O total é a soma.";
    }
    if (/\b(subtra|menos|-)\b/.test(text)) {
      const match = text.match(/(\d+)\s*-\s*(\d+)/);
      if (match) {
        const num1 = parseInt(match[1]);
        const num2 = parseInt(match[2]);
        return `Dica direta: Para ${num1} - ${num2}, comece com ${num1} e retire ${num2}. A resposta é ${num1 - num2}.`;
      }
      return "Dica direta: Subtrair é tirar. Pense em ter um grupo de coisas e remover algumas delas. O que sobra é a diferença.";
    }
    if (/\b(palavra|sílaba|silaba|ler|escrever)\b/.test(text)) {
      return "Dica direta: Para formar palavras, identifique as sílabas e tente combiná-las na ordem correta. Ler em voz alta ajuda a identificar o som da palavra.";
    }
    // Fallback for direct hint if no specific match
    return "Dica direta: Para resolver, tente quebrar o problema em partes menores. Qual é a primeira coisa que você pode fazer?";
  }

  // Basic free tips (existing logic)
  if (/\b(conta|contar|quantos|quantas|número|numero)\b/.test(text)) {
    return "Dica de contagem: conte um por um, marque com o dedo ou desenhe objetos; depois junte grupos iguais para somar.";
  }
  if (/\b(soma|adicion|somar|\+)\b/.test(text)) {
    return "Para somar, faça pequenos grupos e una-os: por exemplo, 3 + 2 = (1,2,3) + (1,2) → total 5.";
  }
  if (/\b(subtra|menos|-)\b/.test(text)) {
    return "Para subtrair, retire objetos de um conjunto e conte o que sobra. Desenhar ajuda muito!";
  }
  if (/\b(palavra|sílaba|silaba|ler|escrever)\b/.test(text)) {
    return "Para formar palavras, separe em sílabas e junte devagar: BO + LA = BOLA. Leia em voz alta para ajudar.";
  }
  if (/\b(porque|por que)\b/.test(text)) {
    return "Boa pergunta! Tente dividir o problema em passos e olhar cada parte: muitas respostas aparecem assim.";
  }
  if (/\b(matemat|portugues|ciencia|historia|geografia|ingles|programa|arte|musica)\b/.test(text)) {
    return "Ótimo tópico! Explique um pouquinho o que você já tentou e eu te dou uma dica passo a passo.";
  }
  return "Legal! Tente dividir a pergunta em passos curtinhos — se não funcionar, peça ajuda a um adulto ou compre o pacote de ajuda para explicações mais detalhadas.";
}

const StudyAssistant = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const { hints, useHint } = useHintsContext(); // Use hints context
  const { isPremium } = usePremium(); // Use premium context

  const onAsk = async (directHint = false) => {
    if (!query.trim()) {
      showError("Digite sua dúvida para receber ajuda.");
      return;
    }

    if (directHint && !isPremium && hints <= 0) {
      showError("Você não tem dicas para uma ajuda mais direta. Compre mais na loja ou assine Premium.");
      return;
    }

    setProcessing(true);
    const toastId = showLoading("Pensando...");
    try {
      // Simulate AI call
      await new Promise((r) => setTimeout(r, 800));
      const resp = simulateStudyHelp(query, directHint);
      const encouragement = pickEncouragement();
      setResponse(`${resp}\n\n${encouragement}`);
      dismissToast(toastId);
      showSuccess("Aqui está uma dica!");

      if (directHint && !isPremium) {
        useHint(); // Consume a hint if it was a direct hint and not premium
      }
    } catch (e) {
      dismissToast(toastId);
      showError("Desculpe, tente novamente mais tarde.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed z-50 right-4 bottom-24 md:right-6 md:bottom-6 flex items-end">
        {/* Panel */}
        {open && (
          <div className="mr-4 w-full max-w-sm md:w-96 glass-card p-4 shadow-2xl border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Assistente de Estudos</div>
                  <div className="text-xs text-muted-foreground">Peça uma dica sobre a matéria e eu te ajudo!</div>
                </div>
              </div>
              <button
                aria-label="Fechar assistente"
                onClick={() => { setOpen(false); setResponse(null); setQuery(""); }}
                className="p-1 rounded-md hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <label className="text-xs text-muted-foreground">Escreva sua dúvida</label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: Como eu resolvo 5 + 3?"
                aria-label="Pergunta para o assistente"
                className="bg-secondary/40"
              />

              <div className="flex items-center gap-2">
                <Button onClick={() => onAsk(false)} className="flex-1 bg-yellow-400" disabled={processing}>
                  {processing ? "Pensando..." : "Pedir Ajuda"}
                </Button>
                <Button variant="ghost" onClick={() => { setQuery(""); setResponse(null); }}>
                  Limpar
                </Button>
              </div>

              {response && (
                <div className="mt-2 p-3 rounded-md bg-secondary/30 border border-white/6 text-sm whitespace-pre-wrap">
                  <div className="font-medium mb-2">Resposta</div>
                  <div>{response}</div>
                  {!isPremium && hints > 0 && (
                    <div className="mt-3 text-center">
                      <Button 
                        onClick={() => onAsk(true)} 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={processing}
                      >
                        Usar 1 Dica para Ajuda Mais Direta (Saldo: {hints})
                      </Button>
                    </div>
                  )}
                  {!isPremium && hints <= 0 && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                      Você não tem dicas. <Link to="/store" className="underline text-primary">Compre mais na loja</Link> ou assine Premium para dicas ilimitadas.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary/70" />
                <span>
                  Em breve os assinantes Premium terão IA com voz natural (Open AiGemini 2.5pro) para explicar em áudio — por enquanto, receba dicas por texto.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Floating circular button */}
        <button
          aria-label="Abrir assistente de estudos"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform duration-150 focus:outline-none",
            open ? "scale-105 bg-primary text-primary-foreground" : "bg-yellow-400 text-black hover:scale-105"
          )}
        >
          <div className="flex flex-col items-center">
            <Bot className="h-6 w-6" />
            <span className="text-[10px] -mt-1">Ajuda</span>
          </div>
        </button>
      </div>
    </>
  );
};

export default StudyAssistant;