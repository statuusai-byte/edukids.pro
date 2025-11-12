import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

// Initial balance is 5, which is handled by the DB trigger on user creation.
const INITIAL_BALANCE = 5;

export function useHints() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [hints, setHints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHints = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_hints')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setHints(data.balance);
      } else {
        // If no row found, it means the trigger hasn't run yet or user is new.
        // We insert the initial balance.
        const { error: insertError } = await supabase
          .from('user_hints')
          .insert({ user_id: userId, balance: INITIAL_BALANCE });
        
        if (insertError) throw insertError;
        setHints(INITIAL_BALANCE);
      }
    } catch (error) {
      console.error("Failed to load hints balance from Supabase:", error);
      setHints(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      setIsLoading(true);
      return;
    }
    
    if (user) {
      fetchHints(user.id);
    } else {
      // Not logged in: hints are unavailable/zero
      setHints(0);
      setIsLoading(false);
    }
  }, [user, isAuthLoading, fetchHints]);

  const updateHintsInDb = useCallback(async (newBalance: number) => {
    if (!user) {
      showError("Você precisa estar logado para gerenciar dicas.");
      return false;
    }
    
    const { error } = await supabase
      .from('user_hints')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (error) {
      console.error("Failed to update hints balance:", error);
      showError("Falha ao atualizar dicas no servidor.");
      // Re-fetch to restore correct state
      fetchHints(user.id);
      return false;
    }
    setHints(newBalance);
    return true;
  }, [user, fetchHints]);

  const addHints = useCallback(async (amount: number) => {
    if (!user) {
      showError("Você precisa estar logado para adicionar dicas.");
      return;
    }
    const newBalance = hints + amount;
    await updateHintsInDb(newBalance);
  }, [hints, user, updateHintsInDb]);

  const useHint = useCallback(async () => {
    if (!user) {
      showError("Você precisa estar logado para usar dicas.");
      return false;
    }
    if (hints <= 0) {
      return false;
    }
    const newBalance = hints - 1;
    return await updateHintsInDb(newBalance);
  }, [hints, user, updateHintsInDb]);

  return {
    hints,
    isLoading,
    addHints,
    useHint,
  };
}