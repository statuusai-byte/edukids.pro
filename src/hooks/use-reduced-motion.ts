import { useEffect, useState } from 'react';

function getInitialReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mql ? mql.matches : false;
  } catch (e) {
    console.error("Failed to check initial reduced motion:", e);
    return false;
  }
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(getInitialReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    
    let mql: MediaQueryList | null = null;
    try {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch (e) {
      console.error("Failed to initialize matchMedia for reduced motion:", e);
      return;
    }
    
    if (!mql) return;
    
    const handler = () => setReduced(mql.matches);
    // handler(); // Já inicializado pelo useState
    
    // Use addEventListener se disponível
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else if (mql.addListener) {
      // Fallback para método legado
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
    
    return () => {};
  }, []);

  return reduced;
}