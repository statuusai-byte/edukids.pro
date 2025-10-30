import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/context/SupabaseContext';
import { Navigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition'; // Import PageTransition

const Register = () => {
  const { user, isLoading } = useSupabase();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  // If already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Crie sua conta no EDUKIDS+</h1>
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
                sign_in: {
                  email_label: 'Seu Email',
                  password_label: 'Sua Senha',
                  email_input_placeholder: 'email@exemplo.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Não tem uma conta? Criar Conta',
                },
              },
            }}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Register;