import { useColorScheme } from "react-native";
import { useMemo } from "react";

// Palet warna untuk Dark Mode
const DARK_COLORS = {
  PRIMARY: "#A44AFF",
  SECONDARY: "#8D92A3",
  BACKGROUND: "#0B1535",
  CARD_BACKGROUND: "#6236CC",
  ERROR: "#ff5252",
  TEXT: "white",
  BORDER: "rgba(141,146,163,0.1)",
  ACTION_BAR_BG: "rgba(18,25,49,0.5)",
  COLLECTION_PIN: "#FFD700",
  COLLECTION_ERROR: "#FF6B6B",
  COLLECTION_ITEM_BG: "rgba(26, 40, 68, 0.4)",
  COLLECTION_BORDER: "rgba(42, 58, 90, 0.6)",
  BOOKMARK_ADD_SECTION_BG: "rgba(26, 40, 68, 0.3)",
  BOOKMARK_ADD_SECTION_BORDER: "rgba(164, 74, 255, 0.3)",
  BOOKMARK_BORDER: "rgba(141, 146, 163, 0.3)",
  BOOKMARK_COLLECTION_BG: "rgba(26, 40, 68, 0.3)",
  BOOKMARK_PIN: "#FFD700",
} as const;

// Palet warna untuk Light Mode
const LIGHT_COLORS = {
  PRIMARY: "#A44AFF",
  SECONDARY: "#666666",
  BACKGROUND: "#FFFFFF",
  CARD_BACKGROUND: "#F5F5F5",
  ERROR: "#D32F2F",
  TEXT: "#000000",
  BORDER: "rgba(0,0,0,0.1)",
  ACTION_BAR_BG: "rgba(245,245,245,0.9)",
  COLLECTION_PIN: "#FFA500",
  COLLECTION_ERROR: "#E53935",
  COLLECTION_ITEM_BG: "#F5F5F5",
  COLLECTION_BORDER: "rgba(0,0,0,0.15)",
  BOOKMARK_ADD_SECTION_BG: "#F5F5F5",
  BOOKMARK_ADD_SECTION_BORDER: "rgba(164, 74, 255, 0.3)",
  BOOKMARK_BORDER: "rgba(0,0,0,0.1)",
  BOOKMARK_COLLECTION_BG: "#F5F5F5",
  BOOKMARK_PIN: "#FFA500",
} as const;

// Hook untuk mendapatkan warna berdasarkan tema
export const useThemeColors = () => {
  const colorScheme = useColorScheme();

  const colors = useMemo(() => {
    return colorScheme === "light" ? LIGHT_COLORS : DARK_COLORS;
  }, [colorScheme]);

  return colors;
};

// Tetapkan COLORS default untuk backward compatibility
export const COLORS = DARK_COLORS;

export const COLLECTION_COLORS = {
  PIN: DARK_COLORS.COLLECTION_PIN,
  ERROR: DARK_COLORS.COLLECTION_ERROR,
  ITEM_BG: DARK_COLORS.COLLECTION_ITEM_BG,
  BORDER: DARK_COLORS.COLLECTION_BORDER,
} as const;

export const BOOKMARK_COLORS = {
  ADD_SECTION_BG: DARK_COLORS.BOOKMARK_ADD_SECTION_BG,
  ADD_SECTION_BORDER: DARK_COLORS.BOOKMARK_ADD_SECTION_BORDER,
  BOOKMARK_BORDER: DARK_COLORS.BOOKMARK_BORDER,
  COLLECTION_BG: DARK_COLORS.BOOKMARK_COLLECTION_BG,
  PIN: DARK_COLORS.BOOKMARK_PIN,
} as const;
