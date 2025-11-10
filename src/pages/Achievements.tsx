import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/Icon';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { achievements } from '@/data/achievementsData';
import { useAchievementsContext } from '@/context/AchievementsContext';

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
  const { unlockedIds, isLoading } = useAchievementsContext();

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Medalhas e Conquistas</h1>
      {isLoading ? (
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