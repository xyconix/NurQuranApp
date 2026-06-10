export const SEARCH_COLORS = {
  primary: "#A44AFF",
  background: "#0B1535",
  cardBackground: "rgba(26, 40, 68, 0.4)",
  inputBackground: "#121931",
  text: "white",
  secondaryText: "#8D92A3",
  border: "rgba(164, 74, 255, 0.2)",
  placeholder: "#8D92A3",
} as const;

export const SEARCH_SIZES = {
  borderRadius: 12,
  padding: 20,
  cardPadding: 16,
  numberBadge: 40,
  searchBarHeight: 50,
  iconSize: 24,
  smallIconSize: 20,
  emptyIconSize: 80,
} as const;

export const SEARCH_MESSAGES = {
  MIN_CHARACTERS: "Enter at least 2 characters to search Quran surahs",
  NO_RESULTS: "Surah Not Found",
  TRY_DIFFERENT: "Try searching with different keywords",
  START_SEARCH: "Start Search",
  FOUND_RESULTS: "Found",
  RESULTS: "results",
  SEARCH_PLACEHOLDER: "Search Surah (example: Al-Fatihah)",
} as const;