import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { DecorativeStars } from "./DecorativeStars";
import { DecorativeClouds } from "./DecorativeClouds";
import { QuranIllustration } from "./QuranIllustration";
import { GetStartedButton } from "./GetStartedButton";
import { SPLASH_SIZES, SPLASH_COLORS } from "../../constants/splash.constants";

interface SplashCardProps {
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
  quranTranslateY: SharedValue<number>;
  shadowScale: SharedValue<number>;
  buttonScale: SharedValue<number>;
  onGetStarted: () => void;
  onButtonPressIn: () => void;
  onButtonPressOut: () => void;
}

export const SplashCard: React.FC<SplashCardProps> = ({
  opacity,
  scale,
  quranTranslateY,
  shadowScale,
  buttonScale,
  onGetStarted,
  onButtonPressIn,
  onButtonPressOut,
}) => {
  const animatedStyle = {
    opacity,
    transform: [{ scale }],
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <DecorativeStars />
      <DecorativeClouds />
      
      <QuranIllustration
        quranTranslateY={quranTranslateY}
        shadowScale={shadowScale}
      />
      
      <GetStartedButton
        scale={buttonScale}
        onPress={onGetStarted}
        onPressIn={onButtonPressIn}
        onPressOut={onButtonPressOut}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SPLASH_SIZES.cardWidth,
    height: SPLASH_SIZES.cardHeight,
    backgroundColor: SPLASH_COLORS.cardBackground,
    borderRadius: SPLASH_SIZES.borderRadius,
    padding: SPLASH_SIZES.padding,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
    top: -60,
  },
});
