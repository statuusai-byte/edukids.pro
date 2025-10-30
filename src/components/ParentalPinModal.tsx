"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasParentPin, setParentPin, verifyParentPin, removeParentPin } from "@/utils/parental";
import { showSuccess, showError } from "@/utils/toast";

interface ParentalPinModalProps {
  open: boolean;
  mode?: "verify" | "set" | "remove"; // set = create/update PIN
  onOpenChange: (open: boolean) => void;
  onVerified?: () => void;
  title?: string;
}

const ParentalPinModal = ({ open, mode = "verify", onOpenChange, onVerified, title }: ParentalPinModalProps) => {
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [existingPinExists, setExistingPinExists] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExistingPinExists(hasParentPin());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPin("");
      setPinConfirm("");
      setLoading(false);
    }
  }, [open]);

  const handleSet = async () => {
    if (pin.length < 4) {
      showError("O PIN deve ter ao menos 4 dígitos.");
      return;
    }
    if (pin !== pinConfirm) {
      showError("PIN e confirmação não coincidem.");
      return;
    }
    setLoading(true);
    await setParentPin(pin);
    setLoading(false);
    showSuccess("PIN parental definido com sucesso.");
    onOpenChange(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const ok = await verifyParentPin(pin);
    setLoading(false);
    if (ok) {
      showSuccess("PIN verificado.");
      onOpenChange(false);
      onVerified?.();
    } else {
      showError("PIN incorreto.");
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    const ok = await verifyParentPin(pin);
    if (!ok) {
      setLoading(false);
      showError("PIN incorreto.");
      return;
    }
    removeParentPin();
    setLoading(false);
    showSuccess("PIN parental removido.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Wrap all direct children of DialogContent in a single div */}
        <div>
          <DialogHeader>
            <DialogTitle>{title ?? (mode === "set" ? "Definir PIN Parental" : mode === "remove" ? "Remover PIN Parental" : "Verificar PIN Parental")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {mode === "set" ? (
              <>
                <div>
                  <Label>PIN (4+ dígitos)</Label>
                  <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" />
                </div>
                <div>
                  <Label>Confirme o PIN</Label>
                  <Input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value)} type="password" />
                </div>
                <div className="text-sm text-muted-foreground">O PIN é armazenado localmente (hash). Ele será necessário para aprovar compras e ações sensíveis.</div>
              </>
            ) : mode === "remove" ? (
              <>
                <div>
                  <Label>Digite seu PIN atual</Label>
                  <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" />
                </div>
                <div className="text-sm text-muted-foreground">Ao confirmar, o PIN será removido e a exigência de verificação local será desativada.</div>
              </>
            ) : (
              <>
                <div>
                  <Label>Digite seu PIN</Label>
                  <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" />
                </div>
                {!existingPinExists && <div className="text-sm text-muted-foreground">Nenhum PIN configurado — você pode defini-lo nas configurações.</div>}
              </>
            )}
          </div>

          <DialogFooter>
            <div className="flex w-full justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              {mode === "set" ? (
                <Button onClick={handleSet} disabled={loading}>{loading ? "Salvando..." : "Definir PIN"}</Button>
              ) : mode === "remove" ? (
                <Button variant="destructive" onClick={handleRemove} disabled={loading}>{loading ? "Removendo..." : "Remover PIN"}</Button>
              ) : (
                <Button onClick={handleVerify} disabled={loading || !existingPinExists}>{loading ? "Verificando..." : "Verificar"}</Button>
              )}
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentalPinModal;