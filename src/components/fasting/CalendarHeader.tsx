import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

export const CalendarHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t("Islamic Calendar")}</Text>
      <Text style={styles.subtitle}>
        {t("Fasting Calendar & Islamic Events")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 6,
  },
});