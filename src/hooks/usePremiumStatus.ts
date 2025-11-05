import { useState, useEffect, useCallback } from 'react';

const PREMIUM_STORAGE_KEY = 'edukids_is_premium';

// Helper to read from storage safely
const getStoredPremiumStatus = (): boolean => {
  try {
    return localStorage.getItem(PREMIUM_STORAGE_KEY) === 'true';
  } catch (error) {
    console.error("Failed to read premium status from localStorage:", error);
    return false;
  }
};

export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(getStoredPremiumStatus);
  const [isLoading, setIsLoading] = useState(true); // Keep loading state for initial check

  // Effect for initial load and setting up listener
  useEffect(() => {
    // Initial status is already set by useState, so we just need to turn off loading
    setIsLoading(false);

    // Function to handle storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === PREMIUM_STORAGE_KEY) {
        setIsPremium(getStoredPremiumStatus());
      }
    };

    // Add event listener for changes in other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // These functions will now trigger updates for any component using the hook
  const activatePremium = useCallback(() => {
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'true');
      setIsPremium(true);
      // Manually dispatch a storage event so the current window also reacts
      window.dispatchEvent(new StorageEvent('storage', { key: PREMIUM_STORAGE_KEY }));
    } catch (error) {
      console.error("Failed to save premium status:", error);
    }
  }, []);

  const deactivatePremium = useCallback(() => {
    try {
      localStorage.setItem(PREMIUM_STORAGE_KEY, 'false');
      setIsPremium(false);
      window.dispatchEvent(new StorageEvent('storage', { key: PREMIUM_STORAGE_KEY }));
    } catch (error) {
      console.error("Failed to save premium status:", error);
    }
  }, []);

  return {
    isPremium,
    isLoading,
    activatePremium,
    deactivatePremium,
  };
}