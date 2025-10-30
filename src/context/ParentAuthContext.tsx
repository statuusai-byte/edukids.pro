import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ParentAuthContextType {
  isUnlocked: boolean;
  unlock: () => void;
  lock: () => void;
}

const ParentAuthContext = createContext<ParentAuthContextType | undefined>(undefined);

export const ParentAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlock = useCallback(() => {
    setIsUnlocked(true);
    // Lock again after 10 minutes of inactivity (optional)
    // setTimeout(() => setIsUnlocked(false), 10 * 60 * 1000);
  }, []);

  const lock = useCallback(() => {
    setIsUnlocked(false);
  }, []);

  return (
    <ParentAuthContext.Provider value={{ isUnlocked, unlock, lock }}>
      {children}
    </ParentAuthContext.Provider>
  );
};

export const useParentAuth = () => {
  const context = useContext(ParentAuthContext);
  if (context === undefined) {
    throw new Error('useParentAuth must be used within a ParentAuthProvider');
  }
  return context;
};