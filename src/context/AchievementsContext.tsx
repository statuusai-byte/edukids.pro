import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSupabase } from './SupabaseContext';
import { readLocal, computeAchievements, persistAchievements } from '@/utils/achievements';
import { supabase } from '@/integrations/supabase/client';
import { achievements as allAchievementsData } from '@/data/achievementsData';
import { toast } from 'sonner';
import type { ProgressMap } from '@/hooks/use-progress';

interface AchievementsContextType {
  unlockedIds: Set<string>;
  isLoading: boolean;
  refreshAchievements: () => Promise<void>;
  checkForNewAchievements: (progress: ProgressMap) => Promise<void>;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

export const AchievementsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useSupabase();
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetAchievements = useCallback(async () => {
    setIsLoading(true);
    
    const localAchievements = readLocal();
    let finalAchievements = new Set(localAchievements);

    if (user) {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Failed to fetch remote achievements:', error);
      } else {
        const remoteAchievements = new Set((data ?? []).map((a: any) => a.achievement_id));
        finalAchievements = new Set([...Array.from(localAchievements), ...Array.from(remoteAchievements)]);
      }
    }
    
    setUnlockedIds(finalAchievements);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAndSetAchievements();
  }, [fetchAndSetAchievements]);

  const checkForNewAchievements = useCallback(async (progress: ProgressMap) => {
    const previouslyUnlocked = unlockedIds;
    const allCurrentlyEarned = computeAchievements(progress);

    const newlyUnlockedIds = [...allCurrentlyEarned].filter(id => !previouslyUnlocked.has(id));

    if (newlyUnlockedIds.length > 0) {
      newlyUnlockedIds.forEach(id => {
        const achievement = allAchievementsData.find(a => a.id === id);
        if (achievement) {
          toast.success(`🏅 Medalha Desbloqueada: ${achievement.title}`);
        }
      });

      await persistAchievements(user?.id, allCurrentlyEarned);
      setUnlockedIds(allCurrentlyEarned);
    }
  }, [unlockedIds, user]);

  return (
    <AchievementsContext.Provider value={{ unlockedIds, isLoading, refreshAchievements: fetchAndSetAchievements, checkForNewAchievements }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievementsContext = (): AchievementsContextType => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievementsContext must be used within an AchievementsProvider');
  }
  return context;
};