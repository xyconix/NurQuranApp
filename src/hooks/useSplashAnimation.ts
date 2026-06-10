import { useEffect } from "react";
import {
  useSharedValue,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import {
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
} from "../constants/splash.constants";
import {
  textAnimationConfig,
  cardAnimationConfig,
  cardOpacityConfig,
  getFloatingSequence,
  getShadowSequence,
  buttonAnimationConfig,
} from "../animations/splashAnimations";

export const useSplashAnimation = () => {
  // Text animations
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  // Card animations
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  // Quran floating animations
  const quranTranslateY = useSharedValue(0);
  const shadowScale = useSharedValue(1);

  // Button animation
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Start text animation
    textOpacity.value = withTiming(1, textAnimationConfig);
    textTranslateY.value = withTiming(0, textAnimationConfig);

    // Start card animation with delay
    cardOpacity.value = withDelay(
      ANIMATION_DELAYS.card,
      withTiming(1, cardOpacityConfig)
    );
    cardScale.value = withDelay(
      ANIMATION_DELAYS.card,
      withTiming(1, cardAnimationConfig)
    );

    // Start floating animations
    const { up, down } = getFloatingSequence();
    quranTranslateY.value = withRepeat(
      withSequence(withTiming(up.translateY, up.config), withTiming(down.translateY, down.config)),
      -1,
      true
    );

    const { shrink, expand } = getShadowSequence();
    shadowScale.value = withRepeat(
      withSequence(withTiming(shrink.scaleX, shrink.config), withTiming(expand.scaleX, expand.config)),
      -1,
      true
    );
  }, []);

  const animateButtonPress = (isPressed: boolean) => {
    buttonScale.value = withTiming(isPressed ? 0.95 : 1, buttonAnimationConfig);
  };

  return {
    // Animation values
    textOpacity,
    textTranslateY,
    cardScale,
    cardOpacity,
    quranTranslateY,
    shadowScale,
    buttonScale,
    // Animation controls
    animateButtonPress,
  };
};