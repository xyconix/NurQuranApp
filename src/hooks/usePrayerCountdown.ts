
import { useState, useEffect, useCallback } from "react";
import { PrayerTimes, PrayerInfo } from "../types/quran.types";
import { getCurrentPrayer, getNextPrayer, getNextPrayerAfterCurrent } from "../utils/prayerHelpers";
import { getTimeDifference, formatCountdown } from "../utils/timeHelpers";

export const usePrayerCountdown = (prayerTimes: PrayerTimes | null) => {
  const [countdown, setCountdown] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState<PrayerInfo | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerInfo | null>(null);

  const updatePrayerInfo = useCallback(() => {
    const current = getCurrentPrayer(prayerTimes);
    const next = current || getNextPrayer(prayerTimes);
    
    setCurrentPrayer(current);
    setNextPrayer(next);
    
    return { current, next };
  }, [prayerTimes]);

  const updateCountdown = useCallback(() => {
    if (!prayerTimes) {
      setCountdown("");
      return;
    }

    const { current, next } = updatePrayerInfo();
    
    if (!next) {
      setCountdown("Done (Isha)");
      return;
    }

    if (next.isCurrent) {
      // Currently in prayer time, show countdown to next prayer
      const nextPrayerAfterCurrent = getNextPrayerAfterCurrent(prayerTimes, next.name);
      if (nextPrayerAfterCurrent) {
        const diff = getTimeDifference(nextPrayerAfterCurrent.time);
        if (diff > 0) {
          setCountdown(`Until ${nextPrayerAfterCurrent.time.toLocaleTimeString()} (${formatCountdown(diff)})`);
        } else {
          setCountdown("Prayer time ending soon");
        }
      } else {
        setCountdown("Last prayer of the day");
      }
    } else if (next.isLast) {
      setCountdown("Done for today");
    } else {
      const diff = getTimeDifference(next.time);
      if (diff > 0) {
        setCountdown(formatCountdown(diff));
      } else {
        setCountdown("Prayer time has started");
      }
    }
  }, [prayerTimes, updatePrayerInfo]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  return {
    countdown,
    currentPrayer,
    nextPrayer,
  };
};