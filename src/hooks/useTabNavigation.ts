import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { TabKey } from "../types/tabNavigation.types";
import { TABS_CONFIG } from "../constants/tabNavigation.constants";
import { useCallback } from "react";
import * as Haptics from "expo-haptics";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useTabNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToTab = useCallback((tabKey: TabKey) => {
    const tab = TABS_CONFIG.find(t => t.key === tabKey);
    if (tab) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(tab.screen as never);
    }
  }, [navigation]);

  const getCurrentRoute = useCallback(() => {
    return navigation.getState().routes[navigation.getState().index]?.name;
  }, [navigation]);

  const canNavigate = useCallback((tabKey: TabKey): boolean => {
    const tab = TABS_CONFIG.find(t => t.key === tabKey);
    return !!tab;
  }, []);

  return {
    navigateToTab,
    getCurrentRoute,
    canNavigate,
  };
};