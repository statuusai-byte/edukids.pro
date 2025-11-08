import { registerSW } from 'virtual:pwa-register';

/**
 * Configura e registra o Service Worker para o PWA.
 * A chamada a `registerSW` com `immediate: true` garante que o Service Worker
 * seja ativado assim que for encontrado, acelerando a instalação e o cache offline.
 */
export function setupPwa(): void {
  registerSW({ immediate: true });
}