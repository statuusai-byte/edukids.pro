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

function makeLocalUserFromProfile(profile: any): User {
  // Create a minimal synthetic User object to satisfy app expectations.
  // Cast to User because building every field precisely is unnecessary for local fallback.
  return {
    id: profile?.email ? `local:${profile.email}` : `local:${Math.random().toString(36).slice(2)}`,
    app_metadata: {},
    user_metadata: {
      full_name: profile?.name ?? null,
      avatar_url: profile?.avatarUrl ?? null,
      email: profile?.email ?? null,
    },
    aud: 'authenticated',
    confirmation_sent_at: null,
    confirmed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    email: profile?.email ?? undefined,
    phone: null,
    role: 'authenticated',
    // supabase User has many optional fields; use type assertion for local fallback
  } as unknown as User;
}

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

      // No Supabase session — check for local seeded test account/profile as fallback
      try {
        const localPremium = localStorage.getItem('edukids_is_premium');
        const localProfileRaw = localStorage.getItem('edukids_profile');
        if (localPremium === 'true' && localProfileRaw) {
          const profile = JSON.parse(localProfileRaw);
          const localUser = makeLocalUserFromProfile(profile);
          setSession(null); // no real session, but app can treat as logged in
          setUser(localUser);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Failed to initialize local fallback user:', e);
      }

      // Default: no session, no local fallback
      setSession(null);
      setUser(null);
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
      // keep profile if you want; remove help packages and premium flag at least
      localStorage.removeItem('edukids_help_packages');
    } catch (e) {
      // ignore
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      showError('Falha ao sair: ' + error.message);
    } else {
      // Ensure local user state is cleared immediately
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