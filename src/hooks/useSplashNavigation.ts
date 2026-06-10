import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { useCallback } from "react";

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

export const useSplashNavigation = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const navigateToHome = useCallback(() => {
    completeOnboarding();
    navigation.navigate("HomeScreen");
  }, [completeOnboarding, navigation]);

  return {
    navigateToHome,
  };
};