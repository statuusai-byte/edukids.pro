import { useState, useEffect, useCallback } from 'react';
import { subjectsData } from '@/data/activitiesData';

type SubjectSlug = (typeof subjectsData)[number]['slug'];

const PACKAGE_STORAGE_KEY = 'edukids_help_packages';

export function useHelpPackages() {
  const [purchasedPackages, setPurchasedPackages] = useState<Set<SubjectSlug>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PACKAGE_STORAGE_KEY);
      if (raw) {
        setPurchasedPackages(new Set(JSON.parse(raw)));
      }
    } catch (error) {
      console.error("Failed to load packages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((packages: Set<SubjectSlug>) => {
    try {
      localStorage.setItem(PACKAGE_STORAGE_KEY, JSON.stringify(Array.from(packages)));
    } catch (error) {
      console.error("Failed to save packages:", error);
    }
  }, []);

  const purchasePackage = useCallback((subjectSlug: SubjectSlug) => {
    setPurchasedPackages(prev => {
      const next = new Set(prev).add(subjectSlug);
      persist(next);
      return next;
    });
  }, [persist]);

  const hasPackage = useCallback((subjectSlug: SubjectSlug, isPremium: boolean) => {
    // Premium users have all packages
    if (isPremium) return true;
    return purchasedPackages.has(subjectSlug);
  }, [purchasedPackages]);

  return {
    purchasedPackages,
    isLoading,
    purchasePackage,
    hasPackage,
  };
}