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

type ActionType = "entrar" | "cadastrar" | "explore";

interface AgeSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: ActionType | null;
}

const AGE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: "4-6", label: "4-6 anos" },
  { id: "7-9", label: "7-9 anos" },
  { id: "10-12", label: "10-12 anos" },
];

const SKIP_REDIRECT_KEY = "edukids_skip_auto_redirect";

const AgeSelectionModal = ({ open, onOpenChange, action }: AgeSelectionModalProps) => {
  const { setAgeGroup } = useAge();
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (!selected) return;

    try {
      localStorage.setItem(SKIP_REDIRECT_KEY, "true");
    } catch (e) {
      // ignore
    }

    setAgeGroup(selected as any);
    onOpenChange(false);

    if (action === "cadastrar") {
      navigate("/register");
    } else if (action === "entrar") {
      navigate("/login");
    } else if (action === "explore") {
      navigate("/activities");
    }
  };

  const getTitle = () => {
    switch (action) {
      case "cadastrar": return "Crie a conta e comece";
      case "entrar": return "Bem-vindo de volta!";
      case "explore": return "Comece a Explorar!";
      default: return "Selecione a Faixa Etária";
    }
  };

  const getButtonText = () => {
    switch (action) {
      case "cadastrar": return "Continuar para Cadastro";
      case "entrar": return "Continuar para Entrar";
      case "explore": return "Começar a Explorar";
      default: return "Confirmar";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-6">
        <div>
          <DialogHeader>
            <div className="mx-auto mb-3 rounded-full bg-primary/20 p-3 border border-primary/50 w-fit">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              {getTitle()}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Antes de continuar, selecione a faixa etária do explorador.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`py-3 rounded-lg border transition-colors ${
                  selected === opt.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/20 border-white/6 hover:bg-secondary/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <DialogFooter>
              <div className="flex w-full justify-between items-center gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button onClick={handleConfirm} disabled={!selected} className="bg-primary">
                  {getButtonText()}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgeSelectionModal;