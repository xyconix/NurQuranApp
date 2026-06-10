import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { COLORS } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

export const LoadingState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#081226" translucent={false} />
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.text}>{t("Loading Islamic Calendar")}...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    marginTop: 12,
  },
});