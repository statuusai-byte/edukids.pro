import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  // signOut: () => Promise<void>; // Removed
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  // Em modo liberado, simulamos que não há usuário logado, mas o carregamento é instantâneo.
  const [session] = useState<Session | null>(null);
  const [user] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apenas para garantir que o cliente Supabase está inicializado, mas não monitoramos o estado de auth.
    // O app opera como se estivesse deslogado, mas com acesso total.
    setIsLoading(false);
  }, []);

  // Removemos a função signOut, pois não há login.

  return (
    <SupabaseContext.Provider value={{ session, user, isLoading }}>
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