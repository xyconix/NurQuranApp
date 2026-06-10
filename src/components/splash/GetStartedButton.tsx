import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { SPLASH_COLORS, SPLASH_SIZES } from "../../constants/splash.constants";
import { useTranslation } from "react-i18next";

interface GetStartedButtonProps {
  scale: SharedValue<number>;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({
  scale,
  onPress,
  onPressIn,
  onPressOut,
}) => {
  const { t } = useTranslation();
  
  const animatedStyle = {
    transform: [{ scale }],
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        style={styles.button}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        <Text style={styles.text}>{t("Get Started")}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: SPLASH_COLORS.buttonBackground,
    paddingVertical: 16,
    borderRadius: SPLASH_SIZES.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: SPLASH_COLORS.buttonText,
  },
});
