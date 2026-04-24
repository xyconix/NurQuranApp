import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, {
  Path,
  G,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StarSVG, CloudSVG, QuranSVG } from "../../assets/svg";
import { useAppStore } from "../store/useAppStore";

// Constants
const { width, height } = Dimensions.get("window");
const COLORS = {
  background: "#0B1535",
  cardBackground: "#6236CC",
  text: "white",
  secondaryText: "#8D92A3",
  buttonBackground: "#FFB085",
  buttonText: "#0B1535",
};
const SIZES = {
  cardWidth: width * 0.9,
  cardHeight: height * 0.6,
  borderRadius: 32,
  buttonRadius: 24,
  padding: 20,
  shadowHeight: 40,
};
const ANIMATION_DURATIONS = {
  text: 1000,
  card: 800,
  quran: 2000,
  button: 100,
};
const DELAYS = {
  card: 500,
};

// Types
type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

// Components
const QuranShadowSVG = () => (
  <Svg width="220" height="40" viewBox="0 0 220 40">
    <Defs>
      <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Rect width="220" height="40" fill="url(#grad)" rx="20" ry="20" />
  </Svg>
);

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  // Animation values
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  const quranFloating = useSharedValue(0);
  const shadowScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Text animation
    textOpacity.value = withTiming(1, {
      duration: ANIMATION_DURATIONS.text,
      easing: Easing.out(Easing.quad),
    });
    textTranslateY.value = withTiming(0, {
      duration: ANIMATION_DURATIONS.text,
      easing: Easing.out(Easing.quad),
    });

    // Card animation
    cardOpacity.value = withDelay(
      DELAYS.card,
      withTiming(1, { duration: ANIMATION_DURATIONS.card })
    );
    cardScale.value = withDelay(
      DELAYS.card,
      withTiming(1, {
        duration: ANIMATION_DURATIONS.card,
        easing: Easing.back(1),
      })
    );

    // Quran floating animation
    quranFloating.value = withRepeat(
      withSequence(
        withTiming(-10, {
          duration: ANIMATION_DURATIONS.quran,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: ANIMATION_DURATIONS.quran,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    );

    // Shadow animation
    shadowScale.value = withRepeat(
      withSequence(
        withTiming(0.8, {
          duration: ANIMATION_DURATIONS.quran,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(1, {
          duration: ANIMATION_DURATIONS.quran,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    );
  }, []);

  // Animated styles
  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const animatedQuranStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: quranFloating.value }],
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScale.value }],
    opacity: shadowScale.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Button handlers
  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, {
      duration: ANIMATION_DURATIONS.button,
    });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: ANIMATION_DURATIONS.button });
  };

  const handleGetStarted = () => {
    completeOnboarding();
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header Text */}
      <Animated.View style={[styles.textHeader, animatedTextStyle]}>
        <Text style={styles.title}>Nur Quran</Text>
        <Text style={styles.subtitle}>
          {"Learn Quran and\nRecite once everyday"}
        </Text>
      </Animated.View>

      {/* Main Card */}
      <Animated.View style={[styles.mainCard, animatedCardStyle]}>
        {/* Decorative Elements */}
        <View style={styles.star1}>
          <StarSVG />
        </View>
        <View style={styles.star2}>
          <StarSVG />
        </View>
        <View style={styles.star3}>
          <StarSVG />
        </View>
        <View style={styles.cloud1}>
          <CloudSVG />
        </View>
        <View style={styles.cloud2}>
          <CloudSVG />
        </View>

        {/* Quran and Shadow */}
        <View style={styles.quranContainer}>
          <Animated.View style={[styles.quranShadow, animatedShadowStyle]}>
            <QuranShadowSVG />
          </Animated.View>
          <Animated.View style={animatedQuranStyle}>
            <QuranSVG />
          </Animated.View>
        </View>

        {/* Get Started Button */}
        <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleGetStarted}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 40,
  },
  textHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "System",
  },
  mainCard: {
    width: SIZES.cardWidth,
    height: SIZES.cardHeight,
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
    top: -60,
  },
  // Decorative elements positions
  star1: { position: "absolute", top: 40, left: 30, opacity: 0.8 },
  star2: { position: "absolute", top: 100, left: 130 },
  star3: { position: "absolute", top: 200, right: 30, opacity: 0.6 },
  cloud1: { position: "absolute", top: 80, left: -20 },
  cloud2: {
    position: "absolute",
    top: 150,
    right: -10,
    transform: [{ scale: 1.2 }],
  },
  quranContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    position: "relative",
    width: "100%",
    height: 180,
  },
  quranShadow: {
    position: "absolute",
    bottom: -15,
    zIndex: -1,
  },
  buttonWrapper: {
    width: "80%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.buttonBackground,
    paddingVertical: 16,
    borderRadius: SIZES.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.buttonText,
  },
});

export default SplashScreen;