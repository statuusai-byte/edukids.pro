import { useEffect, useState } from 'react';

/**
 * Hook para verificar se o PWA está rodando em modo standalone (instalado).
 * Isso ajuda a ocultar prompts de "instale o app" para usuários que já o instalaram.
 */
export function useIsInstalled(): boolean {
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
    // É bom verificar para maior compatibilidade.
    const isAppleStandalone = (window.navigator as any).standalone === true;

    if (isStandalone || isAppleStandalone) {
      setIsInstalled(true);
    }
  }, []);

  return isInstalled;
}