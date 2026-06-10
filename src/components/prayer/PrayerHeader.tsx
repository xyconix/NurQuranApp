import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Settings } from "lucide-react-native";
import { PRAYER_COLORS } from "../../constants/prayer.constants";
import { useTranslation } from "react-i18next";

interface PrayerHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const PrayerHeader: React.FC<PrayerHeaderProps> = ({ onRefresh, isLoading }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t("Prayer Times")}</Text>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshButton} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color={PRAYER_COLORS.TEXT_PRIMARY} size="small" />
        ) : (
          <Settings color={PRAYER_COLORS.TEXT_PRIMARY} size={24} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    color: PRAYER_COLORS.HEADER_TEXT,
    fontSize: 22,
    fontWeight: "bold",
  },
  refreshButton: {
    padding: 5,
  },
});