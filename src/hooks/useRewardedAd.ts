import { useCallback, useEffect, useState } from "react";
import { showRewardAd } from "@/lib/capacitor";

const REWARD_ITEM = "Dica";
const REWARD_AMOUNT = 1;

export function useRewardedAd() {
  // Keep only the value we need to avoid declaring an unused setter
  const isAdLoaded = useState(true)[0]; // Assume loaded for simplicity with native layer
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
    },
  };
}