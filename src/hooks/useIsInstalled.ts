import { useEffect, useState } from 'react';

/**
 * Hook para verificar se o PWA está rodando em modo standalone (instalado).
 * Isso ajuda a ocultar prompts de "instale o app" para usuários que já o instalaram.
 */
export function useIsInstalled(): boolean {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    // A media query `display-mode: standalone` é o padrão moderno para PWAs.
    const mql = window.matchMedia('(display-mode: standalone)');
    const isStandalone = mql ? mql.matches : false;
    
    // `navigator.standalone` é uma propriedade legada específica da Apple para iOS.
    // É bom verificar para maior compatibilidade.
    const isAppleStandalone = (window.navigator as any).standalone === true;

    if (isStandalone || isAppleStandalone) {
      setIsInstalled(true);
    }
  }, []);

  return isInstalled;
}