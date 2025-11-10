import * as React from "react";

const MOBILE_BREAKPOINT = 768;

function computeIsMobile() {
  if (typeof window === "undefined") return false;

  // Prefer capabilities over width
  const uaDataMobile =
    // @ts-expect-error userAgentData nem sempre existe
    typeof navigator !== "undefined" && navigator.userAgentData
      ? // @ts-expect-error
        !!navigator.userAgentData.mobile
      : undefined;

  const matchMediaAvailable = typeof window.matchMedia === "function";

  let pointerCoarse = false;
  if (matchMediaAvailable) {
    try {
      const mql = window.matchMedia("(pointer: coarse)");
      if (mql && mql.matches) {
        pointerCoarse = true;
      }
    } catch (e) {
      console.error("Error checking pointer: coarse", e);
    }
  }

  const widthBased = window.innerWidth < MOBILE_BREAKPOINT;

  // Ordem de decisão:
  if (uaDataMobile !== undefined) return uaDataMobile || pointerCoarse || widthBased;
  return pointerCoarse || widthBased;
}

// Função para obter o estado inicial seguro
function getInitialIsMobile() {
  if (typeof window === "undefined") return false;
  return computeIsMobile();
}

export function useIsMobile() {
  // Inicializa o estado com a detecção real no cliente, ou false no servidor
  const [isMobile, setIsMobile] = React.useState<boolean>(getInitialIsMobile);

  React.useEffect(() => {
    // Apenas executa a lógica de detecção no lado do cliente
    if (typeof window === "undefined") return;

    const onResize = () => setIsMobile(computeIsMobile());

    // Ouve mudanças de tamanho
    window.addEventListener("resize", onResize);

    let mql: MediaQueryList | null = null;
    if (typeof window.matchMedia === "function") {
      try {
        mql = window.matchMedia("(pointer: coarse)");
        // Adiciona listener moderno
        if (mql) {
          mql.addEventListener?.("change", onResize);
        }
      } catch (e) {
        console.error("Failed to set up matchMedia listener:", e);
      }
    }

    // Inicializa estado (já feito pelo useState, mas mantemos o onResize para garantir)
    // onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      if (mql) {
        mql.removeEventListener?.("change", onResize);
      }
    };
  }, []);

  return isMobile;
}