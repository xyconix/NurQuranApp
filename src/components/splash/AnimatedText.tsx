import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { SPLASH_COLORS } from "../../constants/splash.constants";
import { useTranslation } from "react-i18next";

interface AnimatedTextProps {
  opacity: SharedValue<number>;
  translateY: SharedValue<number>;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  opacity,
  translateY,
}) => {
  const { t } = useTranslation();

  const animatedStyle = {
    opacity,
    transform: [{ translateY }],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>Nur Quran</Text>
      <Text style={styles.subtitle}>
        {t("Learn Quran and")}
        {"\n"}
        {t("Recite once everyday")}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: SPLASH_COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: SPLASH_COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 24,
  },
});
