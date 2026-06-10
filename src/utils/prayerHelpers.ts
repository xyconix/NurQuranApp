import { PrayerInfo, PrayerName, PrayerTimes, PRAYER_NAMES } from "../types/quran.types";
import { createDateFromTime } from "./timeHelpers";

export const getCurrentPrayer = (prayerTimes: PrayerTimes | null): PrayerInfo | null => {
  if (!prayerTimes) return null;
  
  const now = new Date();
  
  for (let i = 0; i < PRAYER_NAMES.length; i++) {
    const currentKey = PRAYER_NAMES[i];
    const nextKey = PRAYER_NAMES[i + 1];
    
    if (!prayerTimes[currentKey]) continue;
    
    const currentTime = createDateFromTime(prayerTimes[currentKey]);
    const nextTime = nextKey && prayerTimes[nextKey] 
      ? createDateFromTime(prayerTimes[nextKey]) 
      : null;
    
    if (now >= currentTime) {
      if (!nextTime || now < nextTime) {
        return {
          name: currentKey,
          time: currentTime,
          isCurrent: true,
          isLast: false,
        };
      }
    }
  }
  
  return null;
};

export const getNextPrayer = (prayerTimes: PrayerTimes | null): PrayerInfo | null => {
  if (!prayerTimes) return null;
  
  const now = new Date();
  
  for (const key of PRAYER_NAMES) {
    if (!prayerTimes[key]) continue;
    const prayerTime = createDateFromTime(prayerTimes[key]);
    if (prayerTime > now) {
      return {
        name: key,
        time: prayerTime,
        isCurrent: false,
        isLast: false,
      };
    }
  }
  
  // If all prayers have passed, return Isha
  if (prayerTimes['Isha']) {
    return {
      name: 'Isha',
      time: createDateFromTime(prayerTimes['Isha']),
      isCurrent: false,
      isLast: true,
    };
  }
  
  return null;
};

export const getNextPrayerAfterCurrent = (
  prayerTimes: PrayerTimes | null,
  currentPrayer: PrayerName
): PrayerInfo | null => {
  if (!prayerTimes) return null;
  
  const currentIndex = PRAYER_NAMES.indexOf(currentPrayer);
  const nextKey = PRAYER_NAMES[currentIndex + 1];
  
  if (nextKey && prayerTimes[nextKey]) {
    return {
      name: nextKey,
      time: createDateFromTime(prayerTimes[nextKey]),
      isCurrent: false,
      isLast: nextKey === 'Isha',
    };
  }
  
  return null;
};

export const formatPrayerTime = (timeStr: string): string => {
  if (!timeStr) return "--:--";
  return timeStr.split(" ")[0];
};