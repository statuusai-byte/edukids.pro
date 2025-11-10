import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const PwaUpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error('PWA registration error:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success('O aplicativo está pronto para funcionar offline!');
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      const toastId = toast(
        'Uma nova versão do aplicativo está disponível!',
        {
          duration: Infinity, // Mantém a notificação aberta
          action: (
            <Button
              size="sm"
              onClick={() => {
                updateServiceWorker(true); // true = recarrega a página após a atualização
                toast.dismiss(toastId);
              }}
              className="bg-primary"
            >
              <Download className="mr-2 h-4 w-4" />
              Atualizar Agora
            </Button>
          ),
          onDismiss: () => {
            setNeedRefresh(false);
          },
        }
      );
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  return null; // Este componente renderiza apenas notificações
};

export default PwaUpdatePrompt;