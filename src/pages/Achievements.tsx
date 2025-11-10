import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabase } from '@/context/SupabaseContext';
import { achievements } from '@/data/achievementsData';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/utils';
import { readLocal } from '@/utils/achievements';
import { Skeleton } from '@/components/ui/skeleton';

const AchievementsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="glass-card">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Skeleton className="h-14 w-14 rounded-lg" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardHeader>
      </Card>
    ))}
  </div>
);

const AchievementsPage = () => {
  const { user } = useSupabase();
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true); // Apenas para o carregamento inicial do localStorage
  const userId = user?.id;

  // Efeito para carregar dados locais imediatamente
  useEffect(() => {
    const localSet = readLocal();
    setUnlockedIds(localSet);
    setLoading(false);
  }, []);

  // Efeito para sincronizar com o Supabase em segundo plano
  useEffect(() => {
    const syncWithSupabase = async () => {
      if (!userId) {
        return; // Não está logado, não há o que sincronizar
      }

      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching achievements:', error);
      } else {
        // Mescla os dados remotos com os dados já exibidos
        const remoteSet = new Set((data ?? []).map((a: any) => a.achievement_id));
        setUnlockedIds(prevIds => {
          const union = new Set<string>([...Array.from(prevIds), ...Array.from(remoteSet)]);
          return union;
        });
      }
    };

    syncWithSupabase();
  }, [userId]);

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Medalhas e Conquistas</h1>
      {loading ? (
        <AchievementsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => {
            const isUnlocked = unlockedIds.has(ach.id);

            return (
              <Card key={ach.id} className={cn("glass-card transition-all", isUnlocked ? "border-yellow-400/50" : "opacity-60")}>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className={cn("p-3 rounded-lg", isUnlocked ? "bg-yellow-400/20" : "bg-secondary")}>
                    <Icon name={ach.icon} className={cn("h-8 w-8", isUnlocked ? "text-yellow-400" : "text-muted-foreground")} />
                  </div>
                  <div>
                    <CardTitle className={cn(isUnlocked ? "text-yellow-300" : "")}>{ach.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{ach.description}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;