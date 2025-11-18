"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/context/SupabaseContext";

interface ParentalPinModalProps {
  open: boolean;
  mode?: "verify" | "set" | "remove"; // set = create/update PIN
  onOpenChange: (open: boolean) => void;
  onVerified?: (pin: string) => void; // Pass PIN back on successful verification
  title?: string;
}

const MIN_PIN_LENGTH = 6;

// Helper function to check if PIN exists (moved from utils/parental.ts)
async function checkPinExistence(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('parents')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found

    return !!data;
  } catch (e) {
    console.error("Failed to check for parent pin existence", e);
    return false;
  }
}

const ParentalPinModal = ({ open, mode = "verify", onOpenChange, onVerified, title }: ParentalPinModalProps) => {
  const { user } = useSupabase();
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [existingPinExists, setExistingPinExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingPinStatus, setIsCheckingPinStatus] = useState(true);

  const checkPinStatus = useCallback(async () => {
    if (!user) {
      setExistingPinExists(false);
      setIsCheckingPinStatus(false);
      return;
    }
    setIsCheckingPinStatus(true);
    const exists = await checkPinExistence(user.id);
    setExistingPinExists(exists);
    setIsCheckingPinStatus(false);
  }, [user]);

  useEffect(() => {
    if (open) {
      checkPinStatus();
    }
  }, [open, checkPinStatus]);

  useEffect(() => {
    if (!open) {
      setPin("");
      setPinConfirm("");
      setLoading(false);
    }
  }, [open]);

  const handleSet = async () => {
    if (!user) {
      showError("Você precisa estar logado para definir o PIN parental.");
      return;
    }
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
      // Call secure Edge Function to hash and store PIN
      const { error } = await supabase.functions.invoke('set-parent-pin', {
        method: 'POST',
        body: { pin },
      });

      dismissToast(toastId);

      if (error) throw error;
      
      showSuccess("PIN parental definido com sucesso.");
      setExistingPinExists(true);
      onOpenChange(false);
      onVerified?.(pin); // Grant access immediately after setting
    } catch (e: any) {
      dismissToast(toastId);
      console.error("Failed to set parent pin securely", e);
      showError("Falha ao salvar o PIN no servidor: " + (e.message || "Erro desconhecido."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!user) {
      showError("Você precisa estar logado para verificar o PIN.");
      return;
    }
    setLoading(true);
    try {
      // Call secure Edge Function for verification
      const { data, error } = await supabase.functions.invoke('verify-parent-pin', {
        method: 'POST',
        body: { pin },
      });

      setLoading(false);

      if (error) throw error;

      const ok = (data as { verified: boolean })?.verified === true;

      if (ok) {
        showSuccess("PIN verificado.");
        onOpenChange(false);
        onVerified?.(pin); // Pass the verified PIN back
      } else {
        showError("PIN incorreto.");
      }
    } catch (e: any) {
      setLoading(false);
      console.error("Failed to verify parent pin securely", e);
      showError("Falha na comunicação com o servidor de PIN: " + (e.message || "Erro desconhecido."));
    }
  };

  const handleRemove = async () => {
    if (!user) {
      showError("Você precisa estar logado para remover o PIN parental.");
      return;
    }
    setLoading(true);
    
    // 1. Verify PIN first
    const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-parent-pin', {
      method: 'POST',
      body: { pin },
    });

    if (verifyError || (verifyData as { verified: boolean })?.verified !== true) {
      setLoading(false);
      showError("PIN incorreto.");
      return;
    }

    // 2. If verified, proceed with removal via Edge Function
    const toastId = showLoading("Removendo PIN...");
    try {
      const { error: removeError } = await supabase.functions.invoke('remove-parent-pin', {
        method: 'POST',
      });
      
      dismissToast(toastId);

      if (removeError) throw removeError;

      showSuccess("PIN parental removido.");
      setExistingPinExists(false);
      onOpenChange(false);
    } catch (e: any) {
      dismissToast(toastId);
      console.error("Failed to remove parent pin securely", e);
      showError("Falha ao remover o PIN no servidor: " + (e.message || "Erro desconhecido."));
    } finally {
      setLoading(false);
    }
  };

  const isVerifyDisabled = loading || isCheckingPinStatus || !existingPinExists || !user;

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
              {!user && (
                <div className="text-sm text-red-400">Você precisa estar logado para usar o PIN parental.</div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            {mode === "set" ? (
              <Button onClick={handleSet} disabled={loading || !user}>{loading ? "Salvando..." : "Definir PIN"}</Button>
            ) : mode === "remove" ? (
              <Button variant="destructive" onClick={handleRemove} disabled={loading || !user}>{loading ? "Removendo..." : "Remover PIN"}</Button>
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