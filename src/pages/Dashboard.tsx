import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Zap, TrendingUp } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { allCourses } from "@/data/coursesData";
import { useMemo } from "react";

const AGE_GROUPS = ['4-6', '7-9', '10-12'] as const;

const Dashboard = () => {
  const stats = useMemo(() => {
    // For each age group, compute counts
    return AGE_GROUPS.map((group) => {
      const courses = allCourses.filter(c => c.ageGroups.includes(group));
      const total = courses.length;
      const premium = courses.filter(c => c.premium).length;
      const free = total - premium;
      const recommended = courses.filter(c => c.recommended).length;
      const premiumPct = total === 0 ? 0 : Math.round((premium / total) * 100);
      return { group, total, premium, free, premiumPct, recommended };
    });
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Painel dos Pais</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TiltCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tempo de Uso Hoje</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1h 45m</div>
            <p className="text-xs text-green-400">+10% que ontem</p>
          </CardContent>
        </TiltCard>
        <TiltCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Atividades Concluídas</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+12</div>
            <p className="text-xs text-green-400">+5 na última hora</p>
          </CardContent>
        </TiltCard>
        <TiltCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matéria Favorita</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Matemática</div>
            <p className="text-xs text-muted-foreground">70% do tempo de hoje</p>
          </CardContent>
        </TiltCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <TiltCard>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Progresso Semanal</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-secondary/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Gráfico de progresso em breve.</p>
            </div>
          </CardContent>
        </TiltCard>

        <TiltCard>
          <CardHeader>
            <CardTitle>Balanceamento Free vs Premium por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.map(s => (
              <div key={s.group} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Faixa {s.group}</div>
                  <div className="text-sm text-muted-foreground">{s.total} cursos • {s.recommended} recomendados</div>
                </div>

                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-pink-600 to-purple-600"
                    style={{ width: `${s.premiumPct}%` }}
                    role="progressbar"
                    aria-valuenow={s.premiumPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>Free: {s.free}</div>
                  <div>Premium: {s.premium} ({s.premiumPct}%)</div>
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">Sugestão: manter um bom mix de cursos gratuitos para atração e cursos premium exclusivos e profundos para conversão.</div>
          </CardContent>
        </TiltCard>
      </div>
    </div>
  );
};

export default Dashboard;