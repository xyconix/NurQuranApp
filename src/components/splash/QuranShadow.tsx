import React from "react";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import Animated, { SharedValue } from "react-native-reanimated";
import { SPLASH_SIZES } from "../../constants/splash.constants";

const ShadowSvg: React.FC = () => (
  <Svg width={220} height={40} viewBox="0 0 220 40">
    <Defs>
      <RadialGradient id="shadow-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Rect width="220" height="40" fill="url(#shadow-grad)" rx="20" ry="20" />
  </Svg>
);

interface QuranShadowProps {
  scale: SharedValue<number>;
}

export const QuranShadow: React.FC<QuranShadowProps> = ({ scale }) => {
  const animatedStyle = {
    transform: [{ scaleX: scale }],
    opacity: scale,
  };

  return (
    <Animated.View style={[styles.shadow, animatedStyle]}>
      <ShadowSvg />
    </Animated.View>
  );
};

const styles = {
  shadow: {
    position: "absolute" as const,
    bottom: -15,
    zIndex: -1,
  },
};
