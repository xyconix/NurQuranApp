export const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
] as const;

export const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const;

export const COLORS = {
  PRIMARY: "#A855F7",
  SECONDARY: "#10B981",
  ERROR: "#EF4444",
  WARNING: "#FBBF24",
  INFO: "#3B82F6",
  BACKGROUND: "#081226",
  CARD_BG: "rgba(17, 28, 52, 0.8)",
  TEXT: "white",
  TEXT_SECONDARY: "#94A3B8",
  TEXT_MUTED: "#CBD5E1",
  BORDER: "rgba(168, 85, 247, 0.2)",
} as const;

export const NOTIFICATION_TIMES = {
  EVENING: 20, // 8 PM
  MORNING: 5,  // 5 AM
} as const;

export const MAX_NOTIFICATIONS = 60;
export const NOTIFICATION_DAYS_LIMIT = 30;
export const WEEKLY_NOTIFICATION_DAYS = 7;