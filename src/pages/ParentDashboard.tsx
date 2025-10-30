import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

const ParentDashboard = () => {
  const { toast } = useToast();

  const handleDeleteAccount = () => {
    // In a real app, this would call a Supabase edge function to delete user data.
    // For now, it shows a confirmation.
    if (window.confirm('Você tem certeza? Esta ação é irreversível e excluirá todos os dados da conta.')) {
      toast({
        title: 'Conta Excluída',
        description: 'A funcionalidade de exclusão permanente foi simulada.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel dos Pais</h1>
      <Card className="glass-card border-destructive">
        <CardHeader>
          <CardTitle>Excluir Conta Permanentemente</CardTitle>
          <CardDescription>
            Esta ação é irreversível. Todos os dados da sua conta, incluindo progresso, perfil e compras, serão excluídos permanentemente do nosso sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
            <Trash2 className="mr-2 h-4 w-4" /> Excluir Conta Permanentemente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentDashboard;