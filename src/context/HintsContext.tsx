import { createContext, useContext, ReactNode } from 'react';
import { useHints } from '@/hooks/useHints';

interface HintsContextType {
  hints: number;
  isLoading: boolean;
  addHints: (amount: number) => void;
  useHint: () => boolean;
}

const HintsContext = createContext<HintsContextType | undefined>(undefined);

export const HintsProvider = ({ children }: { children: ReactNode }) => {
  const hintSystem = useHints();

  return (
    <HintsContext.Provider value={hintSystem}>
      {children}
    </HintsContext.Provider>
  );
};

export const useHintsContext = (): HintsContextType => {
  const context = useContext(HintsContext);
  if (context === undefined) {
    throw new Error('useHintsContext must be used within a HintsProvider');
  }
  return context;
};