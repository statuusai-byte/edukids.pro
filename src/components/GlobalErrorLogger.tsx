"use client";

import { useEffect, useRef } from "react";
import { showError } from "@/utils/toast";

const buildFriendlyMessage = (rawMessage?: string) => {
  if (!rawMessage) {
    return "Ops! Algo inesperado aconteceu. Recarregue o app e tente novamente.";
  }

  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror when attempting to fetch resource")
  ) {
    return "Não foi possível conectar com o servidor. Verifique sua internet e tente novamente.";
  }

  if (
    normalized.includes("loading chunk") ||
    normalized.includes("dynamically imported module")
  ) {
    return "Detectamos uma atualização do aplicativo. Recarregue para continuar.";
  }

  if (
    normalized.includes("service worker") &&
    normalized.includes("typeerror")
  ) {
    return "O modo offline não inicializou corretamente. Feche e abra o app para concluir a atualização.";
  }

  return `Erro: ${rawMessage}`;
};

const GlobalErrorLogger = () => {
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      try {
        const rawMessage = event?.message || event?.error?.message;
        const friendlyMessage = buildFriendlyMessage(rawMessage);

        // Avoid duplicating identical alerts
        if (lastMessageRef.current !== friendlyMessage) {
          lastMessageRef.current = friendlyMessage;
          showError(friendlyMessage);
        }

        console.error("GlobalErrorLogger caught error:", event.error ?? event.message, event);
      } catch (handlerError) {
        console.error("GlobalErrorLogger handler failed", handlerError);
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        const reason = event?.reason;
        const rawMessage = typeof reason === "string" ? reason : reason?.message;
        const friendlyMessage = buildFriendlyMessage(rawMessage);

        if (lastMessageRef.current !== friendlyMessage) {
          lastMessageRef.current = friendlyMessage;
          showError(friendlyMessage);
        }

        console.error("GlobalErrorLogger caught unhandledrejection:", reason, event);
      } catch (handlerError) {
        console.error("GlobalErrorLogger rejection handler failed", handlerError);
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
};

export default GlobalErrorLogger;