import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

const TEST_EMAIL = "eduki.teste@gmail.com";
const PREMIUM_LOCAL_FLAG = "edukids_is_premium";

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Lê public.profiles.is_premium e aplica a flag localmente (para o cliente)
  const syncPremiumFromProfile = async (userId: string | undefined) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();

      if (!error && data && (data as any).is_premium) {
        try {
          localStorage.setItem(PREMIUM_LOCAL_FLAG, 'true');
        } catch (e) {
          // ignore localStorage errors
        }
        showSuccess('Acesso Premium aplicado para sua conta.');
      }
    } catch (e) {
      console.error('Failed to sync premium from profile:', e);
    }
  };

  useEffect(() => {
    // Ouve mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN') {
          showSuccess('Login realizado com sucesso!');

          // Fallback legacy: conta de teste
          if (currentSession?.user?.email === TEST_EMAIL) {
            try {
              localStorage.setItem(PREMIUM_LOCAL_FLAG, "true");
              const profile = {
                name: "Usuário Teste",
                avatarUrl: "https://i.pravatar.cc/150?u=edukids-test",
                email: TEST_EMAIL,
              };
              localStorage.setItem("edukids_profile", JSON.stringify(profile));
              const allPackages = ["matematica", "portugues", "ciencias", "historia", "geografia", "ingles"];
              localStorage.setItem('edukids_help_packages', JSON.stringify(allPackages));
              showSuccess("Conta de teste Premium ativada!");
            } catch (e) {
              console.error("Failed to activate premium test mode:", e);
              showError("Falha ao ativar o modo de teste Premium.");
            }
          }

          // Sincroniza o is_premium do profile (se existir)
          syncPremiumFromProfile(currentSession?.user?.id);

          // Redireciona para activities por padrão
          navigate('/activities');
        } else if (event === 'SIGNED_OUT') {
          showSuccess('Sessão encerrada.');
          navigate('/');
        }
      }
    );

    // Busca a sessão inicial e sincroniza premium (caso o usuário já esteja logado)
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
      if (initialSession?.user) {
        syncPremiumFromProfile(initialSession.user.id);
      }
    }).catch((err) => {
      console.error('Failed to get initial session:', err);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const signOut = async () => {
    // Limpa dados locais de fallback
    try {
      localStorage.removeItem('edukids_is_premium');
      localStorage.removeItem('edukids_help_packages');
      localStorage.removeItem('edukids_profile');
      localStorage.removeItem("edukids_force_premium_applied");
    } catch (e) {
      // ignore
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Falha ao sair: ' + error.message);
    } else {
      setUser(null);
      setSession(null);
    }
  };

  return (
    <SupabaseContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};