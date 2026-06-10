import { PrayerName } from "../types/quran.types";

export const PRAYER_KEYS: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PRAYER_DISPLAY_NAMES = {
  Fajr: 'Fajr',
  Dhuhr: 'Dhuhr',
  Asr: 'Asr',
  Maghrib: 'Maghrib',
  Isha: 'Isha',
} as const;

export const PRAYER_COLORS = {
  BACKGROUND: "#0B1535",
  CARD_BG: "#121931",
  ACTIVE_CARD_BG: "#1F2C52",
  PRIMARY: "#A44AFF",
  ACCENT: "#38A3E5",
  TEXT_PRIMARY: "white",
  TEXT_SECONDARY: "#8D92A3",
  HEADER_TEXT: "white",
  COUNTDOWN_TEXT: "white",
} as const;

export const NOTIFICATION_SETTINGS = {
  PRE_NOTIFICATION_MINUTES: 15,
  PRE_NOTIFICATION_SECONDS: 15 * 60,
} as const;

export const API_CONFIG = {
  ALADHAN_BASE_URL: "https://api.aladhan.com/v1/timings",
  DEFAULT_METHOD: 11, // Kemenag method for Indonesia
  TIMEOUT: 10000,
} as const;