import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// PENTING: Menggunakan insets untuk mengambil tinggi navigasi bawah secara dinamis
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Book,
  Compass,
  Clock,
  Calendar,
  Bookmark,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

// Constants
const ACTIVE_COLOR = "#A44AFF";
const INACTIVE_COLOR = "#8D92A3";
const BACKGROUND_COLOR = "#0B1535";
const PADDING_VERTICAL = 16;

// Types
type TabKey = "home" | "qiblat" | "prayer" | "fasting" | "tasbih" | "bookmark";
type TabNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomTabBarProps {
  active: TabKey;
}

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth: number;
  }>;
  screen: keyof RootStackParamList;
}

// Tab configuration
const TABS: TabItem[] = [
  { key: "home", label: "Home", icon: Book, screen: "HomeScreen" },
  { key: "prayer", label: "Prayer", icon: Clock, screen: "PrayerTimesScreen" },
  { key: "fasting", label: "Fasting", icon: Calendar, screen: "FastingScreen" },
  {
    key: "bookmark",
    label: "Bookmark",
    icon: Bookmark,
    screen: "BookmarkScreen",
  },
];

const BottomTabBar = ({ active }: BottomTabBarProps) => {
  const navigation = useNavigation<TabNavigationProp>();
  // Ambil data area aman (insets)
  const insets = useSafeAreaInsets();

  const handleTabPress = (tabKey: TabKey) => {
    const tab = TABS.find((t) => t.key === tabKey);
    if (tab) {
      navigation.navigate(tab.screen as never);
    }
  };

  return (
    /* 
      Di sini kita hapus position absolute dan bottom 0 bawaan style, 
      lalu tambahkan paddingBottom dinamis mengikuti tinggi bar navigasi HP.
    */
    <View 
      style={[
        styles.container, 
        { paddingBottom: insets.bottom > 0 ? insets.bottom : PADDING_VERTICAL }
      ]}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.key)}
          >
            <Icon
              size={26}
              color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
              strokeWidth={isActive ? 3 : 2}
            />

            {isActive && <Text style={styles.activeTabText}>{tab.label}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // HAPUS position: "absolute" dan bottom: 0 agar tidak menabrak bar navigasi asli HP
    width: "100%",
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: PADDING_VERTICAL, // Tetap gunakan padding atas yang konsisten
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1, // Membagi rata ruang antar tab
  },
  activeTabText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "bold",
    color: ACTIVE_COLOR,
  },
});

export default BottomTabBar;