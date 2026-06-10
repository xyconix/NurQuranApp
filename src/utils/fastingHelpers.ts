import { FastingEvent, IslamicEvent } from "../types/quran.types";
import { FASTING_EVENTS, ISLAMIC_EVENTS } from "../constants/fasting.constants";

export const getFastingEvent = (
  dayOfWeek: number,
  hijriDay: string,
  hijriMonthNumber: number
): FastingEvent | null => {
  const day = Number(hijriDay);

  if (!Number.isFinite(day)) {
    return null;
  }

  const isEidAlFitr = hijriMonthNumber === 10 && day === 1;
  const isEidAlAdha = hijriMonthNumber === 12 && day === 10;
  const isTashreeqDay = hijriMonthNumber === 12 && day >= 11 && day <= 13;

  if (isEidAlFitr || isEidAlAdha || isTashreeqDay) {
    return null;
  }

  // Ramadan is obligatory and should not be overridden by sunnah labels.
  if (hijriMonthNumber === 9) {
    return FASTING_EVENTS.RAMADAN;
  }

  // Arafah (Dhul-Hijjah 9)
  if (hijriMonthNumber === 12 && day === 9) {
    return FASTING_EVENTS.ARAFAH;
  }

  // Tasu'a and Ashura (Muharram 9-10)
  if (hijriMonthNumber === 1 && day === 9) {
    return FASTING_EVENTS.TASUA;
  }

  if (hijriMonthNumber === 1 && day === 10) {
    return FASTING_EVENTS.ASHURA;
  }

  // Ayyamul Bidh (13, 14, 15 Hijri)
  if ([13, 14, 15].includes(day)) {
    return FASTING_EVENTS.AYYAMUL_BIDH;
  }

  // Monday (1) or Thursday (4), based on JavaScript Date.getDay().
  if (dayOfWeek === 1) {
    return FASTING_EVENTS.MONDAY;
  }

  if (dayOfWeek === 4) {
    return FASTING_EVENTS.THURSDAY;
  }

  return null;
};

export const getIslamicEvent = (
  hijriDay: string,
  hijriMonthNumber: number
): IslamicEvent | null => {
  const key = `${hijriMonthNumber}_${hijriDay}`;
  
  const eventsMap: Record<string, IslamicEvent> = {
    "1_1": ISLAMIC_EVENTS.MUHARRAM_1,
    "1_10": ISLAMIC_EVENTS.MUHARRAM_10,
    "3_12": ISLAMIC_EVENTS.RABI_12,
    "7_27": ISLAMIC_EVENTS.RAJAB_27,
    "8_15": ISLAMIC_EVENTS.SHABAN_15,
    "9_1": ISLAMIC_EVENTS.RAMADAN_1,
    "9_17": ISLAMIC_EVENTS.RAMADAN_17,
    "9_27": ISLAMIC_EVENTS.RAMADAN_27,
    "10_1": ISLAMIC_EVENTS.SHAWWAL_1,
    "12_10": ISLAMIC_EVENTS.DHULHIJJAH_10,
  };

  return eventsMap[key] || null;
};

export const isSpecialFasting = (fastingEvent: FastingEvent | null): boolean => {
  if (!fastingEvent) return false;
  const regularFasts = ["Monday", "Thursday"];
  return !regularFasts.includes(fastingEvent.label);
};
