export const QARI_NAMES: Record<string, string> = {
  "01": "Abdullah Al-Juhany",
  "02": "Abdul Muhsin Al-Qasim",
  "03": "Abdurrahman As-Sudais",
  "04": "Ibrahim Al-Dossari",
  "05": "Misyari Rasyid Al-Afasi",
};

export const DEFAULT_QARI = "05";
export const QARI_FALLBACK_ORDER = ["05", "01", "02", "03", "04"];

export type QariId = keyof typeof QARI_NAMES;