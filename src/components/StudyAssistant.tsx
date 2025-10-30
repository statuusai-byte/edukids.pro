"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { showLoading, dismissToast, showSuccess, showError } from "@/utils/toast";

const encouragePhrases = [
  "Você está indo muito bem! Continue assim 😊",
  "Ótimo! Tente esse passo e me diga como foi.",
  "Muito bem! Quer tentar outra pergunta?",
  "Boa! Você aprendeu algo novo agora.",
];

function pickEncouragement() {
  return encouragePhrases[Math.floor(Math.random() * encouragePhrases.length)];
}

function simulateStudyHelp(query: string) {
  const text = query.trim().toLowerCase();

  if (!text) {
    return "Tente escrever sua pergunta com palavras simples, por exemplo: 'Como eu resolvo 2+2?'.";
  }

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

  const onAsk = async () => {
    if (!query.trim()) {
      showError("Digite sua dúvida para receber ajuda.");
      return;
    }

    setProcessing(true);
    const toastId = showLoading("Pensando...");
    try {
      // Simulação de chamada IA
      await new Promise((r) => setTimeout(r, 800));
      const resp = simulateStudyHelp(query);
      const encouragement = pickEncouragement();
      setResponse(`${resp}\n\n${encouragement}`);
      dismissToast(toastId);
      showSuccess("Aqui está uma dica!");
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
      <div className="fixed z-50 right-6 bottom-6 flex items-end">
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
                <Button onClick={onAsk} className="flex-1 bg-yellow-400" disabled={processing}>
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