import { useEffect, useState } from 'react';

/**
 * Hook para verificar se o PWA está rodando em modo standalone (instalado).
 */
function getInitialIsInstalled(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  
  let isStandalone = false;
  try {
    const mql = window.matchMedia('(display-mode: standalone)');
    isStandalone = mql ? mql.matches : false;
  } catch (e) {
    console.error("Failed to check display-mode: standalone", e);
  }
  
  const isAppleStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isAppleStandalone;
}

export function useIsInstalled(): boolean {
  const [isInstalled, setIsInstalled] = useState(getInitialIsInstalled);

  useEffect(() => {
    // A lógica de inicialização já está no useState, mas podemos adicionar um listener se necessário
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    // Não há um evento padrão para 'installed', mas podemos garantir que o estado é atualizado
    // se o display-mode mudar (embora isso geralmente exija um reload).
    const checkStatus = () => setIsInstalled(getInitialIsInstalled());
    
    // Adicionar um listener para display-mode: standalone é complexo,
    // mas garantimos que o estado inicial é seguro.
    
    // Para garantir que o estado seja reavaliado após a montagem inicial,
    // chamamos checkStatus uma vez.
    checkStatus();

  }, []);

  return isInstalled;
}