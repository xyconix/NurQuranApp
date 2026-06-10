import { useState, useEffect } from "react";
import { CalendarDay } from "../types/quran.types";
import { fetchCalendarMonth } from "../utils/calendarHelpers";

export const useFastingCalendar = (year: number) => {
  const [calendarData, setCalendarData] = useState<Record<number, CalendarDay[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalendar();
  }, [year]);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const allMonths: Record<number, CalendarDay[]> = {};

      const promises = Array.from({ length: 12 }, async (_, monthIndex) => {
        try {
          const days = await fetchCalendarMonth(monthIndex, year);
          allMonths[monthIndex] = days;
        } catch (err) {
          console.error(`Error fetching month ${monthIndex + 1}:`, err);
        }
      });

      await Promise.all(promises);
      setCalendarData(allMonths);
    } catch (error) {
      setError("Failed to load calendar data");
      console.error("Error fetching calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCalendar();
  };

  return {
    calendarData,
    loading,
    error,
    refetch,
  };
};