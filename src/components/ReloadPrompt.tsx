import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket } from 'lucide-react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r)
    },
    onRegisterError(error) {
      console.log('Service Worker registration error:', error)
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (needRefresh) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
             <Rocket className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Nova versão disponível!</CardTitle>
              <CardDescription>Recarregue para aplicar as últimas atualizações.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => close()}>
              Ignorar
            </Button>
            <Button onClick={() => updateServiceWorker(true)}>
              Atualizar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}

export default ReloadPrompt;