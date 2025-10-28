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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN') {
          showSuccess('Login realizado com sucesso!');
          // Redirecionar para o dashboard após o login
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          showSuccess('Sessão encerrada.');
          // Redirecionar para a home/login após o logout
          navigate('/');
        }
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user ?? null);
        setIsLoading(false);
        return;
      }

      // No remote session — check for a local test override.
      try {
        const localTestRaw = localStorage.getItem('edukids_local_test_user');
        if (localTestRaw) {
          const parsed = JSON.parse(localTestRaw);
          // Build a minimal fake User object that satisfies checks in the app.
          const fakeUser: User = {
            id: parsed.id || 'local-test-user',
            aud: 'authenticated',
            app_metadata: {},
            user_metadata: { name: parsed.name || 'Local Tester', email: parsed.email || parsed?.email },
            created_at: new Date().toISOString(),
            role: 'authenticated',
            email: parsed.email || null,
          } as unknown as User;

          setSession(null);
          setUser(fakeUser);
          setIsLoading(false);
          // Note: we intentionally do NOT attempt to call supabase.auth.setSession here.
          return;
        }
      } catch (e) {
        console.error('Failed to parse local test user override:', e);
      }

      // Default: no session and no local override
      setSession(null);
      setUser(null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    // Clear local test override if present
    try {
      localStorage.removeItem('edukids_local_test_user');
    } catch {}

    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Falha ao sair: ' + error.message);
    } else {
      // Also clear local profile/flags when sign out is successful
      try {
        localStorage.removeItem('edukids_profile');
        // keep other local test artifacts if needed, but remove premium override on sign out
        localStorage.removeItem('edukids_is_premium');
        localStorage.removeItem('edukids_help_packages');
      } catch {}
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