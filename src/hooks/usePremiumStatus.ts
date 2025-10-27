import { useState, useEffect, useCallback } from 'react';

const PREMIUM_STORAGE_KEY = 'edukids_is_premium';

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedStatus = localStorage.getItem(PREMIUM_STORAGE_KEY);
      setIsPremium(storedStatus === 'true');
    } catch (error) {
      console.error("Failed to load premium status:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const activatePremium = useCallback(() => {
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      setIsPremium(true);
    } catch (error) {
      console.error("Failed to save premium status:", error);
    }
  }, []);

  const deactivatePremium = useCallback(() => {
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'false');
      setIsPremium(false);
    } catch (error) {
      console.error("Failed to save premium status:", error);
    }
  }, []);

  return {
    isPremium,
    isLoading,
    activatePremium,
    deactivatePremium,
  };
}