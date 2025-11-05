import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, TrendingUp, CheckCircle, Gauge, Heart, LogOut, ShieldCheck, Trophy } from "lucide-react";
import { TiltCard } from "@/components/TiltCard";
import { subjectsData } from "@/data/activitiesData";
import { useMemo, useState, useEffect } from "react";
import { useProgress } from "@/hooks/use-progress";
import { useScreenTime } from "@/hooks/use-screen-time";
import { useAge } from "@/context/AgeContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import ParentalPinModal from "@/components/ParentalPinModal";
import { hasParentPin } from "@/utils/parental";
import { useSupabase } from "@/context/SupabaseContext";

const Dashboard = () => {
  const { progress } = useProgress();
  const { todayUsage, limitMinutes, setLimitMinutes, blockEnabled, setBlockEnabled, resetToday, addMinutes, isBlocked } = useScreenTime();
  const { ageGroup } = useAge();
  const { signOut } = useSupabase();
  const navigate = useNavigate();

  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"set" | "verify" | "remove">("verify");

  useEffect(() => {
    const pinExists = hasParentPin();
    if (!pinExists) {
      setPinMode("set");
    } else {
      setPinMode("verify");
    }
    setPinModalOpen(true);
  }, []);

  const handlePinVerified = () => {
    setIsPinVerified(true);
    setPinModalOpen(false);
  };

  const handlePinModalClose = (open: boolean) => {
    setPinModalOpen(open);
  };

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
                break;
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

  // Se o PIN ainda não foi verificado, mostramos o modal e uma tela de fundo de acesso restrito.
  if (!isPinVerified) {
    return (
      <>
        <ParentalPinModal
          open={pinModalOpen}
          mode={pinMode}
          onOpenChange={handlePinModalClose}
          onVerified={handlePinVerified}
          title={pinMode === "set" ? "Definir PIN Parental para o Painel" : "Verificar PIN Parental para o Painel"}
        />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card p-6 text-center">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Acesso Restrito</h2>
            <p className="text-muted-foreground mt-2">
              Por favor, verifique o PIN parental para acessar o Painel dos Pais.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Se o PIN foi verificado, mostramos o conteúdo do painel.
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold tracking-tighter">Painel dos Pais</h1>
        <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

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
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Quadro de Medalhas</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Acompanhe as conquistas e o progresso através do novo sistema de medalhas.
            </p>
            <Button asChild className="mt-4">
              <Link to="/achievements">Ver todas as medalhas</Link>
            </Button>
          </CardContent>
        </TiltCard>
      </div>
    </div>
  );
};

export default Dashboard;