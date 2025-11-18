import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

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
      <div className="w-full max-w-md glass-card p-8 space-y-8">
        <div className="text-center">
          <UserPlus className="h-16 w-16 text-yellow-400 mx-auto mb-4 animate-slow-glow" />
          <h1 className="text-4xl font-extrabold tracking-tight text-shadow-lg">
            Crie sua Conta
          </h1>
          <p className="text-white/80 mt-2">Junte-se à aventura do conhecimento!</p>
        </div>
        <Auth
          supabaseClient={supabase}
          view="sign_up"
          providers={[]}
          theme="dark"
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
            first_name: 'Novo',
            last_name: 'Explorador',
          }}
          appearance={{
            theme: ThemeSupa,
            className: {
              button: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg border-0',
              input: 'bg-black/30 border-2 border-white/20 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300',
              label: 'text-sm font-medium text-white/80 mb-2 block',
              anchor: 'text-yellow-400 hover:text-yellow-300 underline',
              message: 'text-red-400 text-sm mt-2',
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

export default Register;