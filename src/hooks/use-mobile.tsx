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
    const mql = window.matchMedia("(pointer: coarse)");
    if (mql && mql.matches) {
      pointerCoarse = true;
    }
  }

  const widthBased = window.innerWidth < MOBILE_BREAKPOINT;

  // Ordem de decisão:
  // 1) userAgentData.mobile (quando disponível)
  // 2) pointer: coarse (telas de toque)
  // 3) largura da viewport
  if (uaDataMobile !== undefined) return uaDataMobile || pointerCoarse || widthBased;
  return pointerCoarse || widthBased;
}

export function useIsMobile() {
  // Inicializa como false no lado do servidor/build
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Apenas executa a lógica de detecção no lado do cliente
    const onResize = () => setIsMobile(computeIsMobile());

    // Ouve mudanças de tamanho e de pointer
    window.addEventListener("resize", onResize);

    let mql: MediaQueryList | null = null;
    if (typeof window.matchMedia === "function") {
      mql = window.matchMedia("(pointer: coarse)");
      // Need to check mql before adding listeners
      if (mql) {
        mql.addEventListener?.("change", onResize);
        mql.addListener?.(onResize);
      }
    }

    // Inicializa estado
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      if (mql) {
        mql.removeEventListener?.("change", onResize);
        mql.removeListener?.(onResize);
      }
    };
  }, []);

  return isMobile;
}