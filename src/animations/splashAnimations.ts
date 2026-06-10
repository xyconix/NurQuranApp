import { Easing, WithTimingConfig } from "react-native-reanimated";
import { ANIMATION_DURATIONS, FLOATING_RANGE } from "../constants/splash.constants";

export const textAnimationConfig: WithTimingConfig = {
  duration: ANIMATION_DURATIONS.text,
  easing: Easing.out(Easing.quad),
};

export const cardAnimationConfig: WithTimingConfig = {
  duration: ANIMATION_DURATIONS.card,
  easing: Easing.back(1),
};

export const cardOpacityConfig: WithTimingConfig = {
  duration: ANIMATION_DURATIONS.card,
};

export const floatingAnimationConfig = {
  duration: ANIMATION_DURATIONS.quran,
  easing: Easing.inOut(Easing.sin),
};

export const buttonAnimationConfig: WithTimingConfig = {
  duration: ANIMATION_DURATIONS.button,
};

export const getFloatingSequence = () => {
  return {
    up: {
      translateY: -FLOATING_RANGE.quran,
      config: floatingAnimationConfig,
    },
    down: {
      translateY: 0,
      config: floatingAnimationConfig,
    },
  };
};

export const getShadowSequence = () => {
  return {
    shrink: {
      scaleX: 1 - FLOATING_RANGE.shadow,
      config: floatingAnimationConfig,
    },
    expand: {
      scaleX: 1,
      config: floatingAnimationConfig,
    },
  };
};