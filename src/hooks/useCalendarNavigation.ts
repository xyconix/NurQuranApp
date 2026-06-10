import { useState, useCallback } from "react";

export const useCalendarNavigation = () => {
  const defaultYear = new Date().getFullYear();
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  const goToPreviousYear = useCallback(() => {
    setSelectedYear(prev => prev - 1);
    setSelectedMonth(0);
  }, []);

  const goToNextYear = useCallback(() => {
    setSelectedYear(prev => prev + 1);
    setSelectedMonth(0);
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth(prev => prev < 11 ? prev + 1 : prev);
  }, []);

  const goToMonth = useCallback((month: number) => {
    if (month >= 0 && month <= 11) {
      setSelectedMonth(month);
    }
  }, []);

  return {
    selectedYear,
    selectedMonth,
    goToPreviousYear,
    goToNextYear,
    goToPreviousMonth,
    goToNextMonth,
    goToMonth,
  };
};