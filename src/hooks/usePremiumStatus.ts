import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

export function usePremiumStatus() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPremiumStatus = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      const status = data?.is_premium ?? false;
      setIsPremium(status);
      return status;
    } catch (error) {
      console.error("Failed to fetch premium status:", error);
      setIsPremium(false);
      return false;
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
      fetchPremiumStatus(user.id);
    } else {
      // Not logged in, definitely not premium
      setIsPremium(false);
      setIsLoading(false);
    }
  }, [user, isAuthLoading, fetchPremiumStatus]);

  // These functions now update the database and trigger a refetch/re-render
  const activatePremium = useCallback(async () => {
    if (!user) {
      showError("Você precisa estar logado para ativar o Premium.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id);

      if (error) throw error;
      setIsPremium(true);
    } catch (error) {
      console.error("Failed to activate premium in DB:", error);
      showError("Falha ao ativar Premium no servidor.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deactivatePremium = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('id', user.id);

      if (error) throw error;
      setIsPremium(false);
    } catch (error) {
      console.error("Failed to deactivate premium in DB:", error);
      showError("Falha ao desativar Premium no servidor.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isPremium,
    isLoading,
    activatePremium,
    deactivatePremium,
  };
}