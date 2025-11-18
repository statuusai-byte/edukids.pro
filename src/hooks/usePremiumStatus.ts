import { useState, useEffect, useCallback, useMemo } from 'react';
import { showError } from '@/utils/toast';

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Always false in free mode

  // Em modo liberado, o status Premium é sempre falso, e não há trial ativo.
  useEffect(() => {
    setIsPremium(false);
    setTrialEndsAt(null);
    setIsLoading(false);
  }, []);

  const isTrialActive = useMemo(() => {
    return false;
  }, [trialEndsAt]);

  // Stubs para funções que dependem de autenticação/DB
  const startTrial = useCallback(async () => {
    showError("Funcionalidade de teste Premium desativada em modo liberado.");
    return false;
  }, []);

  const activatePremiumSecurely = useCallback(async (_userId: string, _secureToken: string) => {
    showError("Funcionalidade de ativação Premium desativada em modo liberado.");
    return false;
  }, []);

  const deactivatePremium = useCallback(async () => {
    // No-op
  }, []);

  return {
    isPremium,
    isTrialActive,
    trialEndsAt,
    isLoading,
    activatePremiumSecurely,
    deactivatePremium,
    startTrial,
  };
}