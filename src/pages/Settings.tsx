import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAge } from "@/context/AgeContext";
import { Trash2, ShieldCheck, ShieldX, Info, LogOut, Sun, Moon, Loader2 } from "lucide-react";
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
} from "@/utils/parental-helpers";
import { useSupabase } from "@/context/SupabaseContext";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/context/ThemeContext";

const Settings = () => {
  const { ageGroup, setAgeGroup } = useAge();
  const { name, setName, avatarUrl, setAvatarFile, isLoading: isProfileLoading } = useProfile();
  const { clearAll } = useProgress();
  const { theme, setTheme } = useTheme();
  const [uiSounds, setUiSounds] = useState(true);

  const [currentName, setCurrentName] = useState(name);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinMode, setPinMode] = useState<"set" | "verify" | "remove">("set");
  const [requirePinForPurchases, setRequirePinForPurchases] = useState<boolean>(false);
  const [parentPinExists, setParentPinExists] = useState<boolean>(false);
  const [isCheckingPinStatus, setIsCheckingPinStatus] = useState(true);

  const pendingActionRef = useRef<null | (() => void)>(null);
  const { signOut, user } = useSupabase();

  const checkPinStatus = useCallback(async () => {
    setIsCheckingPinStatus(true);
    const exists = await hasParentPin();
    setParentPinExists(exists);
    setIsCheckingPinStatus(false);
  }, []);

  useEffect(() => {
    setCurrentName(name);
  }, [name]);

  useEffect(() => {
    setUiSounds(getSoundEnabled());
    setRequirePinForPurchases(requirePinForPurchasesGet());
    checkPinStatus();
  }, [checkPinStatus]);

  const handleAvatarChange = async (file: File) => {
    const toastId = showLoading("Enviando novo avatar...");
    try {
      await setAvatarFile(file);
      dismissToast(toastId);
      showSuccess("Avatar atualizado com sucesso!");
    } catch (error) {
      dismissToast(toastId);
      console.error(error);
    }
  };

  const handleNameBlur = async () => {
    if (currentName.trim() === name || currentName.trim() === "") return;
    const toastId = showLoading("Salvando nome...");
    try {
      await setName(currentName);
      dismissToast(toastId);
      showSuccess("Nome atualizado!");
    } catch (error) {
      dismissToast(toastId);
      setCurrentName(name);
    }
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

  const openSetPin = () => {
    setPinMode("set");
    setPinModalOpen(true);
  };

  const openRemovePin = () => {
    setPinMode("remove");
    setPinModalOpen(true);
  };

  const requirePinChanged = (enabled: boolean) => {
    if (enabled && !parentPinExists) {
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
    if (parentPinExists) {
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
      // Re-check pin status after modal closes (in case set/remove was successful)
      checkPinStatus();
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
    <div>
      <h1 className="text-4xl font-bold tracking-tighter mb-4">Configurações</h1>
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
        <Info className="h-4 w-4" />
        As alterações são salvas automaticamente.
      </div>
      <div className="grid gap-8 max-w-2xl">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Perfil da Criança</CardTitle>
            <CardDescription>Atualize as informações e preferências.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <AvatarUploader
                src={avatarUrl ?? null}
                fallback={(name?.charAt(0) ?? "?").toUpperCase()}
                onImageSelect={handleAvatarChange}
              />
              <div className="space-y-2 flex-grow">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  onBlur={handleNameBlur}
                  disabled={isProfileLoading}
                  className="bg-secondary/60 border-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email da conta</Label>
              <Input
                value={user?.email ?? "Conta local (sem login)"}
                disabled
                className="bg-secondary/60 border-white/20 text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Este é o e-mail usado para entrar no EDUKIDS+. Para alterá-lo, utilize o painel do responsável ou entre em contato com o suporte.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Faixa Etária</Label>
              <RadioGroup
                value={ageGroup ?? ""}
                onValueChange={(value) => setAgeGroup(value as "4-6" | "7-9" | "10-12")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4-6" id="age-4-6" />
                  <Label htmlFor="age-4-6">4-6 anos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7-9" id="age-7-9" />
                  <Label htmlFor="age-7-9">7-9 anos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10-12" id="age-10-12" />
                  <Label htmlFor="age-10-12">10-12 anos</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Preferências do Aplicativo</CardTitle>
            <CardDescription>Opções de tema, notificações, sons e dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-switcher" className="flex items-center gap-2">
                <Sun className="h-5 w-5" /> Tema do Aplicativo <Moon className="h-5 w-5" />
              </Label>
              <Switch
                id="theme-switcher"
                checked={theme === 'dark'}
                onCheckedChange={(isDark) => setTheme(isDark ? 'dark' : 'light')}
              />
            </div>
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
            <div className="pt-4 border-t border-white/10">
              <Button variant="destructive" onClick={handleResetProgress} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Resetar Todo o Progresso
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Isso apagará todas as lições marcadas como concluídas.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Controle Parental
            </CardTitle>
            <CardDescription>Defina um PIN para compras e ações sensíveis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Status do PIN</div>
                <div className="text-xs text-muted-foreground">
                  {isCheckingPinStatus ? (
                    <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Verificando...</span>
                  ) : parentPinExists ? (
                    "PIN configurado no servidor."
                  ) : (
                    "Nenhum PIN definido."
                  )}
                </div>
              </div>
              {isCheckingPinStatus ? (
                <Button disabled variant="secondary"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando</Button>
              ) : parentPinExists ? (
                <Button variant="secondary" onClick={openRemovePin}>
                  <ShieldX className="mr-2 h-4 w-4" /> Remover PIN
                </Button>
              ) : (
                <Button onClick={openSetPin}>
                  <ShieldCheck className="mr-2 h-4 w-4" /> Definir PIN
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="require-pin">Exigir PIN para compras</Label>
              <Switch
                id="require-pin"
                checked={requirePinForPurchases}
                onCheckedChange={requirePinChanged}
                disabled={!parentPinExists}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Gerencie sua sessão e dados da conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={signOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
            </Button>
            <div className="pt-4 border-t border-white/10">
              <Button variant="destructive" onClick={handlePermanentDelete} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir Conta Permanentemente
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Esta ação é irreversível e apagará todos os seus dados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ParentalPinModal
        open={pinModalOpen}
        onOpenChange={afterPinModalChange}
        mode={pinMode}
        onVerified={() => {
          if (pendingActionRef.current) {
            pendingActionRef.current();
            pendingActionRef.current = null;
          }
        }}
      />
    </div>
  );
};

export default Settings;