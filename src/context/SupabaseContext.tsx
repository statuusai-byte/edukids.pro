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
      localStorage.setItem(PREMIUM_LOCAL_FLAG, 'true');
      const profile = {
        name: 'Administrador EDUKIDS+',
        avatarUrl: 'https://i.pravatar.cc/150?u=admin-edukids',
        email: targetEmail,
      };
      localStorage.setItem('edukids_profile', JSON.stringify(profile));
      const allPackages = ['matematica', 'portugues', 'ciencias', 'historia', 'geografia', 'ingles'];
      localStorage.setItem('edukids_help_packages', JSON.stringify(allPackages));
      showSuccess('Conta administradora com Premium ativado.');
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
        try {
          localStorage.setItem(PREMIUM_LOCAL_FLAG, 'true');
        } catch (e) {
          console.error('Local storage error while syncing premium:', e);
        }
        showSuccess('Acesso Premium aplicado para sua conta.');
      }
    } catch (e) {
      console.error('Failed to sync premium from profile:', e);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN') {
          showSuccess('Login realizado com sucesso!');

          const currentEmail = currentSession?.user?.email ?? '';
          if (emailIsAdmin(currentEmail)) {
            applyLocalPremiumForAdmin(currentEmail);
          }

          syncPremiumFromProfile(currentSession?.user?.id);
          navigate('/activities');
        } else if (event === 'SIGNED_OUT') {
          showSuccess('Sessão encerrada.');
          navigate('/');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
      if (initialSession?.user) {
        const email = initialSession.user.email ?? '';
        if (emailIsAdmin(email)) {
          applyLocalPremiumForAdmin(email);
        }
        syncPremiumFromProfile(initialSession.user.id);
      }
    }).catch((err) => {
      console.error('Failed to get initial session:', err);
      setIsLoading(false);
    });

    return () => {
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