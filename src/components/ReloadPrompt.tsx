import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from "sonner";
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r);
    },
    onRegisterError(error) {
      console.log('Service Worker registration error:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (needRefresh) {
    toast(
      "Uma nova versão está disponível!",
      {
        description: "Clique no botão para atualizar e obter as últimas novidades.",
        duration: Infinity, // Mantém o toast visível até ser dispensado
        action: (
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => updateServiceWorker(true)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        ),
        onDismiss: close,
        onAutoClose: close,
      }
    );
  }

  return null;
}

export default ReloadPrompt;