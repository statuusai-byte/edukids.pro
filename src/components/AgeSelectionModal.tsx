"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAge } from "@/context/AgeContext";
import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AGE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "4-6", label: "4-6 anos" },
  { id: "7-9", label: "7-9 anos" },
  { id: "10-12", label: "10-12 anos" },
];

const AgeSelectionModal = ({ open, onOpenChange }: AgeSelectionModalProps) => {
  const { setAgeGroup } = useAge();
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!selected) return;

    setAgeGroup(selected as any);
    onOpenChange(false);

    // Em modo liberado, sempre navegamos para /activities após a seleção de idade.
    navigate("/activities");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "glass-card sm:max-w-lg text-center p-8 border-0", // Estilo de vidro, mais espaçamento
        "shadow-2xl shadow-primary/20" // Sombra mais pronunciada
      )}>
        <DialogHeader>
          <div className="mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 p-4 border border-primary/50 w-fit shadow-lg">
            <Rocket className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <DialogTitle className="text-3xl font-extrabold tracking-tight drop-shadow-lg">
            Vamos Começar!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base mt-2">
            Para personalizar a aventura, selecione a faixa etária do explorador.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {AGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "py-4 rounded-xl border text-lg font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-primary/50",
                selected === opt.id
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <DialogFooter className="mt-8 sm:justify-center">
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full hover:bg-white/10">Cancelar</Button>
              <Button 
                onClick={handleConfirm} 
                disabled={!selected} 
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Começar a Explorar
              </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgeSelectionModal;