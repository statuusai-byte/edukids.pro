import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Zap, TrendingUp } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";

const Dashboard = () => {
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
      <div className="mt-8">
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
      </div>
    </div>
  );
};

export default Dashboard;