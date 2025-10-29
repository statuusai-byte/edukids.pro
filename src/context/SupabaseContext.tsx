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

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN') {
          showSuccess('Login realizado com sucesso!');
          
          // Grant premium for the test account
          if (currentSession?.user?.email === TEST_EMAIL) {
            try {
              localStorage.setItem("edukids_is_premium", "true");
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
          
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          showSuccess('Sessão encerrada.');
          navigate('/');
        }
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    // Clear local fallback data when signing out as well
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