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
import { Loader2, ShoppingCart } from "lucide-react";

interface FakeCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  price: string;
  onConfirm: () => Promise<void>;
}

const FakeCheckoutModal = ({
  open,
  onOpenChange,
  productName,
  price,
  onConfirm,
}: FakeCheckoutModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-6 glass-card">
        <DialogHeader>
          <div className="mx-auto mb-3 rounded-full bg-primary/20 p-3 border border-primary/50 w-fit">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">Confirmar Compra (Simulação)</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Você está em um ambiente de teste. No app real, a tela de pagamento do Google Play apareceria aqui.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 rounded-lg bg-secondary/50 border border-white/10">
          <div className="flex justify-between items-center">
            <span className="font-medium">{productName}</span>
            <span className="font-bold text-lg">{price}</span>
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between items-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={isLoading} className="bg-primary">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Compra"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FakeCheckoutModal;