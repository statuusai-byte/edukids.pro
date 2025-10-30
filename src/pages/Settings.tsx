import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import ParentPinModal from '@/components/ParentPinModal';

const Settings = () => {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ajustes</h1>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Painel dos Pais</CardTitle>
            <CardDescription>
              Acesse as configurações de segurança, gerencie compras e a conta da criança. É necessário um PIN para acessar esta área.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setIsPinModalOpen(true)}>
              <Shield className="mr-2 h-4 w-4" /> Acessar Painel dos Pais
            </Button>
          </CardContent>
        </Card>
      </div>
      <ParentPinModal isOpen={isPinModalOpen} onOpenChange={setIsPinModalOpen} />
    </>
  );
};

export default Settings;