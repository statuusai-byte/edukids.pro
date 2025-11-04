import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { showInterstitialAd } from '@/lib/capacitor';

const AD_DISPLAY_FREQUENCY = 8;

const getAdCounter = (): number => {
  try {
    return parseInt(localStorage.getItem('ad_counter') || '0', 10);
  } catch {
    return 0;
  }
};

const setAdCounter = (count: number) => {
  try {
    localStorage.setItem('ad_counter', String(count));
  } catch {
    // ignore storage errors
  }
};

const InterstitialAdManager = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isPremium } = usePremium();
  const adCounterRef = useRef(getAdCounter());

  useEffect(() => {
    if (isPremium) return;

    const isExcludedRoute = location.pathname === '/' || location.pathname === '/login';
    if (isExcludedRoute) return;

    adCounterRef.current += 1;
    setAdCounter(adCounterRef.current);

    if (adCounterRef.current >= AD_DISPLAY_FREQUENCY) {
      showInterstitialAd();
      adCounterRef.current = 0;
      setAdCounter(0);
    }
  }, [location.pathname, isPremium]);

  return <>{children}</>;
};

export default InterstitialAdManager;