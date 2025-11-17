import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { showError } from '@/utils/toast';

// Em modo liberado, as dicas são sempre 0, a menos que sejam adicionadas localmente.
const INITIAL_BALANCE = 0;

export function useHints() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [hints, setHints] = useState(INITIAL_BALANCE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Em modo liberado, o saldo é sempre 0 (ou o que for definido localmente se implementarmos persistência local).
    setHints(INITIAL_BALANCE);
    setIsLoading(false);
  }, []);

  const addHints = useCallback(async (amount: number) => {
    // Simula adição localmente
    setHints(prev => prev + amount);
    showError(`Dicas adicionadas localmente: ${amount}. (Não persistirá no servidor)`);
  }, []);

  const useHint = useCallback(async () => {
    if (hints <= 0) {
      return false;
    }
    // Simula uso localmente
    setHints(prev => prev - 1);
    return true;
  }, [hints]);

  return {
    hints,
    isLoading,
    addHints,
    useHint,
  };
}