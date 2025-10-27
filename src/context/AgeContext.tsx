import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type AgeGroup = '4-6' | '7-9' | '10-12' | null;

interface AgeContextType {
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  isLoading: boolean;
}

const AgeContext = createContext<AgeContextType | undefined>(undefined);

export const AgeProvider = ({ children }: { children: ReactNode }) => {
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAgeGroup = localStorage.getItem('edukids_age_group') as AgeGroup;
      if (storedAgeGroup) {
        setAgeGroupState(storedAgeGroup);
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAgeGroup = (newAgeGroup: AgeGroup) => {
    try {
      if (newAgeGroup) {
        localStorage.setItem('edukids_age_group', newAgeGroup);
      } else {
        localStorage.removeItem('edukids_age_group');
      }
      setAgeGroupState(newAgeGroup);
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  };

  return (
    <AgeContext.Provider value={{ ageGroup, setAgeGroup, isLoading }}>
      {children}
    </AgeContext.Provider>
  );
};

export const useAge = (): AgeContextType => {
  const context = useContext(AgeContext);
  if (context === undefined) {
    throw new Error('useAge must be used within an AgeProvider');
  }
  return context;
};