import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Após o registro, o usuário é logado automaticamente e redirecionado
        navigate('/'); 
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-starry-sky bg-cover bg-center">
      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <div className="text-center">
          <UserPlus className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Crie sua Conta</h1>
          <p className="text-muted-foreground">Junte-se à aventura do conhecimento!</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="dark"
          view="sign_up"
          localization={{
            variables: {
              sign_up: {
                email_label: 'Seu email',
                password_label: 'Crie uma senha',
                button_label: 'Criar conta',
                link_text: 'Já tem uma conta? Entre aqui',
              },
              sign_in: {
                link_text: 'Já tem uma conta? Entre aqui',
              }
            },
          }}
          additionalData={{
            // Estes campos serão usados pela função handle_new_user no Supabase
            // para popular a tabela de perfis.
            first_name: 'Novo',
            last_name: 'Explorador',
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

export default Register;