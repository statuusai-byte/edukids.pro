import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';

export function useHints() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [hints, setHints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const syncHints = useCallback(async () => {
    if (!user) {
      setHints(0);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_hints')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;

      setHints(data?.balance ?? 0);
    } catch (e) {
      console.error("Failed to sync hints:", e);
      setHints(0);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      syncHints();
    }
  }, [user, isAuthLoading, syncHints]);

  const updateHintsOnServer = async (newBalance: number) => {
    if (!user) return false;
    const { error } = await supabase
      .from('user_hints')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Failed to update hints on server:", error);
      await syncHints();
      return false;
    }
    return true;
  };

  const addHints = useCallback(async (amount: number) => {
    const newBalance = hints + amount;
    setHints(newBalance);
    await updateHintsOnServer(newBalance);
  }, [hints, updateHintsOnServer]);

  const useHint = useCallback(async () => {
    if (hints <= 0) return false;
    const newBalance = hints - 1;
    setHints(newBalance);
    const success = await updateHintsOnServer(newBalance);
    return success;
  }, [hints, updateHintsOnServer]);

  return {
    hints,
    isLoading,
    addHints,
    useHint,
  };
}