import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAge } from "@/context/AgeContext";
import { Trash2 } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { AvatarUploader } from "@/components/AvatarUploader";
import { useProgress } from "@/hooks/use-progress";
import { showSuccess } from "@/utils/toast";
import { useEffect, useState, useRef } from "react";
import { getSoundEnabled, setSoundEnabled } from "@/utils/sound";
import ParentalPinModal from "@/components/ParentalPinModal";
import {
  hasParentPin,
  requirePinForPurchasesGet,
  requirePinForPurchasesSet,
  removeParentPin,
} from "@/utils/parental";
import { useSupabase } from "@/context/SupabaseContext";
import { showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import { useScreenTime } from "@/hooks/use-screen-time";

const INTERSTITIALS_KEY = 'edukids_show_interstitials';

const Settings = () => {
  const { ageGroup, setAgeGroup } = useAge();
  const { name, setName, avatarUrl, setAvatarUrl } = useProfile();
  const { clearAll } = useProgress();
  const [uiSounds, setUiSounds] = useState(true);
  const [interstitialsEnabled, setInterstitialsEnabled] = useState(true);

  // Parental PIN UI state
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"set" | "verify" | "remove">("set");
  const [requirePinForPurchases, setRequirePinForPurchases] = useState<boolean>(false);
  const [parentPinExists, setParentPinExists] = useState<boolean>(false);
  const pendingActionRef = useRef<null | "deleteAccount">(null);

  const { signOut } = useSupabase();
  const navigate = useNavigate();

  // Screen time hook
  const {
    limitMinutes,
    setLimitMinutes,
    blockEnabled,
    setBlockEnabled,
    todayUsage,
    resetToday,
  } = useScreenTime();

  useEffect(() => {
    setUiSounds(getSoundEnabled());
    try {
      const raw = localStorage.getItem(INTERSTITIALS_KEY);
      if (raw === null) {
        setInterstitialsEnabled(true);
      } else {
        setInterstitialsEnabled(raw === 'true');
      }
    } catch (e) {
      setInterstitialsEnabled(true);
    }

    setParentPinExists(hasParentPin());
    setRequirePinForPurchases(requirePinForPurchasesGet());
  }, []);

  useEffect(() => {
    // keep local state of parent pin existence in sync if user changes it via modal
    setParentPinExists(hasParentPin());
  }, [pinModalOpen]);

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResetProgress = () => {
    if (window.confirm("Tem certeza que deseja resetar todo o progresso de lições e atividades? Esta ação é irreversível.")) {
      clearAll();
      showSuccess("Progresso resetado com sucesso! Comece a contar de novo.");
    }
  };

  const handleToggleSounds = (enabled: boolean) => {
    setUiSounds(enabled);
    setSoundEnabled(enabled);
    showSuccess(enabled ? "Sons da interface ativados." : "Sons da interface desativados.");
  };

  const handleToggleInterstitials = (enabled: boolean) => {
    try {
      localStorage.setItem(INTERSTITIALS_KEY, String(enabled));
      setInterstitialsEnabled(enabled);
      showSuccess(enabled ? "Anúncios intersticiais ativados." : "Anúncios intersticiais desativados.");
    } catch (e) {
      console.error("Failed to save interstitial preference", e);
    }
  };

  const openSetPin = () => {
    setPinMode("set");
    setPinModalOpen(true);
  };

  const openRemovePin = () => {
    setPinMode("remove");
    setPinModalOpen(true);
  };

  const handleRequirePinChange = (value: boolean) => {
    setRequirePinForPurchases(value);
    requirePinForPurchasesSet(value);
    showSuccess(value ? "PIN será exigido para compras." : "PIN não será exigido para compras.");
  };

  const handleDeleteAccountConfirmed = async () => {
    // Remove local data and sign out. For remote deletion, admin action is required (not performed here).
    try {
      // Clear relevant localStorage keys
      const keysToRemove = [
        "edukids_profile",
        "edukids_progress_v1",
        "edukids_is_premium",
        "edukids_help_packages",
        "edukids_parent_pin_hash",
        "edukids_show_interstitials",
        "ad_counter",
        "edukids_screen_time_limit_minutes",
        "edukids_screen_time_block_enabled",
        "edukids_screen_time_today_minutes",
        "edukids_screen_time_last_day",
        "edukids_age_group",
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.error("Failed to clear local data:", e);
    }

    try {
      await signOut();
    } catch (e) {
      // signOut already shows errors via context; still report to user
      showError("Erro ao encerrar sessão. Os dados locais foram removidos.");
      return;
    }

    showSuccess("Conta (local) excluída e sessão encerrada. Para remover permanentemente a conta no servidor, contate o suporte.");
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    // If PIN exists, require verification before deletion
    if (hasParentPin()) {
      pendingActionRef.current = "deleteAccount";
      setPinMode("verify");
      setPinModalOpen(true);
      return;
    }

    if (window.confirm("Deseja realmente excluir a conta local e encerrar a sessão? Isso removerá dados locais do aplicativo.")) {
      await handleDeleteAccountConfirmed();
    }
  };

  const onPinVerified = () => {
    // Called after successful PIN verification inside modal.
    setParentPinExists(hasParentPin());
    if (pendingActionRef.current === "deleteAccount") {
      pendingActionRef.current = null;
      if (window.confirm("Confirme: excluir a conta local e encerrar a sessão?")) {
        handleDeleteAccountConfirmed();
      }
    }
  };

  const onPinRemoved = () => {
    // update UI state
    setParentPinExists(false);
    setRequirePinForPurchases(false);
    requirePinForPurchasesSet(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-8">Configurações</h1>
      <div className="grid gap-8 max-w-2xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Perfil da Criança</CardTitle>
            <CardDescription>Atualize as informações e preferências.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <AvatarUploader
                src={avatarUrl}
                fallback={name.charAt(0).toUpperCase()}
                onImageSelect={handleAvatarChange}
              />
              <div className="space-y-2 flex-grow">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/60 border-white/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Faixa Etária</Label>
              <RadioGroup
                value={ageGroup ?? ""}
                onValueChange={(value) => setAgeGroup(value as '4-6' | '7-9' | '10-12')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4-6" id="r1" />
                  <Label htmlFor="r1">4-6 anos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7-9" id="r2" />
                  <Label htmlFor="r2">7-9 anos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-12" id="r3" />
                  <Label htmlFor="r3">10-12 anos</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Gerenciamento de Dados</CardTitle>
            <CardDescription>Opções avançadas de dados e progresso.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress-reports">Relatórios de progresso por e-mail</Label>
              <Switch id="progress-reports" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="in-app-notifications">Notificações no aplicativo</Label>
              <Switch id="in-app-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ui-sounds">Sons da interface</Label>
              <Switch id="ui-sounds" checked={uiSounds} onCheckedChange={handleToggleSounds} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="interstitial-ads">Anúncios Intersticiais (tela cheia)</Label>
              <Switch id="interstitial-ads" checked={interstitialsEnabled} onCheckedChange={handleToggleInterstitials} />
            </div>

            <div className="pt-4 border-t border-white/10">
              <Button 
                variant="destructive" 
                onClick={handleResetProgress}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Resetar Todo o Progresso
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Isso apagará todas as lições marcadas como concluídas.</p>
            </div>
          </CardContent>
        </Card>

        {/* Parental Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Controle Parental</CardTitle>
            <CardDescription>Proteja compras e ações sensíveis com um PIN parental (armazenado localmente como hash SHA-256).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">PIN Parental</div>
                <div className="text-xs text-muted-foreground">{parentPinExists ? "PIN configurado" : "Nenhum PIN configurado"}</div>
              </div>
              <div className="flex items-center gap-2">
                {!parentPinExists ? (
                  <Button onClick={openSetPin}>Definir PIN</Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => { setPinMode("verify"); setPinModalOpen(true); }}>Verificar PIN</Button>
                    <Button variant="destructive" onClick={openRemovePin}>Remover PIN</Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Exigir PIN para compras</div>
                <div className="text-xs text-muted-foreground">Quando ativado, compras e checkout exigirão o PIN parental.</div>
              </div>
              <Switch checked={requirePinForPurchases} onCheckedChange={handleRequirePinChange} />
            </div>

            <div className="pt-2 text-xs text-muted-foreground">
              Observação: o PIN é salvo localmente em forma de hash; para controle mais seguro (por exemplo, multi-dispositivo),
              recomenda-se associar uma conta parental no servidor e usar verificações server-side.
            </div>
          </CardContent>
        </Card>

        {/* Screen time controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Tempo de Tela</CardTitle>
            <CardDescription>Defina limites diários e bloqueio automático quando o limite for atingido.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Limite diário (minutos)</Label>
                <div className="text-sm text-muted-foreground">{limitMinutes ?? "Não definido"}</div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={5}
                  step={5}
                  placeholder="Minutos"
                  className="w-28"
                  defaultValue={limitMinutes ?? undefined}
                  onBlur={(e) => {
                    const v = Number(e.currentTarget.value);
                    if (isNaN(v) || v <= 0) {
                      setLimitMinutes(null);
                      showSuccess("Limite removido.");
                      return;
                    }
                    setLimitMinutes(v);
                    showSuccess("Limite salvo.");
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Bloquear quando limite atingido</div>
                <div className="text-xs text-muted-foreground">Se ativado, o app pode impedir iniciar novas sessões ao atingir o limite.</div>
              </div>
              <Switch checked={blockEnabled} onCheckedChange={(v) => { setBlockEnabled(v); showSuccess(v ? "Bloqueio ativado." : "Bloqueio desativado."); }} />
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Uso hoje</div>
              <div className="font-medium">{todayUsage} min</div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => { resetToday(); showSuccess("Uso diário resetado."); }}>Resetar Hoje</Button>
            </div>
          </CardContent>
        </Card>

        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Salvar Alterações</Button>

        <div className="pt-4">
          <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" /> Deletar Conta (local)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Isso remove dados locais e encerra a sessão. Para exclusão permanente no servidor, contate o suporte.</p>
        </div>
      </div>

      <ParentalPinModal
        open={pinModalOpen}
        mode={pinMode}
        onOpenChange={(v) => setPinModalOpen(v)}
        onVerified={onPinVerified}
        title={pinMode === "set" ? "Definir PIN Parental" : pinMode === "remove" ? "Remover PIN Parental" : "Verificar PIN Parental"}
      />
    </div>
  );
};

export default Settings;