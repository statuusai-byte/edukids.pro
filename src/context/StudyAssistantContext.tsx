"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { showLoading, dismissToast, showSuccess, showError } from '@/utils/toast';
import { useHintsContext } from '@/context/HintsContext';
import { usePremium } from '@/context/PremiumContext';
import { Bot, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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

interface StudyAssistantContextType {
  openAssistant: (initialQuery?: string, lessonQuestion?: string) => void;
  requestLessonHint: (lessonQuestion: string, onHintTriggered: () => void) => void;
  isAssistantOpen: boolean;
}

const StudyAssistantContext = createContext<StudyAssistantContextType | undefined>(undefined);

export const StudyAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [lessonQuestionContext, setLessonQuestionContext] = useState<string | null>(null);
  const onLessonHintTriggeredRef = useRef<(() => void) | null>(null);

  const { hints, useHint } = useHintsContext();
  const { isPremium } = usePremium();

  const openAssistant = useCallback((initialQuery = "", lessonQuestion: string | null = null) => {
    setQuery(initialQuery);
    setResponse(null);
    setLessonQuestionContext(lessonQuestion);
    setOpen(true);
  }, []);

  const onAsk = useCallback(async (directHint = false, questionToHint: string | null = null) => {
    const currentQuery = questionToHint || query;
    if (!currentQuery.trim()) {
      showError("Digite sua dúvida para receber ajuda.");
      return;
    }

    if (directHint && !isPremium && hints <= 0) {
      showError("Você não tem dicas para uma ajuda mais direta. Compre mais na loja ou assine Premium.");
      return;
    }

    setProcessing(true);
    let toastId: string | number | null = null;

    try {
      toastId = showLoading("Pensando...");
      await new Promise((r) => setTimeout(r, 800)); // Simulate AI call

      if (questionToHint) {
        dismissToast(toastId);
        toastId = showLoading(`Lendo a pergunta: "${questionToHint.substring(0, 50)}..."`);
        await new Promise((r) => setTimeout(r, 1500)); // Simulate reading time
      }

      const resp = simulateStudyHelp(currentQuery, directHint);
      const encouragement = pickEncouragement();
      setResponse(`${resp}\n\n${encouragement}`);
      dismissToast(toastId);
      showSuccess("Aqui está uma dica!");

      if (directHint && !isPremium) {
        useHint();
      }
      if (onLessonHintTriggeredRef.current) {
        onLessonHintTriggeredRef.current();
        onLessonHintTriggeredRef.current = null; // Clear after use
      }
    } catch (e) {
      dismissToast(toastId);
      showError("Desculpe, tente novamente mais tarde.");
    } finally {
      setProcessing(false);
    }
  }, [query, hints, useHint, isPremium]);

  const requestLessonHint = useCallback((lessonQuestion: string, onHintTriggered: () => void) => {
    setLessonQuestionContext(lessonQuestion);
    onLessonHintTriggeredRef.current = onHintTriggered;
    openAssistant("", lessonQuestion); // Open assistant with the lesson question
    onAsk(true, lessonQuestion); // Immediately ask for a direct hint
  }, [openAssistant, onAsk]);

  return (
    <StudyAssistantContext.Provider value={{ openAssistant, requestLessonHint, isAssistantOpen: open }}>
      {children}
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
                onClick={() => { setOpen(false); setResponse(null); setQuery(""); setLessonQuestionContext(null); }}
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
                <Button variant="ghost" onClick={() => { setQuery(""); setResponse(null); setLessonQuestionContext(null); }}>
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
                        onClick={() => onAsk(true, lessonQuestionContext)} 
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
    </StudyAssistantContext.Provider>
  );
};

export const useStudyAssistant = (): StudyAssistantContextType => {
  const context = useContext(StudyAssistantContext);
  if (context === undefined) {
    throw new Error('useStudyAssistant must be used within a StudyAssistantProvider');
  }
  return context;
};