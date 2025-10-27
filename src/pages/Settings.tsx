import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAge } from "@/context/AgeContext";
import { useTheme } from "@/context/ThemeContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/context/ProfileContext";
import { AvatarUploader } from "@/components/AvatarUploader";

const themes = [
  { id: 'nebula', name: 'Nébula', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'cosmos', name: 'Cosmos', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'selva', name: 'Selva', gradient: 'from-lime-400 to-green-600' },
  { id: 'oceano', name: 'Oceano', gradient: 'from-cyan-400 to-teal-500' },
] as const;

const Settings = () => {
  const { ageGroup, setAgeGroup } = useAge();
  const { theme, setTheme } = useTheme();
  const { name, setName, avatarUrl, setAvatarUrl } = useProfile();

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
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
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize o visual do aplicativo.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {themes.map((t) => (
              <div key={t.id} className="text-center">
                <button
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "w-full h-20 rounded-lg bg-gradient-to-br relative flex items-center justify-center transition-all",
                    t.gradient,
                    theme === t.id && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                  )}
                >
                  {theme === t.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                  )}
                </button>
                <p className="mt-2 text-sm font-medium">{t.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie como você recebe as notificações.</CardDescription>
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
          </CardContent>
        </Card>
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30">Salvar Alterações</Button>
      </div>
    </div>
  );
};

export default Settings;