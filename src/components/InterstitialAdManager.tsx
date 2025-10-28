import { useEffect, useState, ReactNode, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { showSuccess } from '@/utils/toast';

const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-4720172954033263/4170441220";
const AD_DISPLAY_FREQUENCY = 3; // Mostrar anúncio a cada 3 transições de página

interface InterstitialAdManagerProps {
  children: ReactNode;
}

// Este componente simula a lógica de exibição de um anúncio intersticial
// em um aplicativo real, usando o localStorage para rastrear a frequência.
const InterstitialAdManager = ({ children }: InterstitialAdManagerProps) => {
  const location = useLocation();
  const [isAdShowing, setIsAdShowing] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Apenas rodar a lógica se não estiver na página inicial ou de login
    if (location.pathname === '/' || location.pathname === '/login') {
      return;
    }

    const currentCount = parseInt(localStorage.getItem('ad_counter') || '0', 10);
    const nextCount = currentCount + 1;

    if (nextCount >= AD_DISPLAY_FREQUENCY) {
      // Se já existir um timer anterior, limpamos antes de criar outro
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Simular a exibição do anúncio
      setIsAdShowing(true);

      // Agendamos o fechamento do anúncio — guardado em ref para não ser perdido entre re-renders.
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setIsAdShowing(false);
        showSuccess(`Anúncio Intersticial (ID: ${INTERSTITIAL_AD_UNIT_ID}) exibido. Continuando...`);
        localStorage.setItem('ad_counter', '0'); // Resetar contador
      }, 1500); // Simula 1.5s de exibição do anúncio

      // Garantimos que o contador fique registrado enquanto o anúncio está exibido
      localStorage.setItem('ad_counter', nextCount.toString());
      return;
    } else {
      localStorage.setItem('ad_counter', nextCount.toString());
    }
  }, [location.pathname]);

  // Limpar timer apenas quando o componente desmontar para evitar o overlay preso
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