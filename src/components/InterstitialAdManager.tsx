import { useEffect, useState, ReactNode, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-472017295403326f"; // keep existing id (displayed)
const AD_DISPLAY_FREQUENCY = 8; // Much less frequent than before (was 3)

interface InterstitialAdManagerProps {
  children: ReactNode;
}

// This component simulates interstitial ad display.
// It now respects a user preference stored at 'edukids_show_interstitials'.
// If that key is set to "false", interstitials are skipped entirely.
const InterstitialAdManager = ({ children }: InterstitialAdManagerProps) => {
  const location = useLocation();
  const [isAdShowing, setIsAdShowing] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // If user disabled interstitials, skip everything
    try {
      const showInterstitials = localStorage.getItem('edukids_show_interstitials');
      if (showInterstitials === 'false') {
        return;
      }
    } catch (e) {
      // ignore localStorage errors and proceed
    }

    // Don't show on home or login
    if (location.pathname === '/' || location.pathname === '/login') {
      return;
    }

    const currentCount = parseInt(localStorage.getItem('ad_counter') || '0', 10);
    const nextCount = currentCount + 1;

    if (nextCount >= AD_DISPLAY_FREQUENCY) {
      // If an existing timer exists, clear it first (prevents overlap)
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setIsAdShowing(true);

      // Schedule hiding the ad and reset counter
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setIsAdShowing(false);
        showSuccess(`Anúncio Intersticial exibido. ID: ${INTERSTITIAL_AD_UNIT_ID}`);
        try {
          localStorage.setItem('ad_counter', '0');
        } catch (e) {
          // ignore
        }
      }, 1500); // simulated display time

      // record the counter while the ad is showing
      try {
        localStorage.setItem('ad_counter', String(nextCount));
      } catch (e) {
        // ignore
      }
      return;
    } else {
      try {
        localStorage.setItem('ad_counter', String(nextCount));
      } catch (e) {
        // ignore
      }
    }
  }, [location.pathname]);

  // Clean up timer on unmount only
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  if (isAdShowing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="text-center p-8 glass-card">
          <h2 className="text-3xl font-bold text-primary mb-4">Anúncio Intersticial</h2>
          <p className="text-muted-foreground">O conteúdo será carregado em breve...</p>
          <p className="text-xs mt-4">ID da Unidade: {INTERSTITIAL_AD_UNIT_ID}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default InterstitialAdManager;