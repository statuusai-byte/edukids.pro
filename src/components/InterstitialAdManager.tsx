import { useEffect, useState, ReactNode, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';
import { usePremium } from '@/context/PremiumContext';

const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-472017295403326f";
const AD_DISPLAY_FREQUENCY = 8;
const AD_DISPLAY_TIME_MS = 1000; // tempo reduzido

interface InterstitialAdManagerProps {
  children: ReactNode;
}

// Exibe um card pequeno e não bloqueante no canto inferior direito para usuários FREE.
// Usuários premium não veem intersticiais.
const InterstitialAdManager = ({ children }: InterstitialAdManagerProps) => {
  const location = useLocation();
  const [isAdShowing, setIsAdShowing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { isPremium } = usePremium();

  useEffect(() => {
    if (isPremium) return; // Premium não vê anúncios

    // Permissão do usuário para exibir intersticiais (padrão: true)
    try {
      const showInterstitials = localStorage.getItem('edukids_show_interstitials');
      if (showInterstitials === 'false') {
        return;
      }
    } catch (e) {
      // ignore
    }

    // Não mostrar nas rotas iniciais
    if (location.pathname === '/' || location.pathname === '/login') {
      return;
    }

    const currentCount = parseInt(localStorage.getItem('ad_counter') || '0', 10);
    const nextCount = currentCount + 1;

    if (nextCount >= AD_DISPLAY_FREQUENCY) {
      // limpa timers anteriores
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setIsAdShowing(true);

      // agendar esconder o card e resetar contador
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setIsAdShowing(false);
        showSuccess(`Anúncio Intersticial exibido. ID: ${INTERSTITIAL_AD_UNIT_ID}`);
        try {
          localStorage.setItem('ad_counter', '0');
        } catch (e) {
          // ignore
        }
      }, AD_DISPLAY_TIME_MS);

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
  }, [location.pathname, isPremium]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Renderiza um card flutuante pequeno no canto inferior direito (não bloqueante)
  return (
    <>
      {children}
      {isAdShowing && (
        <div className="fixed z-50 bottom-6 right-6 pointer-events-none">
          <div className="pointer-events-auto w-80 glass-card p-4 shadow-2xl border-white/10">
            <h3 className="text-lg font-bold text-primary mb-1">Anúncio Patrocinado</h3>
            <p className="text-sm text-muted-foreground mb-2">Obrigado ao nosso patrocinador — o conteúdo aparecerá em breve.</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">ID: {INTERSTITIAL_AD_UNIT_ID}</span>
              <span className="text-xs text-muted-foreground">⏱️</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterstitialAdManager;