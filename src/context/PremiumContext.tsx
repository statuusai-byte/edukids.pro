import { createContext, useContext, ReactNode } from 'react';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface PremiumContextType {
  isPremium: boolean;
  isTrialActive: boolean;
  trialEndsAt: string | null;
  isLoading: boolean;
  activatePremiumSecurely: (userId: string, secureToken: string) => Promise<boolean>;
  deactivatePremium: () => Promise<void>;
  startTrial: () => Promise<boolean>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const premiumStatus = usePremiumStatus();

  return (
    <PremiumContext.Provider value={premiumStatus as unknown as PremiumContextType}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};