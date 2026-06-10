import { RootStackParamList } from "../navigation/AppNavigator";

export type TabKey = "home" | "qiblat" | "prayer" | "fasting" | "tasbih" | "bookmark";

export interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth: number;
  }>;
  screen: keyof RootStackParamList;
  badge?: number;
  badgeColor?: string;
}

export interface BottomTabBarProps {
  active: TabKey;
  showLabels?: boolean;
  iconSize?: number;
}

export interface TabItemProps {
  tab: TabItem;
  isActive: boolean;
  iconSize: number;
  showLabel: boolean;
  onPress: (key: TabKey) => void;
}

export interface TabIconProps {
  Icon: React.ComponentType<any>;
  isActive: boolean;
  size: number;
  badge?: number;
  badgeColor?: string;
}