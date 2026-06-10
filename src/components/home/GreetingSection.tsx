import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { HOME_COLORS } from "../../constants/home.constants";
import { useTranslation } from "react-i18next";

export const GreetingSection: React.FC = () => {
  const { t } = useTranslation();

  // Get greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("Good Morning");
    if (hour < 18) return t("Good Afternoon");
    return t("Good Evening");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>{getTimeBasedGreeting()}</Text>
      <Text style={styles.assalamualaikum}>{t("Assalamualaikum")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  greetingText: {
    color: HOME_COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 4,
  },
  assalamualaikum: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 24,
    fontWeight: "bold",
  },
});