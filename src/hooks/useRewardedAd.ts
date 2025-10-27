import { useState, useCallback } from 'react';
import { showSuccess, showError } from '@/utils/toast';

const REWARDED_AD_UNIT_ID = "ca-app-pub-4720172954033263/2046840767";

// Simulação de recompensa definida no AdMob: 1 unidade de 'reward'
const REWARD_ITEM = 'Dica';
const REWARD_AMOUNT = 1;

export function useRewardedAd() {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simula o carregamento do anúncio
  const loadAd = useCallback(() => {
    if (isAdLoaded || isLoading) return;

    setIsLoading(true);
    // Simula o tempo de carregamento do SDK
    setTimeout(() => {
      setIsAdLoaded(true);
      setIsLoading(false);
      showSuccess('Anúncio de recompensa carregado e pronto!');
    }, 1000);
  }, [isAdLoaded, isLoading]);

  // Simula a exibição do anúncio e a recompensa
  const showAd = useCallback(async () => {
    if (!isAdLoaded) {
      showError('O anúncio ainda não está pronto. Tente novamente.');
      return;
    }

    setIsAdLoaded(false); // O anúncio é consumido após a exibição

    // Simula a tela de anúncio intersticial
    const adDuration = 3000; // 3 segundos de simulação
    
    showSuccess(`Exibindo Anúncio Premiado (ID: ${REWARDED_AD_UNIT_ID}). Aguarde...`);

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simula o evento de recompensa (o usuário assistiu até o fim)
        showSuccess(`Recompensa concedida: ${REWARD_AMOUNT} ${REWARD_ITEM}!`);
        resolve(true);
        
        // Recarrega o anúncio após a exibição
        loadAd();
      }, adDuration);
    });
  }, [isAdLoaded, loadAd]);

  return {
    isAdLoaded,
    isLoading,
    loadAd,
    showAd,
    rewardDetails: {
      item: REWARD_ITEM,
      amount: REWARD_AMOUNT,
    }
  };
}