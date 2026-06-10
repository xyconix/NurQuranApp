import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { QuranSVG } from "../../../assets/svg";
import { QuranShadow } from "./QuranShadow";
import { SPLASH_SIZES } from "../../constants/splash.constants";

interface QuranIllustrationProps {
  quranTranslateY: SharedValue<number>;
  shadowScale: SharedValue<number>;
}

export const QuranIllustration: React.FC<QuranIllustrationProps> = ({
  quranTranslateY,
  shadowScale,
}) => {
  const quranAnimatedStyle = {
    transform: [{ translateY: quranTranslateY }],
  };

  return (
    <View style={styles.container}>
      <QuranShadow scale={shadowScale} />
      <Animated.View style={quranAnimatedStyle}>
        <QuranSVG />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
    width: "100%",
    height: SPLASH_SIZES.quranContainerHeight,
  },
});
