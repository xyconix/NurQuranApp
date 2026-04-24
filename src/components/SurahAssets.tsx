import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { QuranSVG } from "../../assets/svg";

// Constants
const STAR_COLOR = "#A44AFF";
const TEXT_COLOR = "white";
const ANIMATION_DURATION = 2000;
const ANIMATION_OFFSET = -8;

// Components
export const StarNumber = ({ number }: { number: number }) => (
  <View style={styles.starWrapper}>
    <Svg width="36" height="36" viewBox="0 0 100 100">
      <Path
        d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z"
        fill="none"
        stroke={STAR_COLOR}
        strokeWidth="5"
      />
    </Svg>
    <Text style={styles.numberText}>{number}</Text>
  </View>
);

export const AnimatedQuran = () => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(ANIMATION_OFFSET, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.sin)
        }),
        withTiming(0, {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.sin)
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <QuranSVG width={120} height={100} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  starWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    position: "absolute",
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: "bold",
  },
});