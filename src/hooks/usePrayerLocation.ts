import { useState, useCallback } from "react";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

interface LocationData {
  latitude: number;
  longitude: number;
  name: string;
}

export const usePrayerLocation = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(t("Location Access Denied"));
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const { latitude, longitude } = loc.coords;

      // Reverse geocoding
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      let locationName = "Unknown Location";
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        locationName = `${place.city || place.region || "Unknown City"}, ${place.country}`;
      }

      return { latitude, longitude, name: locationName };
    } catch (error) {
      console.error("Error getting location:", error);
      setError(t("Failed to get location"));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  return {
    getCurrentLocation,
    isLoading,
    error,
  };
};