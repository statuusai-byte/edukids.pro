import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { showInterstitialAd } from '@/lib/capacitor';

const AD_DISPLAY_FREQUENCY = 8;

const InterstitialAdManager = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { isPremium } = usePremium();
  const adCounterRef = useRef(parseInt(localStorage.getItem('ad_counter') || '0', 10));

  useEffect(() => {
    if (isPremium) return;

    const isExcludedRoute = location.pathname === '/' || location.pathname === '/login';
    if (isExcludedRoute) return;

    adCounterRef.current += 1;
    localStorage.setItem('ad_counter', String(adCounterRef.current));

    if (adCounterRef.current >= AD_DISPLAY_FREQUENCY) {
      showInterstitialAd();
      adCounterRef.current = 0;
      localStorage.setItem('ad_counter', '0');
    }
  }, [location.pathname, isPremium]);

  // The component no longer needs to render any UI, as the native plugin handles it.
  return <>{children}</>;
};

export default InterstitialAdManager;