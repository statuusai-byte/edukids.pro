import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Perfil da Criança</CardTitle>
            <CardDescription>Atualize as informações e preferências.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" defaultValue="Alex" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input id="age" type="number" defaultValue="8" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Gerencie como você recebe as notificações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
};

export default Settings;