import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { SEARCH_COLORS, SEARCH_MESSAGES } from "../../constants/search.constants";
import { useTranslation } from "react-i18next";

interface SearchStatsProps {
  resultCount: number;
  isLoading?: boolean;
}

export const SearchStats: React.FC<SearchStatsProps> = ({ resultCount, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={SEARCH_COLORS.primary} />
        <Text style={styles.text}>{t("Searching")}...</Text>
      </View>
    );
  }

  if (resultCount === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t(SEARCH_MESSAGES.FOUND_RESULTS)} {resultCount} {t(SEARCH_MESSAGES.RESULTS)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    color: SEARCH_COLORS.secondaryText,
    fontSize: 14,
  },
});