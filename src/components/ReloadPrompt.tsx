"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw } from "lucide-react";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("Service Worker registrado:", r);
    },
    onRegisterError(error) {
      console.error("Erro no registro do Service Worker:", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-28 z-50 md:bottom-8">
      <Card className="glass-card animate-fade-in-up border-primary/50 shadow-lg shadow-primary/20">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="text-sm font-medium">
            {offlineReady ? (
              <span>O app está pronto para funcionar offline.</span>
            ) : (
              <span>Nova atualização disponível!</span>
            )}
          </div>
          {needRefresh && (
            <Button
              size="sm"
              className="bg-primary"
              onClick={() => updateServiceWorker(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={close}>
            Fechar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReloadPrompt;