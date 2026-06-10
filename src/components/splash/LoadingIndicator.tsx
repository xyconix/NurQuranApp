// components/splash/LoadingIndicator.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SPLASH_COLORS } from "../../constants/splash.constants";

interface LoadingIndicatorProps {
  visible: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.container}
    >
      <ActivityIndicator size="large" color={SPLASH_COLORS.PRIMARY} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
  },
});