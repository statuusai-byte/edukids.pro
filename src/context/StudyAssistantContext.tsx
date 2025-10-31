import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { showLoading, dismissToast, showSuccess, showError } from '@/utils/toast';
import { useHintsContext } from '@/context/HintsContext';
import { usePremium } from '@/context/PremiumContext';
import { Bot, Sparkles, X, Mic } from 'lucide-react';
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

  if (directHint) {
    if (/\b(conta|contar|quantos|quantas|número|numero)\b/.test(text)) return "Dica direta: Para contar, use os dedos ou desenhe. Se for uma soma, junte os grupos. Se for uma subtração, tire de um grupo. O número final é a resposta!";
    if (/\b(soma|adicion|somar|\+)\b/.test(text)) {
      const match = text.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) return `Dica direta: Para ${match[1]} + ${match[2]}, comece com ${match[1]} e adicione ${match[2]} um por um. A resposta é ${parseInt(match[1]) + parseInt(match[2])}.`;
      return "Dica direta: Somar é juntar. Pense em ter um grupo de coisas e adicionar mais coisas a ele. O total é a soma.";
    }
    if (/\b(subtra|menos|-)\b/.test(text)) {
      const match = text.match(/(\d+)\s*-\s*(\d+)/);
      if (match) return `Dica direta: Para ${match[1]} - ${match[2]}, comece com ${match[1]} e retire ${match[2]}. A resposta é ${parseInt(match[1]) - parseInt(match[2])}.`;
      return "Dica direta: Subtrair é tirar. Pense em ter um grupo de coisas e remover algumas delas. O que sobra é a diferença.";
    }
    if (/\b(palavra|sílaba|silaba|ler|escrever)\b/.test(text)) return "Dica direta: Para formar palavras, identifique as sílabas e tente combiná-las na ordem correta. Ler em voz alta ajuda a identificar o som da palavra.";
    return "Dica direta: Para resolver, tente quebrar o problema em partes menores. Qual é a primeira coisa que você pode fazer?";
  }

  if (/\b(conta|contar|quantos|quantas|número|numero)\b/.test(text)) return "Dica de contagem: conte um por um, marque com o dedo ou desenhe objetos; depois junte grupos iguais para somar.";
  if (/\b(soma|adicion|somar|\+)\b/.test(text)) return "Para somar, faça pequenos grupos e una-os: por exemplo, 3 + 2 = (1,2,3) + (1,2) → total 5.";
  if (/\b(subtra|menos|-)\b/.test(text)) return "Para subtrair, retire objetos de um conjunto e conte o que sobra. Desenhar ajuda muito!";
  if (/\b(palavra|sílaba|silaba|ler|escrever)\b/.test(text)) return "Para formar palavras, separe em sílabas e junte devagar: BO + LA = BOLA. Leia em voz alta para ajudar.";
  return "Legal! Tente dividir a pergunta em passos curtinhos — se não funcionar, peça ajuda a um adulto ou compre o pacote de ajuda para explicações mais detalhadas.";
}

interface StudyAssistantContextType {
  openAssistant: (initialQuery?: string) => void;
  requestLessonHint: (lessonQuestion: string, onHintTriggered: () => void) => void;
  isAssistantOpen: boolean;
}

const StudyAssistantContext = createContext<StudyAssistantContextType | undefined>(undefined);

export const StudyAssistantProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const onLessonHintTriggeredRef = useRef<(() => void) | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const { hints, useHint } = useHintsContext();
  const { isPremium } = usePremium();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        showError("Não consegui ouvir. Tente de novo.");
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showError("O reconhecimento de voz não é suportado neste navegador.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const openAssistant = useCallback((initialQuery = "") => {
    setQuery(initialQuery);
    setResponse(null);
    setOpen(true);
  }, []);

  const onAsk = useCallback(async (directHint = false, questionToHint: string | null = null) => {
    const currentQuery = questionToHint || query;
    if (!currentQuery.trim()) {
      showError("Digite ou fale sua dúvida para receber ajuda.");
      return;
    }

    if (directHint && !isPremium && hints <= 0) {
      showError("Você não tem dicas para uma ajuda mais direta. Compre mais na loja ou assine Premium.");
      return;
    }

    setProcessing(true);
    const toastId = showLoading("Pensando...");

    try {
      await new Promise((r) => setTimeout(r, 800));
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
        onLessonHintTriggeredRef.current = null;
      }
    } catch (e) {
      dismissToast(toastId);
      showError("Desculpe, tente novamente mais tarde.");
    } finally {
      setProcessing(false);
    }
  }, [query, hints, useHint, isPremium]);

  const requestLessonHint = useCallback((lessonQuestion: string, onHintTriggered: () => void) => {
    if (!isPremium && hints <= 0) {
      showError("Você não tem dicas. Compre mais na loja ou assista a um vídeo para ganhar uma.");
      return;
    }
    onLessonHintTriggeredRef.current = onHintTriggered;
    openAssistant("", lessonQuestion);
    onAsk(true, lessonQuestion);
  }, [openAssistant, onAsk, isPremium, hints]);

  return (
    <StudyAssistantContext.Provider value={{ openAssistant, requestLessonHint, isAssistantOpen: open }}>
      {children}
      <div className="fixed z-50 right-6 bottom-6 flex items-end">
        {open && (
          <div className="mr-4 w-full max-w-sm md:w-96 glass-card p-4 shadow-2xl border-white/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Assistente de Estudos</div>
                  <div className="text-xs text-muted-foreground">Peça uma dica sobre a matéria!</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-white/5"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 space-y-3">
              <label className="text-xs text-muted-foreground">Escreva ou fale sua dúvida</label>
              <div className="flex items-center gap-2">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Como eu resolvo 5 + 3?" className="bg-secondary/40" />
                {recognitionRef.current && (
                  <Button size="icon" variant={isListening ? "destructive" : "outline"} onClick={toggleListening}>
                    <Mic className={cn("h-5 w-5", isListening && "animate-pulse")} />
                  </Button>
                )}
              </div>
              <Button onClick={() => onAsk(false)} className="w-full bg-yellow-400" disabled={processing}>{processing ? "Pensando..." : "Pedir Ajuda Gratuita"}</Button>
              {response && (
                <div className="mt-2 p-3 rounded-md bg-secondary/30 border border-white/6 text-sm whitespace-pre-wrap">
                  <div className="font-medium mb-2">Resposta</div>
                  <div>{response}</div>
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary/70" />
                <span>Assinantes Premium têm acesso a IA com voz natural.</span>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setOpen((v) => !v)} className={cn("inline-flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-transform duration-150 focus:outline-none", open ? "scale-105 bg-primary text-primary-foreground" : "bg-yellow-400 text-black hover:scale-105")}>
          <div className="flex flex-col items-center"><Bot className="h-6 w-6" /><span className="text-[10px] -mt-1">Ajuda</span></div>
        </button>
      </div>
    </StudyAssistantContext.Provider>
  );
};

export const useStudyAssistant = (): StudyAssistantContextType => {
  const context = useContext(StudyAssistantContext);
  if (context === undefined) throw new Error('useStudyAssistant must be used within a StudyAssistantProvider');
  return context;
};