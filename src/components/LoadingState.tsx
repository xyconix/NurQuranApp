import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/colors";
import { useTranslation } from "react-i18next";

type Props = {
  juzId: number;
};

export const LoadingState: React.FC<Props> = ({ juzId }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.infoText}>
        {t("Loading Juz")} {juzId}...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    color: COLORS.TEXT,
    marginTop: 10,
  },
});