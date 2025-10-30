import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, Zap, TrendingUp, CheckCircle, BookOpen, Gauge, Heart } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { allCourses } from "@/data/coursesData";
import { subjectsData } from "@/data/activitiesData";
import { useMemo } from "react";
import { useProgress } from "@/hooks/use-progress";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useAge } from "@/context/AgeContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AGE_GROUPS = ['4-6', '7-9', '10-12'] as const;

const Dashboard = () => {
  const { progress } = useProgress();
  const { todayUsage, limitMinutes, setLimitMinutes, blockEnabled, setBlockEnabled, resetToday, addMinutes, isBlocked } = useScreenTime();
  const { ageGroup } = useAge();

  const stats = useMemo(() => {
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

  const completedLessons = useMemo(() => Object.keys(progress).length, [progress]);

  const favoriteSubject = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(progress).forEach(k => {
      const subject = k.split("::")[0] || "outros";
      counts[subject] = (counts[subject] || 0) + 1;
    });
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!best) return null;
    const subject = subjectsData.find(s => s.slug === best[0]);
    return subject ? { name: subject.name, slug: subject.slug, count: best[1] } : { name: best[0], slug: best[0], count: best[1] };
  }, [progress]);

  const nextLessons = useMemo(() => {
    if (!ageGroup) return [];
    const items: Array<{ title: string; url: string }> = [];
    subjectsData.forEach(s => {
      s.activities
        .filter(a => a.ageGroups.includes(ageGroup))
        .forEach(a => {
          a.modules.forEach(m => {
            for (const l of m.lessons) {
              const key = `${s.slug}::${a.id}::${m.id}::${l.id}`;
              if (!progress[key]) {
                items.push({
                  title: `${s.name}: ${l.title}`,
                  url: `/activities/${s.slug}/${a.id}/modules/${m.id}/lessons/${l.id}`,
                });
                break; // uma por módulo
              }
            }
          });
        });
    });
    return items.slice(0, 6);
  }, [progress, ageGroup]);

  const usagePct = useMemo(() => {
    if (!limitMinutes) return null;
    const val = Math.min(100, Math.round((todayUsage / limitMinutes) * 100));
    return isNaN(val) ? 0 : val;
  }, [todayUsage, limitMinutes]);

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
            <div className="text-3xl font-bold">{todayUsage} min</div>
            {limitMinutes ? (
              <p className={`text-xs ${isBlocked ? 'text-red-400' : 'text-green-400'}`}>
                {isBlocked ? "Limite atingido (bloqueio ativo)" : `Dentro do limite de ${limitMinutes} min`}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Sem limite configurado</p>
            )}
            {usagePct !== null && (
              <div className="mt-3 w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${usagePct}%` }} />
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => addMinutes(5)}>+5 min</Button>
              <Button size="sm" variant="secondary" onClick={() => resetToday()}>Zerar dia</Button>
            </div>
          </CardContent>
        </TiltCard>

        <TiltCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lições Concluídas</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{completedLessons}</div>
            <p className="text-xs text-muted-foreground">Total de lições marcadas como concluídas</p>
          </CardContent>
        </TiltCard>

        <TiltCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matéria Favorita</CardTitle>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {favoriteSubject ? (
              <>
                <div className="text-3xl font-bold">{favoriteSubject.name}</div>
                <p className="text-xs text-muted-foreground">{favoriteSubject.count} lições concluídas nessa matéria</p>
                <div className="mt-3">
                  <Button asChild size="sm" variant="link" className="p-0">
                    <Link to={`/activities/${favoriteSubject.slug}`}>Ver atividades de {favoriteSubject.name} →</Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Conclua algumas lições para ver um destaque aqui.</p>
            )}
          </CardContent>
        </TiltCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <TiltCard>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Configurações de Tempo de Tela</CardTitle>
            <Gauge className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Defina um limite diário e ative o bloqueio automático quando o limite for atingido.
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm">Limite diário (min):</span>
              <input
                type="number"
                className="w-28 p-2 rounded-md bg-secondary/40 border border-white/10"
                value={limitMinutes ?? ''}
                placeholder="Sem limite"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') { setLimitMinutes(null); return; }
                  const n = Math.max(1, Math.min(600, Number(v)));
                  setLimitMinutes(Number.isNaN(n) ? null : n);
                }}
              />
              <Button size="sm" variant={blockEnabled ? "default" : "secondary"} onClick={() => setBlockEnabled(!blockEnabled)}>
                {blockEnabled ? "Bloqueio Ativo" : "Bloqueio Desativado"}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Quando o bloqueio estiver ativo e o limite for atingido, as atividades podem ser restringidas pelo app.
            </div>
          </CardContent>
        </TiltCard>

        <TiltCard>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Próximas Recomendações</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {nextLessons.length > 0 ? nextLessons.map((n) => (
              <Link key={n.url} to={n.url} className="block p-3 rounded-md bg-secondary/40 hover:bg-secondary/60 transition">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{n.title}</div>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
              </Link>
            )) : (
              <p className="text-muted-foreground">Selecione a faixa etária nas configurações e conclua lições para receber sugestões.</p>
            )}
          </CardContent>
        </TiltCard>
      </div>

      <div className="mt-8">
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
            <div className="text-xs text-muted-foreground">Dica: mantenha um bom mix de cursos gratuitos para atração e cursos premium exclusivos e profundos para conversão.</div>
          </CardContent>
        </TiltCard>
      </div>
    </div>
  );
};

export default Dashboard;