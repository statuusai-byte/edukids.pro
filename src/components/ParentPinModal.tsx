import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase';
import { useProfile } from '@/context/ProfileContext';
import { useParentAuth } from '@/context/ParentAuthContext';
import { useNavigate } from 'react-router-dom';
import SHA256 from 'crypto-js/sha256';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ParentPinModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const ParentPinModal: React.FC<ParentPinModalProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState<'loading' | 'create' | 'verify'>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useProfile();
  const { unlock } = useParentAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPinStatus = useCallback(async () => {
    if (!user) return;
    setMode('loading');
    const { data, error } = await supabase
      .from('parents')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: "Not a single row"
      toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível verificar o PIN.' });
    } else if (data) {
      setMode('verify');
    } else {
      setMode('create');
    }
  }, [user, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchPinStatus();
    } else {
      setPin(''); // Reset PIN on close
    }
  }, [isOpen, fetchPinStatus]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4 || !user) return;
    setIsLoading(true);

    const pinHash = SHA256(pin).toString();

    if (mode === 'create') {
      const { error } = await supabase.from('parents').insert({ user_id: user.id, pin_hash: pinHash });
      if (error) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível criar o PIN.' });
      } else {
        toast({ title: 'Sucesso!', description: 'Seu PIN foi criado.' });
        unlock();
        onOpenChange(false);
        onSuccess ? onSuccess() : navigate('/parents');
      }
    } else if (mode === 'verify') {
      const { data, error } = await supabase.from('parents').select('pin_hash').eq('user_id', user.id).single();
      if (error || !data) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Não foi possível verificar o PIN.' });
      } else if (data.pin_hash === pinHash) {
        toast({ title: 'Sucesso!', description: 'PIN correto.' });
        unlock();
        onOpenChange(false);
        onSuccess ? onSuccess() : navigate('/parents');
      } else {
        toast({ variant: 'destructive', title: 'Erro', description: 'PIN incorreto. Tente novamente.' });
      }
    }
    setIsLoading(false);
    setPin('');
  };

  const title = mode === 'create' ? 'Crie um PIN de 4 dígitos' : 'Digite seu PIN de 4 dígitos';
  const description = mode === 'create'
    ? 'Este PIN será usado para acessar o Painel dos Pais e autorizar compras.'
    : 'É necessário o PIN para continuar.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={handlePinChange}
              maxLength={4}
              className="text-center text-2xl tracking-[1em]"
              placeholder="••••"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pin.length !== 4 || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ParentPinModal;