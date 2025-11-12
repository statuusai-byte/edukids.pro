import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

export function usePremiumStatus() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [isPremium, setIsPremium] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTrialActive = useMemo(() => {
    if (!trialEndsAt) return false;
    return new Date(trialEndsAt) > new Date();
  }, [trialEndsAt]);

  const fetchPremiumStatus = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, trial_ends_at') // Fetch new column
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      const status = data?.is_premium ?? false;
      const trialEnd = data?.trial_ends_at ?? null;
      setTrialEndsAt(trialEnd);

      const trialActive = trialEnd ? new Date(trialEnd) > new Date() : false;
      setIsPremium(status || trialActive);
      return status || trialActive;
    } catch (error) {
      console.error("Failed to fetch premium status:", error);
      setIsPremium(false);
      setTrialEndsAt(null);
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
      setTrialEndsAt(null);
      setIsLoading(false);
    }
  }, [user, isAuthLoading, fetchPremiumStatus]);

  const startTrial = useCallback(async () => {
    if (!user) {
      showError("Você precisa estar logado para iniciar o teste Premium.");
      return false;
    }
    if (isPremium) {
      showError("Você já é Premium ou está em teste.");
      return false;
    }

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const trialEndISO = sevenDaysFromNow.toISOString();

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ trial_ends_at: trialEndISO })
        .eq('id', user.id);

      if (error) throw error;
      
      setTrialEndsAt(trialEndISO);
      setIsPremium(true); // Activate premium status immediately
      return true;
    } catch (error) {
      console.error("Failed to start trial in DB:", error);
      showError("Falha ao iniciar o teste Premium no servidor.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, isPremium]);

  const activatePremium = useCallback(async () => {
    if (!user) {
      showError("Você precisa estar logado para ativar o Premium.");
      return;
    }
    setIsLoading(true);
    try {
      // When purchasing, we set is_premium=true and clear any pending trial end date
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true, trial_ends_at: null })
        .eq('id', user.id);

      if (error) throw error;
      setIsPremium(true);
      setTrialEndsAt(null);
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
        .update({ is_premium: false, trial_ends_at: null })
        .eq('id', user.id);

      if (error) throw error;
      setIsPremium(false);
      setTrialEndsAt(null);
    } catch (error) {
      console.error("Failed to deactivate premium in DB:", error);
      showError("Falha ao desativar Premium no servidor.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isPremium,
    isTrialActive,
    trialEndsAt,
    isLoading,
    activatePremium,
    deactivatePremium,
    startTrial,
  };
}