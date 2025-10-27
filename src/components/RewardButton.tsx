import { Button } from '@/components/ui/button';
import { Gift, Loader2 } from 'lucide-react';
import { useRewardedAd } from '@/hooks/useRewardedAd';
import { useState, useEffect } from 'react';
import { showSuccess } from '@/utils/toast';

interface RewardButtonProps {
  onReward: () => void;
  label: string;
}

const RewardButton = ({ onReward, label }: RewardButtonProps) => {
  const { isAdLoaded, isLoading, loadAd, showAd, rewardDetails } = useRewardedAd();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Tenta carregar o anúncio assim que o componente é montado
    loadAd();
  }, [loadAd]);

  const handleClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    
    const rewarded = await showAd();
    
    if (rewarded) {
      onReward();
      showSuccess(`Você ganhou ${rewardDetails.amount} ${rewardDetails.item}!`);
    }
    
    setIsProcessing(false);
  };

  const buttonText = isProcessing 
    ? 'Processando...' 
    : isAdLoaded 
      ? label 
      : isLoading 
        ? 'Carregando Anúncio...' 
        : 'Anúncio não carregado';

  return (
    <Button
      onClick={handleClick}
      disabled={!isAdLoaded || isProcessing}
      className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
    >
      {isProcessing || isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Gift className="mr-2 h-4 w-4" />
      )}
      {buttonText}
    </Button>
  );
};

export default RewardButton;