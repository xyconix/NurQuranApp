// hooks/useRecentSearches.ts
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@recent_searches";
const MAX_RECENT_SEARCHES = 10;

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  };

  const saveRecentSearches = async (searches: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  };

  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q !== query);
      const newSearches = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      saveRecentSearches(newSearches);
      return newSearches;
    });
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => {
      const newSearches = prev.filter((q) => q !== query);
      saveRecentSearches(newSearches);
      return newSearches;
    });
  }, []);

  const clearAllRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  };
};