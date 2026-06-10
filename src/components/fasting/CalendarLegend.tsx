import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendColor, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

export const CalendarLegend: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LegendItem color="#3B82F6" label={t("Monday & Thursday")} />
      <LegendItem color="#10B981" label={t("Ayyamul Bidh")} />
      <LegendItem color="#EF4444" label={t("Ashura & Arafah")} />
      <LegendItem color="#FBBF24" label={t("Ramadan")} />
      <View style={styles.legendItem}>
        <View style={styles.whiteDot} />
        <Text style={styles.legendText}>{t("Important Islamic Day")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  legendItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  whiteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    marginRight: 8,
  },
  legendText: {
    color: "#CBD5E1",
    fontSize: 12,
  },
});