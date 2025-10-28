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
import { useEffect, useState } from "react";
import { getSoundEnabled, setSoundEnabled } from "@/utils/sound";

const INTERSTITIALS_KEY = 'edukids_show_interstitials';

const Settings = () => {
  const { ageGroup, setAgeGroup } = useAge();
  const { name, setName, avatarUrl, setAvatarUrl } = useProfile();
  const { clearAll } = useProgress();
  const [uiSounds, setUiSounds] = useState(true);
  const [interstitialsEnabled, setInterstitialsEnabled] = useState(true);

  useEffect(() => {
    setUiSounds(getSoundEnabled());
    try {
      const raw = localStorage.getItem(INTERSTITIALS_KEY);
      if (raw === null) {
        setInterstitialsEnabled(true); // default: enabled
      } else {
        setInterstitialsEnabled(raw === 'true');
      }
    } catch (e) {
      setInterstitialsEnabled(true);
    }
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
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Salvar Alterações</Button>
      </div>
    </div>
  );
};

export default Settings;