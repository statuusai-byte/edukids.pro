import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { showInterstitialAd } from '@/lib/capacitor';

const AD_DISPLAY_FREQUENCY = 8;
const INTERSTITIALS_ENABLED_KEY = "edukids_show_interstitials";
const AD_COUNTER_KEY = 'ad_counter';

const getAdCounter = (): number => {
  try {
    return parseInt(localStorage.getItem(AD_COUNTER_KEY) || '0', 10);
  } catch {
    return 0;
  }
};

const setAdCounter = (count: number) => {
  try {
    localStorage.setItem(AD_COUNTER_KEY, String(count));
  } catch {
    // ignore storage errors
  }
};

const areInterstitialAdsEnabled = (): boolean => {
  try {
    const raw = localStorage.getItem(INTERSTITIALS_ENABLED_KEY);
    return raw === null || raw === 'true';
  } catch {
    return true;
  }
};

export const useInterstitialAdManager = () => {
  const location = useLocation();
  const { isPremium } = usePremium();
  const adCounterRef = useRef(getAdCounter());

  useEffect(() => {
    if (isPremium || !areInterstitialAdsEnabled()) {
      return;
    }

    const isExcludedRoute = location.pathname === '/' || location.pathname.startsWith('/login') || location.pathname.startsWith('/register');
    if (isExcludedRoute) {
      return;
    }

    adCounterRef.current += 1;
    setAdCounter(adCounterRef.current);

    if (adCounterRef.current >= AD_DISPLAY_FREQUENCY) {
      showInterstitialAd();
      adCounterRef.current = 0;
      setAdCounter(0);
    }
  }, [location.pathname, isPremium]);
};