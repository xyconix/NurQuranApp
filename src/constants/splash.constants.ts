import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SPLASH_COLORS = {
  background: "#0B1535",
  cardBackground: "#6236CC",
  text: "white",
  secondaryText: "#8D92A3",
  buttonBackground: "#FFB085",
  buttonText: "#0B1535",
  PRIMARY: "#A44AFF",
  SECONDARY: "#8D92A3"
} as const;

export const SPLASH_SIZES = {
  cardWidth: width * 0.9,
  cardHeight: height * 0.6,
  borderRadius: 32,
  buttonRadius: 24,
  padding: 20,
  shadowHeight: 40,
  quranContainerHeight: 180,
  starSize: 24,
  cloudSize: 60,
} as const;

export const ANIMATION_DURATIONS = {
  text: 1000,
  card: 800,
  quran: 2000,
  button: 100,
  shadow: 2000,
} as const;

export const ANIMATION_DELAYS = {
  card: 500,
  text: 0,
  button: 300,
} as const;

export const FLOATING_RANGE = {
  quran: 10,
  shadow: 0.2,
} as const;

export const STAR_POSITIONS = [
  { top: 40, left: 30, opacity: 0.8 },
  { top: 100, left: 130, opacity: 1 },
  { top: 200, right: 30, opacity: 0.6 },
] as const;

export const CLOUD_POSITIONS = [
  { top: 80, left: -20, scale: 1 },
  { top: 150, right: -10, scale: 1.2 },
] as const;