import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import { useTranslation } from "react-i18next";

type Props = {
  error: Error;
  onRetry: () => void;
  juzId: number;
};

export const ErrorState: React.FC<Props> = ({ error, onRetry, juzId }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>{error.message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.buttonText}>{t("Retry")}</Text>
      </TouchableOpacity>
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
  errorText: {
    color: COLORS.ERROR,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.TEXT,
    fontWeight: "bold",
  },
});