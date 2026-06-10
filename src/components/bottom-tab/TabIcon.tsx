import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import {
  TAB_SIZES,
  TAB_COLORS,
} from "../../constants/tabNavigation.constants";
import { TabIconProps } from "../../types/tabNavigation.types";

export const TabIcon: React.FC<TabIconProps> = ({
  Icon,
  isActive,
  size,
  badge,
  badgeColor,
}) => {
  const iconSize = isActive ? size + 2 : size;

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withTiming(1.3, {
              duration: 800,
            }),
            -1,
            false
          ),
        },
      ],
      opacity: withRepeat(
        withTiming(0, {
          duration: 800,
        }),
        -1,
        false
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Icon
        size={iconSize}
        color={isActive ? TAB_COLORS.active : TAB_COLORS.inactive}
        strokeWidth={isActive ? 3 : 2}
      />

      {badge !== undefined && badge > 0 && (
        <>
          <Animated.View
            style={[
              styles.badgePulse,
              pulseStyle,
              {
                backgroundColor:
                  badgeColor || TAB_COLORS.badge,
              },
            ]}
          />

          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  badgeColor || TAB_COLORS.badge,
              },
            ]}
          >
            <Text style={styles.badgeText}>
              {badge > 99 ? "99+" : badge}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: -8,
    right: -12,
    minWidth: TAB_SIZES.badgeSize,
    height: TAB_SIZES.badgeSize,
    borderRadius: TAB_SIZES.badgeSize / 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 2,
  },

  badgePulse: {
    position: "absolute",
    top: -8,
    right: -12,
    minWidth: TAB_SIZES.badgeSize,
    height: TAB_SIZES.badgeSize,
    borderRadius: TAB_SIZES.badgeSize / 2,
    zIndex: 1,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});