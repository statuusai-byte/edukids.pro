import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabase } from '@/context/SupabaseContext';
import { supabase } from '@/integrations/supabase/client';
import { showError } from '@/utils/toast';

const PREMIUM_STATUS_KEY = 'edukids_premium_status';
const TRIAL_ENDS_KEY = 'edukids_trial_ends_at';

export function usePremiumStatus() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const [isPremium, setIsPremium] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncWithProfile = useCallback(async () => {
    if (!user) {
      setIsPremium(false);
      setTrialEndsAt(null);
      localStorage.removeItem(PREMIUM_STATUS_KEY);
      localStorage.removeItem(TRIAL_ENDS_KEY);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_premium, trial_ends_at')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const premiumStatus = data?.is_premium ?? false;
      const trialEnd = data?.trial_ends_at ?? null;

      setIsPremium(premiumStatus);
      setTrialEndsAt(trialEnd);
      localStorage.setItem(PREMIUM_STATUS_KEY, String(premiumStatus));
      if (trialEnd) {
        localStorage.setItem(TRIAL_ENDS_KEY, trialEnd);
      } else {
        localStorage.removeItem(TRIAL_ENDS_KEY);
      }
    } catch (e) {
      console.error("Failed to sync premium status:", e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    try {
      const localPremium = localStorage.getItem(PREMIUM_STATUS_KEY) === 'true';
      const localTrial = localStorage.getItem(TRIAL_ENDS_KEY);
      setIsPremium(localPremium);
      setTrialEndsAt(localTrial);
    } catch {}

    if (!isAuthLoading) {
      syncWithProfile();
    }
  }, [user, isAuthLoading, syncWithProfile]);

  const isTrialActive = useMemo(() => {
    if (!trialEndsAt) return false;
    return new Date(trialEndsAt) > new Date();
  }, [trialEndsAt]);

  const startTrial = useCallback(async () => {
    if (!user) return false;
    const ends = new Date();
    ends.setDate(ends.getDate() + 7);
    const { error } = await supabase
      .from('profiles')
      .update({ trial_ends_at: ends.toISOString(), is_premium: true }) // Also set is_premium for trial
      .eq('id', user.id);
    
    if (error) {
      showError("Falha ao iniciar o período de teste.");
      return false;
    }
    await syncWithProfile();
    return true;
  }, [user, syncWithProfile]);

  const activatePremiumSecurely = useCallback(async (userId: string, secureToken: string) => {
    try {
      const { error } = await supabase.functions.invoke('activate-premium', {
        method: 'POST',
        body: { user_id: userId, token: secureToken },
      });
      if (error) throw error;
      await syncWithProfile();
      return true;
    } catch (e: any) {
      console.error("Failed to activate premium:", e);
      return false;
    }
  }, [syncWithProfile]);

  const deactivatePremium = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: false, trial_ends_at: null })
      .eq('id', user.id);
    if (error) {
      showError("Falha ao desativar o premium.");
    }
    await syncWithProfile();
  }, [user, syncWithProfile]);

  return {
    isPremium: isPremium || isTrialActive,
    isTrialActive,
    trialEndsAt,
    isLoading,
    activatePremiumSecurely,
    deactivatePremium,
    startTrial,
  };
}