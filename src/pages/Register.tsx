import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/context/SupabaseContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const Register = () => {
  const { user, isLoading } = useSupabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/activities', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Sparkles className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8">
        <h1 className="text-3xl font-bold text-center mb-3">Crie sua conta no EDUKIDS+</h1>
        <p className="text-xs text-muted-foreground text-center mb-4">
          Ao criar sua conta, enviaremos um e-mail de confirmação. Verifique sua caixa de entrada e siga o link.
        </p>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          view="sign_up"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                  defaultButtonBackground: 'hsl(var(--secondary))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--foreground))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--primary))',
                  inputBorderFocus: 'hsl(var(--primary))',
                },
              },
            },
          }}
          theme="dark"
          localization={{
            variables: {
              sign_up: {
                email_label: 'Seu Email',
                password_label: 'Crie uma Senha',
                email_input_placeholder: 'email@exemplo.com',
                password_input_placeholder: '••••••••',
                button_label: 'Criar Conta',
                loading_button_label: 'Criando conta...',
                social_provider_text: 'Criar conta com {{provider}}',
                link_text: 'Já tem uma conta? Entrar',
              },
            },
          }}
        />
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Não recebeu? Verifique a pasta de spam ou tente novamente.
        </p>
      </div>
    </div>
  );
};

export default Register;