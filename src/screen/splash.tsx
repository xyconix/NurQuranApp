import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSplashAnimation } from "../hooks/useSplashAnimation";
import { useSplashNavigation } from "../hooks/useSplashNavigation";
import { AnimatedText, SplashCard } from "../components/splash";
import { SPLASH_COLORS } from "../constants/splash.constants";
import { LoadingIndicator } from "../components/splash/LoadingIndicator";
import { preloadQuranData } from "../components/preloadQuranData";

const SplashScreen = () => {
  const [isPreloading, setIsPreloading] = useState(true);
  const {
    textOpacity,
    textTranslateY,
    cardScale,
    cardOpacity,
    quranTranslateY,
    shadowScale,
    buttonScale,
    animateButtonPress,
  } = useSplashAnimation();

  const { navigateToHome } = useSplashNavigation();

  useEffect(() => {
    // Preload data in background
    const preloadData = async () => {
      try {
        await preloadQuranData();
      } catch (error) {
        console.error("Failed to preload data:", error);
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => setIsPreloading(false), 500);
      }
    };

    preloadData();
  }, []);
  const handlePressIn = () => {
    animateButtonPress(true);
  };

  const handlePressOut = () => {
    animateButtonPress(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <AnimatedText opacity={textOpacity} translateY={textTranslateY} />

      <SplashCard
        opacity={cardOpacity}
        scale={cardScale}
        quranTranslateY={quranTranslateY}
        shadowScale={shadowScale}
        buttonScale={buttonScale}
        onGetStarted={navigateToHome}
        onButtonPressIn={handlePressIn}
        onButtonPressOut={handlePressOut}
      />
      <LoadingIndicator visible={isPreloading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_COLORS.background,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 40,
  },
});

export default SplashScreen;
