import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { HOME_COLORS } from "../../constants/home.constants";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isLoading,
  error,
  onRetry,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={HOME_COLORS.PRIMARY} />
        <Text style={styles.text}>{t("Loading surahs")}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("Failed to load surahs")}</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>{t("Retry")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t("No surahs available")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: HOME_COLORS.TEXT_SECONDARY,
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorDetail: {
    color: HOME_COLORS.TEXT_SECONDARY,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: HOME_COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontWeight: "600",
  },
});