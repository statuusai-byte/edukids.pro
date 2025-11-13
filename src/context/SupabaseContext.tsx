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

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const sessionCheckTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn("Supabase session check timed out. Proceeding without session.");
        setIsLoading(false);
      }
    }, 5000);

    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching initial session:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        clearTimeout(sessionCheckTimeout);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        if (!isMounted) return;
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (_event === 'SIGNED_IN' && currentUser) {
          showSuccess('Login realizado com sucesso!');
        } else if (_event === 'SIGNED_OUT') {
          showSuccess('Sessão encerrada.');
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(sessionCheckTimeout);
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    // Clear any potentially sensitive local storage on sign out
    try {
      localStorage.removeItem('edukids_is_premium');
      localStorage.removeItem('edukids_hints_balance');
      localStorage.removeItem('edukids_help_packages');
      localStorage.removeItem('edukids_profile');
      localStorage.removeItem('edukids_force_premium_applied');
    } catch (e) {
      console.warn('Failed to clear local storage on sign out:', e);
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Falha ao sair: ' + error.message);
    } else {
      setUser(null);
      setSession(null);
      navigate('/login', { replace: true });
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