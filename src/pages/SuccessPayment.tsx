import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { showSuccess, showError } from '@/utils/toast';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPayment = () => {
  const { activatePremiumSecurely } = usePremium();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get('user_id');
    const sku = searchParams.get('sku');
    const token = searchParams.get('token');

    if (!userId || !sku || !token) {
      showError("Pagamento inválido ou token de segurança ausente.");
      navigate('/store', { replace: true });
      return;
    }

    const activate = async () => {
      const success = await activatePremiumSecurely(userId, token);
      
      if (success) {
        showSuccess("Assinatura Premium ativada com sucesso! Bem-vindo(a) ao EDUKIDS+.");
      } else {
        showError("Falha ao ativar Premium. Tente recarregar ou entre em contato com o suporte.");
      }
      
      // Redireciona para o dashboard após um pequeno atraso
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    };

    activate();
  }, [activatePremiumSecurely, navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Pagamento Confirmado!</h1>
        <p className="text-muted-foreground">Sua assinatura Premium está sendo ativada. Você será redirecionado em breve.</p>
        <Button onClick={() => navigate('/dashboard', { replace: true })} className="mt-6">
          Ir para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SuccessPayment;