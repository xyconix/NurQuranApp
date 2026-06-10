import { useState, useCallback } from "react";
import { useAppStore } from "../store/useAppStore";
import { usePrayerLocation } from "./usePrayerLocation";
import { API_CONFIG } from "../constants/prayer.constants";
import { PrayerTimesResponse, PrayerTimings } from "../types/quran.types";

export const usePrayerTimes = () => {
  const { setPrayerData, setLocation } = useAppStore();
  const { getCurrentLocation } = usePrayerLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const locationData = await getCurrentLocation();
      if (!locationData) {
        setPrayerData(null, "Location Access Denied");
        return;
      }

      setLocation(locationData.latitude, locationData.longitude);

      const url = `${API_CONFIG.ALADHAN_BASE_URL}?latitude=${locationData.latitude}&longitude=${locationData.longitude}&method=${API_CONFIG.DEFAULT_METHOD}`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });
      
      const json: PrayerTimesResponse = await response.json();

      if (json.code === 200 && json.data) {
        setPrayerData(json.data.timings, locationData.name);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (error) {
      console.error("Failed to load prayer schedule:", error);
      setError(error instanceof Error ? error.message : "Failed to load prayer times");
      setPrayerData(null, "Error loading data");
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentLocation, setPrayerData, setLocation]);

  return {
    fetchPrayerTimes,
    isLoading,
    error,
  };
};