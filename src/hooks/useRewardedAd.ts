import { useState, useCallback, useEffect } from 'react';
import { showSuccess, showError } from '@/utils/toast';
import { showRewardAd } from '@/lib/capacitor';

const REWARD_ITEM = 'Dica';
const REWARD_AMOUNT = 1;

export function useRewardedAd() {
  const [isAdLoaded, setIsAdLoaded] = useState(true); // Assume loaded for simplicity with native layer
  const [isLoading, setIsLoading] = useState(false);

  // The native layer will handle pre-loading, so this can be simplified
  const loadAd = useCallback(() => {
    // This function can be kept for web compatibility or future logic
  }, []);

  useEffect(() => {
    // Initial load trigger if needed
  }, []);

  const showAd = useCallback(async () => {
    if (isLoading) return false;

    setIsLoading(true);
    const rewarded = await showRewardAd();
    setIsLoading(false);
    
    return rewarded;
  }, [isLoading]);

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