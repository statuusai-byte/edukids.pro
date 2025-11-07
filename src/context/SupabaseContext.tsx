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

const PREMIUM_LOCAL_FLAG = 'edukids_is_premium';
const ADMIN_EMAILS = ['statuus.ai@gmail.com', 'eduki.teste@gmail.com'];

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const emailIsAdmin = (email: string | null | undefined) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  const applyLocalPremiumForAdmin = (targetEmail: string) => {
    try {
      const wasAlreadyPremium = localStorage.getItem(PREMIUM_LOCAL_FLAG) === 'true';
      localStorage.setItem(PREMIUM_LOCAL_FLAG, 'true');
      const profile = {
        name: 'Administrador EDUKIDS+',
        avatarUrl: 'https://i.pravatar.cc/150?u=admin-edukids',
        email: targetEmail,
      };
      localStorage.setItem('edukids_profile', JSON.stringify(profile));
      const allPackages = ['matemantica', 'portugues', 'ciencias', 'historia', 'geografia', 'ingles'];
      localStorage.setItem('edukids_help_packages', JSON.stringify(allPackages));
      
      if (!wasAlreadyPremium) {
        showSuccess('Conta administradora com Premium ativado.');
      }
    } catch (e) {
      console.error('Failed to activate local premium for admin:', e);
      showError('Falha ao aplicar modo Premium local.');
    }
  };

  const syncPremiumFromProfile = async (userId: string | undefined) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();

      if (!error && data && (data as any).is_premium) {
        const wasAlreadyPremium = localStorage.getItem(PREMIUM_LOCAL_FLAG) === 'true';
        try {
          localStorage.setItem(PREMIUM_LOCAL_FLAG, 'true');
        } catch (e) {
          console.error('Local storage error while syncing premium:', e);
        }
        if (!wasAlreadyPremium) {
          showSuccess('Acesso Premium aplicado para sua conta.');
        }
      }
    } catch (e) {
      console.error('Failed to sync premium from profile:', e);
    }
  };

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
        if (session?.user) {
          if (session.user.email && emailIsAdmin(session.user.email)) {
            applyLocalPremiumForAdmin(session.user.email);
          }
          await syncPremiumFromProfile(session.user.id);
        }
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
          if (currentUser.email && emailIsAdmin(currentUser.email)) {
            applyLocalPremiumForAdmin(currentUser.email);
          }
          await syncPremiumFromProfile(currentUser.id);
        } else if (_event === 'SIGNED_OUT') {
          // We intentionally avoid forcibly navigating to '/' here because
          // sudden navigations are a common cause of 'jump back to home' issues
          // on mobile when auth state fluctuates. Let the UI react naturally.
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
    try {
      localStorage.removeItem('edukids_is_premium');
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