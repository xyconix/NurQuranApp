export interface SplashAnimationValues {
  textOpacity: number;
  textTranslateY: number;
  cardScale: number;
  cardOpacity: number;
  quranTranslateY: number;
  shadowScale: number;
  buttonScale: number;
}

export interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export type AnimationConfig = {
  duration: number;
  easing?: (value: number) => number;
  delay?: number;
};