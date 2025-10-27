import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/context/PremiumContext';
import { showSuccess } from '@/utils/toast';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPayment = () => {
  const { activatePremium } = usePremium();
  const navigate = useNavigate();

  useEffect(() => {
    // Ativa o status Premium no armazenamento local
    activatePremium();
    showSuccess("Assinatura Premium ativada com sucesso! Bem-vindo(a) ao EDUKIDS+.");
    
    // Redireciona para o dashboard após um pequeno atraso
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [activatePremium, navigate]);

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