
import { useState, useEffect, useCallback } from 'react';
import { FitnessPlan, StoredPlan } from '../types';

const STORAGE_KEY = 'skyFitnessPlan';

export const useFitnessPlan = () => {
  const [storedPlan, setStoredPlan] = useState<StoredPlan | null>(null);
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsedItem: StoredPlan = JSON.parse(item);
        setStoredPlan(parsedItem);
        
        const startDate = new Date(parsedItem.startDate);
        const today = new Date();
        // Set time to 00:00:00 to compare dates only
        startDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setCurrentDay(diffDays + 1);
      }
    } catch (error) {
      console.error("Failed to parse fitness plan from localStorage", error);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const savePlan = useCallback((plan: FitnessPlan) => {
    const newStoredPlan: StoredPlan = {
      plan,
      startDate: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newStoredPlan));
      setStoredPlan(newStoredPlan);
      setCurrentDay(1);
    } catch (error) {
      console.error("Failed to save fitness plan to localStorage", error);
    }
  }, []);

  const clearPlan = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setStoredPlan(null);
      setCurrentDay(1);
    } catch (error) {
      console.error("Failed to clear fitness plan from localStorage", error);
    }
  }, []);

  return { storedPlan, currentDay, savePlan, clearPlan };
};
