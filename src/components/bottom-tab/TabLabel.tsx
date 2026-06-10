import React from "react";
import { Text, StyleSheet } from "react-native";
import { TAB_COLORS, TAB_SIZES } from "../../constants/tabNavigation.constants";

interface TabLabelProps {
  label: string;
  isActive: boolean;
  showLabel: boolean;
}

export const TabLabel: React.FC<TabLabelProps> = ({ label, isActive, showLabel }) => {
  if (!showLabel && !isActive) return null;
  
  return (
    <Text style={[
      styles.label,
      isActive && styles.activeLabel,
      !showLabel && styles.hiddenLabel,
    ]}>
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: TAB_SIZES.labelSize,
    marginTop: 4,
    fontWeight: "500",
    color: TAB_COLORS.inactive,
  },
  activeLabel: {
    color: TAB_COLORS.active,
    fontWeight: "bold",
  },
  hiddenLabel: {
    display: "none",
  },
});