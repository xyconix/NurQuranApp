import { FastingEvent } from "../types/quran.types";

export const FASTING_COLORS = {
  MONDAY_THURSDAY: "#3B82F6",
  AYYAMUL_BIDH: "#10B981",
  ASHURA_ARAFAT: "#EF4444",
  RAMADAN: "#FBBF24",
} as const;

export const FASTING_EVENTS = {
  MONDAY: {
    label: "Monday",
    color: FASTING_COLORS.MONDAY_THURSDAY,
    description: "Monday Sunnah Fast",
  },
  THURSDAY: {
    label: "Thursday",
    color: FASTING_COLORS.MONDAY_THURSDAY,
    description: "Thursday Sunnah Fast",
  },
  TASUA: {
    label: "Tasu'a",
    color: FASTING_COLORS.ASHURA_ARAFAT,
    description: "9 Muharram Sunnah Fast",
  },
  AYYAMUL_BIDH: {
    label: "Ayyamul",
    color: FASTING_COLORS.AYYAMUL_BIDH,
    description: "Ayyamul Bidh Fasting (White Days)",
  },
  ASHURA: {
    label: "Ashura",
    color: FASTING_COLORS.ASHURA_ARAFAT,
    description: "Day of Ashura - Very Recommended",
  },
  ARAFAH: {
    label: "Arafah",
    color: FASTING_COLORS.ASHURA_ARAFAT,
    description: "Day of Arafah - Very Recommended",
  },
  RAMADAN: {
    label: "Ramadan",
    color: FASTING_COLORS.RAMADAN,
    description: "Obligatory Ramadan Fast",
  },
} satisfies Record<string, FastingEvent>;

export const ISLAMIC_EVENTS = {
  // Muharram (1)
  MUHARRAM_1: {
    label: "Islamic New Year",
    description: "1 Muharram - Islamic New Year",
    hijriDate: "1 Muharram",
  },
  MUHARRAM_10: {
    label: "Day of Ashura",
    description: "10 Muharram - A day of celebration for the Jews and we are commanded to fast",
    hijriDate: "10 Muharram",
  },
  // Rabi al-Awwal (3)
  RABI_12: {
    label: "Mawlid Nabi Muhammad",
    description: "Birth of Prophet Muhammad SAW - 12 Rabi al-Awwal",
    hijriDate: "12 Rabi al-Awwal",
  },
  // Rajab (7)
  RAJAB_27: {
    label: "Isra and Miraj",
    description: "Journey of Isra and Miraj of Prophet Muhammad SAW - 27 Rajab",
    hijriDate: "27 Rajab",
  },
  // Sha'ban (8)
  SHABAN_15: {
    label: "Nisfu Sha'ban",
    description: "Night of Nisfu Sha'ban - Night of Sunnah Fasting - 15 Sha'ban",
    hijriDate: "15 Sha'ban",
  },
  // Ramadan (9)
  RAMADAN_1: {
    label: "Beginning of Ramadan",
    description: "Beginning of Ramadan fasting month - 1 Ramadan",
    hijriDate: "1 Ramadan",
  },
  RAMADAN_17: {
    label: "Nuzul Al-Quran",
    description: "Revelation of Al-Quran to Prophet Muhammad SAW - 17 Ramadan",
    hijriDate: "17 Ramadan",
  },
  RAMADAN_27: {
    label: "Lailatul Qadar",
    description: "Night of Power - Night of revelation of Al-Quran - 27 Ramadan",
    hijriDate: "27 Ramadan",
  },
  // Shawwal (10)
  SHAWWAL_1: {
    label: "Eid al-Fitr",
    description: "Eid al-Fitr celebration - 1 Shawwal",
    hijriDate: "1 Shawwal",
  },
  // Dhul-Hijjah (12)
  DHULHIJJAH_10: {
    label: "Eid al-Adha",
    description: "Eid al-Adha celebration - 10 Dhul-Hijjah",
    hijriDate: "10 Dhul-Hijjah",
  },
} as const;
