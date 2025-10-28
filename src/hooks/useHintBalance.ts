import { useState, useEffect, useCallback } from 'react';

const HINT_STORAGE_KEY = 'edukids_hint_balance';

export function useHintBalance() {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HINT_STORAGE_KEY);
      if (raw) {
        setBalance(parseInt(raw, 10));
      }
    } catch (error) {
      console.error("Failed to load hint balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((newBalance: number) => {
    try {
      localStorage.setItem(HINT_STORAGE_KEY, newBalance.toString());
    } catch (error) {
      console.error("Failed to save hint balance:", error);
    }
  }, []);

  const addHints = useCallback((amount: number) => {
    setBalance(prev => {
      const next = prev + amount;
      persist(next);
      return next;
    });
  }, [persist]);

  const useHint = useCallback(() => {
    setBalance(prev => {
      if (prev > 0) {
        const next = prev - 1;
        persist(next);
        return next;
      }
      return prev;
    });
  }, [persist]);

  return {
    balance,
    isLoading,
    addHints,
    useHint,
  };
}