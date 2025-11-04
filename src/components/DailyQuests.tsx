import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useDailyQuests } from "@/hooks/use-daily-quests";
import { Link } from "react-router-dom";

const DailyQuests = () => {
  const { progress } = useProgress();
  const totalLessonsCompleted = Object.keys(progress).length;
  const { todayUsage } = useScreenTime();
  const { quests, completedCount, totalCount, markReviewDone } = useDailyQuests(
    totalLessonsCompleted,
    todayUsage
  );

  return (
    <Card className="glass-card">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl">Missões Diárias</CardTitle>
        <div className="text-sm text-muted-foreground">
          {completedCount} de {totalCount} concluídas
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {quests.map((q) => (
          <div key={q.id} className="rounded-xl border border-white/10 bg-secondary/60 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-semibold">{q.title}</div>
              {q.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-400" />
              ) : q.id === "q2" ? (
                <Clock className="h-5 w-5 text-yellow-300" />
              ) : (
                <RotateCcw className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="mb-3 text-sm text-muted-foreground">{q.description}</p>
            <Progress
              value={(q.progress / q.total) * 100}
              className="h-2 bg-white/10 [&>*]:bg-gradient-to-r [&>*]:from-cyan-400 [&>*]:to-fuchsia-400"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Progresso: {q.progress}/{q.total}
              </span>
              {q.actionType === "manual" && !q.completed ? (
                <Button size="sm" onClick={markReviewDone}>
                  Marcar revisão
                </Button>
              ) : !q.completed ? (
                <Button asChild size="sm" variant="secondary">
                  <Link to="/activities">Ir para Atividades</Link>
                </Button>
              ) : (
                <span className="text-xs text-green-400">Concluída</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyQuests;