import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/activities');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-starry-sky bg-cover bg-center">
      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Entrar na sua Conta</h1>
          <p className="text-muted-foreground">Bem-vindo de volta, explorador!</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu email',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                link_text: 'Já tem uma conta? Entre aqui',
              },
              sign_up: {
                link_text: 'Não tem uma conta? Crie uma aqui',
              }
            },
          }}
        />
        <div className="text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary underline">
            Voltar para a tela inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;