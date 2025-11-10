import { useState, useEffect, useCallback } from 'react';

const PREMIUM_STORAGE_KEY = 'edukids_is_premium';

// Helper para ler do storage com segurança (apenas usado dentro de useEffect)
const getStoredPremiumStatus = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true';
  } catch (error) {
    console.error("Failed to read premium status from localStorage:", error);
    return false;
  }
};

export function usePremiumStatus() {
  // Inicializa como false (valor seguro para SSR/build)
  const [isPremium, setIsPremium] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 

  // Effect para carregamento inicial e configuração do listener
  useEffect(() => {
    // 1. Carrega o status inicial aqui, após a montagem
    setIsPremium(getStoredPremiumStatus());
    setIsLoading(false);

    // 2. Função para lidar com mudanças no storage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PREMIUM_STORAGE_KEY) {
        setIsPremium(getStoredPremiumStatus());
      }
    };

    // Adiciona event listener para mudanças em outras abas/janelas
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Funções de controle
  const activatePremium = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      setIsPremium(true);
      // Manualmente dispara um evento de storage para que a janela atual também reaja
      window.dispatchEvent(new StorageEvent('storage', { key: PREMIUM_STORAGE_KEY }));
    } catch (error) {
      console.error("Failed to save premium status:", error);
    }
  }, []);

  const deactivatePremium = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'false');
      setIsPremium(false);
      window.dispatchEvent(new StorageEvent('storage', { key: PREMIUM_STORAGE_KEY }));
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