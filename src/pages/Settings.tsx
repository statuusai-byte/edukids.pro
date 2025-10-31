import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAge } from "@/context/AgeContext";
import { Trash2, ShieldCheck, ShieldX } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { AvatarUploader } from "@/components/AvatarUploader";
import { useProgress } from "@/hooks/use-progress";
import { showSuccess, showError, showLoading, dismissToast } from "@/utils/toast";
import { getSoundEnabled, setSoundEnabled } from "@/utils/sound";
import ParentalPinModal from "@/components/ParentalPinModal";
import {
  hasParentPin,
  requirePinForPurchasesGet,
  requirePinForPurchasesSet,
} from "@/utils/parental";
import { useSupabase } from "@/context/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";
import PageTransition from "@/components/PageTransition";

const INTERSTITIALS_KEY = "edukids_show_interstitials";

const Settings = () => {
  const { ageGroup, setAgeGroup } = useAge();
  const { name, setName, avatarUrl, setAvatarUrl } = useProfile();
  const { clearAll } = useProgress();
  const [uiSounds, setUiSounds] = useState(true);
  const [interstitialsEnabled, setInterstitialsEnabled] = useState(true);

  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"set" | "verify" | "remove">("set");
  const [requirePinForPurchases, setRequirePinForPurchases] = useState<boolean>(false);
  const [parentPinExists, setParentPinExists] = useState<boolean>(false);

  const pendingActionRef = useRef<null | (() => void)>(null);
  const { signOut } = useSupabase();

  useEffect(() => {
    setUiSounds(getSoundEnabled());
    try {
      const raw = localStorage.getItem(INTERSTITIALS_KEY);
      if (raw === null) {
        setInterstitialsEnabled(true);
      } else {
        setInterstitialsEnabled(raw === "true");
      }
    } catch (e) {
      setInterstitialsEnabled(true);
    }
    setRequirePinForPurchases(requirePinForPurchasesGet());
    setParentPinExists(hasParentPin());
  }, []);

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

  const requirePinChanged = (enabled: boolean) => {
    if (enabled && !hasParentPin()) {
      showError("Defina um PIN parental antes de exigir PIN para compras.");
      setRequirePinForPurchases(false);
      requirePinForPurchasesSet(false);
      return;
    }
    setRequirePinForPurchases(enabled);
    requirePinForPurchasesSet(enabled);
    showSuccess(enabled ? "PIN exigido para compras." : "PIN não será exigido para compras.");
  };

  const onVerifyThenRun = (action: () => void) => {
    if (hasParentPin()) {
      pendingActionRef.current = action;
      setPinMode("verify");
      setPinModalOpen(true);
    } else {
      action();
    }
  };

  const afterPinModalChange = (open: boolean) => {
    setPinModalOpen(open);
    if (!open) {
      setParentPinExists(hasParentPin());
    }
  };

  const handlePermanentDelete = () => {
    const runPermanentDeletion = async () => {
      const loadingToast = showLoading("Excluindo sua conta permanentemente...");
      try {
        const { error } = await supabase.functions.invoke("delete-user");
        if (error) throw new Error(error.message);
        await signOut();
        dismissToast(loadingToast);
        showSuccess("Sua conta foi excluída permanentemente.");
      } catch (error: any) {
        dismissToast(loadingToast);
        showError(`Falha ao excluir a conta: ${error.message}`);
      }
    };

    if (!window.confirm("ATENÇÃO: Esta ação é PERMANENTE e IRREVERSÍVEL. Todos os seus dados, incluindo perfil, progresso e compras, serão excluídos para sempre. Deseja continuar?")) {
      return;
    }
    onVerifyThenRun(runPermanentDeletion);
  };

  return (
    <PageTransition>
      <div>
        <h1 className="text-4xl font-bold tracking-tighter mb-8">Configurações</h1>
        <div className="grid gap-8 max-w-2xl">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Perfil da Criança</CardTitle>
              <CardDescription>Atualize as informações e preferências.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <AvatarUploader src={avatarUrl} fallback={name.charAt(0).toUpperCase()} onImageSelect={handleAvatarChange} />
                <div className="space-y-2 flex-grow w-full">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/60 border-white/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Faixa Etária</Label>
                <RadioGroup value={ageGroup ?? ""} onValueChange={(value) => setAgeGroup(value as "4-6" | "7-9" | "10-12")} className="flex flex-wrap space-x-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="4-6" id="r1" /><Label htmlFor="r1">4-6 anos</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="7-9" id="r2" /><Label htmlFor="r2">7-9 anos</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="10-12" id="r3" /><Label htmlFor="r3">10-12 anos</Label></div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle>Gerenciamento de Dados</CardTitle><CardDescription>Opções avançadas de dados e progresso.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between"><Label htmlFor="progress-reports">Relatórios de progresso por e-mail</Label><Switch id="progress-reports" defaultChecked /></div>
              <div className="flex items-center justify-between"><Label htmlFor="in-app-notifications">Notificações no aplicativo</Label><Switch id="in-app-notifications" defaultChecked /></div>
              <div className="flex items-center justify-between"><Label htmlFor="ui-sounds">Sons da interface</Label><Switch id="ui-sounds" checked={uiSounds} onCheckedChange={handleToggleSounds} /></div>
              <div className="flex items-center justify-between"><Label htmlFor="interstitial-ads">Anúncios Intersticiais (tela cheia)</Label><Switch id="interstitial-ads" checked={interstitialsEnabled} onCheckedChange={handleToggleInterstitials} /></div>
              <div className="pt-4 border-t border-white/10"><Button variant="destructive" onClick={handleResetProgress} className="w-full"><Trash2 className="mr-2 h-4 w-4" /> Resetar Todo o Progresso</Button><p className="text-xs text-muted-foreground mt-2">Isso apagará todas as lições marcadas como concluídas.</p></div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Controle Parental</CardTitle><CardDescription>Defina um PIN para compras e ações sensíveis.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div><div className="font-medium">Status do PIN</div><div className="text-xs text-muted-foreground">{parentPinExists ? "PIN configurado neste dispositivo." : "Nenhum PIN definido."}</div></div>
                {parentPinExists ? <Button variant="secondary" onClick={openRemovePin}><ShieldX className="mr-2 h-4 w-4" /> Remover PIN</Button> : <Button onClick={openSetPin}><ShieldCheck className="mr-2 h-4 w-4" /> Definir PIN</Button>}
              </div>
              <div className="flex items-center justify-between"><Label htmlFor="require-pin">Exigir PIN para compras</Label><Switch id="require-pin" checked={requirePinForPurchases} onCheckedChange={requirePinChanged} /></div>
            </CardContent>
          </Card>

          <Card className="glass-card border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis relacionadas à sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <Label className="font-bold text-foreground">Excluir Conta Permanentemente</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta ação removerá permanentemente sua conta e todos os dados associados do nosso sistema. Esta ação não pode ser desfeita.
                  </p>
                </div>
                <Button variant="destructive" onClick={handlePermanentDelete}>
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Salvar Alterações</Button>
        </div>

        <ParentalPinModal open={pinModalOpen} mode={pinMode} onOpenChange={afterPinModalChange} onVerified={() => { const fn = pendingActionRef.current; pendingActionRef.current = null; if (fn) fn(); }} />
      </div>
    </PageTransition>
  );
};

export default Settings;