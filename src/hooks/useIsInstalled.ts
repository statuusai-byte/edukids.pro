import { useEffect, useState } from 'react';

/**
 * Hook para verificar se o PWA está rodando em modo standalone (instalado).
 */
export function useIsInstalled(): boolean {
  // Inicializa como false para evitar chamadas síncronas a APIs do navegador durante o build.
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    let isStandalone = false;
    try {
      // A media query `display-mode: standalone` é o padrão moderno para PWAs.
      const mql = window.matchMedia('(display-mode: standalone)');
      isStandalone = mql ? mql.matches : false;
    } catch (e) {
      console.error("Failed to check display-mode: standalone", e);
    }
    
    // `navigator.standalone` é uma propriedade legada específica da Apple para iOS.
    const isAppleStandalone = (window.navigator as any).standalone === true;

    if (isStandalone || isAppleStandalone) {
      setIsInstalled(true);
    }
  }, []);

  return isInstalled;
}