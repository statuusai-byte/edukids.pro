"use client";

import { useEffect } from "react";
import { showError } from "@/utils/toast";

/**
 * GlobalErrorLogger
 *
 * Instala listeners para:
 *  - window 'error' (runtime exceptions)
 *  - window 'unhandledrejection' (promise rejections, chunk load failures)
 *
 * Quando ocorrer um erro, exibe um toast e registra no console para ajudar a debugar no preview/Vercel.
 */
const GlobalErrorLogger = () => {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      try {
        const msg = event?.message ?? "Erro JS desconhecido";
        const src = event?.filename ? ` em ${event.filename}:${event.lineno}:${event.colno}` : "";
        console.error("GlobalErrorLogger caught error:", event.error ?? event.message, event);
        showError(`Erro: ${msg}${src}. Veja console para mais detalhes.`);
      } catch (e) {
        // swallow
        // eslint-disable-next-line no-console
        console.error("GlobalErrorLogger handler failed", e);
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        const reason = (event?.reason && (typeof event.reason === "string" ? event.reason : (event.reason.message ?? JSON.stringify(event.reason)))) ?? "Rejeição de Promise";
        console.error("GlobalErrorLogger caught unhandledrejection:", event.reason, event);
        // Special-case common chunk load failure text to give clearer hint
        if (String(reason).toLowerCase().includes("failed to fetch") || String(reason).toLowerCase().includes("loading chunk")) {
          showError("Falha ao carregar recurso (chunk). Verifique a URL de assets e abra o console (Network) para ver 404.");
        } else {
          showError(`Rejeição não tratada: ${String(reason).slice(0, 120)}`);
        }
      } catch (e) {
        // swallow
        // eslint-disable-next-line no-console
        console.error("GlobalErrorLogger rejection handler failed", e);
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