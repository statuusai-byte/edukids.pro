import { useState, useEffect, useCallback } from 'react';

const HINTS_STORAGE_KEY = 'edukids_hints_balance';

export function useHints() {
  const [hints, setHints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHints = localStorage.getItem(HINTS_STORAGE_KEY);
      setHints(storedHints ? parseInt(storedHints, 10) : 0);
    } catch (error) {
      console.error("Failed to load hints balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((newBalance: number) => {
    try {
      localStorage.setItem(HINTS_STORAGE_KEY, String(newBalance));
    } catch (error) {
      console.error("Failed to save hints balance:", error);
    }
  }, []);

  const addHints = useCallback((amount: number) => {
    setHints(prev => {
      const newBalance = prev + amount;
      persist(newBalance);
      return newBalance;
    });
  }, [persist]);

  const useHint = useCallback(() => {
    if (hints <= 0) {
      return false;
    }
    setHints(prev => {
      const newBalance = prev - 1;
      persist(newBalance);
      return newBalance;
    });
    return true;
  }, [hints, persist]);

  return {
    hints,
    isLoading,
    addHints,
    useHint,
  };
}