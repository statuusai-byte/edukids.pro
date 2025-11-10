import { useEffect, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

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
    handler();
    
    // Use addEventListener if available, otherwise fallback to the legacy method if it exists
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } else if (mql.addListener) {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
    
    return () => {};
  }, []);

  return reduced;
}