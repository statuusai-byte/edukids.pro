import { useParentAuth } from '@/context/ParentAuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ParentPinModal from '@/components/ParentPinModal';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Store = () => {
  const { isUnlocked } = useParentAuth();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const { toast } = useToast();

  const performPurchase = () => {
    toast({
      title: 'Compra Realizada!',
      description: 'O item foi adicionado à sua conta.',
    });
  };

  const handlePurchaseClick = () => {
    if (isUnlocked) {
      performPurchase();
    } else {
      setIsPinModalOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Loja</h1>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Item Incrível</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-4">
            <p>Desbloqueie novas aventuras e funcionalidades com este item.</p>
            <Button onClick={handlePurchaseClick}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Comprar por R$ 9,99
            </Button>
          </CardContent>
        </Card>
      </div>
      <ParentPinModal
        isOpen={isPinModalOpen}
        onOpenChange={setIsPinModalOpen}
        onSuccess={performPurchase}
      />
    </>
  );
};

export default Store;