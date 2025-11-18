import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activatePremiumSecurely } = usePremium();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const { userId, token } = location.state || {};

    if (!userId || !token) {
      setErrorMessage('Dados de ativação inválidos. Por favor, contate o suporte.');
      setStatus('error');
      return;
    }

    const activate = async () => {
      const success = await activatePremiumSecurely(userId, token);
      if (success) {
        setStatus('success');
      } else {
        setErrorMessage('Falha ao ativar o Premium. O token pode ser inválido ou já utilizado. Verifique sua assinatura ou contate o suporte.');
        setStatus('error');
      }
    };

    activate();
  }, [location.state, activatePremiumSecurely]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
      {status === 'processing' && (
        <>
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <h1 className="text-2xl font-bold">Processando sua assinatura...</h1>
          <p className="text-muted-foreground">Aguarde enquanto ativamos seus benefícios Premium.</p>
        </>
      )}
      {status === 'success' && (
        <>
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold">Assinatura Ativada!</h1>
          <p className="text-muted-foreground">Bem-vindo ao Premium! Você já pode acessar todos os benefícios.</p>
          <Button onClick={() => navigate('/play-plus')} className="mt-6">
            Explorar o Play+
          </Button>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold">Ocorreu um Erro</h1>
          <p className="text-muted-foreground max-w-md">{errorMessage}</p>
          <Button onClick={() => navigate('/store')} className="mt-6">
            Voltar para a Loja
          </Button>
        </>
      )}
    </div>
  );
};

export default SuccessPayment;