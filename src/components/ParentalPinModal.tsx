"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hasParentPin, setParentPin, verifyParentPin, removeParentPin } from "@/utils/parental";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";

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
  const [isCheckingPinStatus, setIsCheckingPinStatus] = useState(true);

  useEffect(() => {
    if (open) {
      const checkPin = async () => {
        setIsCheckingPinStatus(true);
        const exists = await hasParentPin();
        setExistingPinExists(exists);
        setIsCheckingPinStatus(false);
      };
      checkPin();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPin("");
      setPinConfirm("");
      setLoading(false);
    }
  }, [open]);

  const MIN_PIN_LENGTH = 6;

  const handleSet = async () => {
    if (pin.length < MIN_PIN_LENGTH) {
      showError(`O PIN deve ter ao menos ${MIN_PIN_LENGTH} caracteres (recomendado números + letras).`);
      return;
    }
    if (pin !== pinConfirm) {
      showError("PIN e confirmação não coincidem.");
      return;
    }
    setLoading(true);
    const toastId = showLoading("Salvando PIN...");
    try {
      await setParentPin(pin);
      dismissToast(toastId);
      showSuccess("PIN parental definido com sucesso.");
      setExistingPinExists(true);
      onOpenChange(false);
    } catch (e) {
      dismissToast(toastId);
      // setParentPin already reports errors
    } finally {
      setLoading(false);
    }
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
    const toastId = showLoading("Removendo PIN...");
    try {
      await removeParentPin();
      dismissToast(toastId);
      showSuccess("PIN parental removido.");
      setExistingPinExists(false);
      onOpenChange(false);
    } catch (e) {
      dismissToast(toastId);
    } finally {
      setLoading(false);
    }
  };

  const isVerifyDisabled = loading || isCheckingPinStatus || !existingPinExists;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title ?? (mode === "set" ? "Definir PIN Parental" : mode === "remove" ? "Remover PIN Parental" : "Verificar PIN Parental")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {mode === "set" ? (
            <>
              <div>
                <Label>PIN (mín. {MIN_PIN_LENGTH} caracteres — recom.: números + letras)</Label>
                <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" />
              </div>
              <div>
                <Label>Confirme o PIN</Label>
                <Input value={pinConfirm} onChange={(e) => setPinConfirm(e.target.value)} type="password" />
              </div>
              <div className="text-sm text-muted-foreground">O PIN será enviado de forma segura ao servidor, onde será armazenado com um hash lento e salgado.</div>
            </>
          ) : mode === "remove" ? (
            <>
              <div>
                <Label>Digite seu PIN atual</Label>
                <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" />
              </div>
              <div className="text-sm text-muted-foreground">Ao confirmar, o PIN será removido.</div>
            </>
          ) : (
            <>
              <div>
                <Label>Digite seu PIN</Label>
                <Input value={pin} onChange={(e) => setPin(e.target.value)} type="password" />
              </div>
              {isCheckingPinStatus ? (
                <div className="text-sm text-muted-foreground">Verificando status do PIN...</div>
              ) : !existingPinExists && (
                <div className="text-sm text-muted-foreground">Nenhum PIN configurado — você pode defini-lo nas configurações.</div>
              )}
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
              <Button onClick={handleVerify} disabled={isVerifyDisabled}>{loading ? "Verificando..." : "Verificar"}</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ParentalPinModal;