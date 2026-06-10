import { useState, useCallback } from "react";
import { HomeTab } from "../types/quran.types";

export const useActiveTab = (initialTab: HomeTab = 'Surah') => {
  const [activeTab, setActiveTab] = useState<HomeTab>(initialTab);

  const changeTab = useCallback((tab: HomeTab) => {
    setActiveTab(tab);
  }, []);

  const isSurahActive = activeTab === 'Surah';
  const isParaActive = activeTab === 'Para';

  return {
    activeTab,
    changeTab,
    isSurahActive,
    isParaActive,
  };
};