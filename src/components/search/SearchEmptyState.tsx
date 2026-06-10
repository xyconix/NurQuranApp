import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { SEARCH_COLORS, SEARCH_SIZES, SEARCH_MESSAGES } from "../../constants/search.constants";
import { useTranslation } from "react-i18next";

interface SearchEmptyStateProps {
  isQueryTooShort: boolean;
  hasNoResults: boolean;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
  isQueryTooShort,
  hasNoResults,
}) => {
  const { t } = useTranslation();

  if (isQueryTooShort) {
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Search color={SEARCH_COLORS.primary} size={SEARCH_SIZES.emptyIconSize} opacity={0.3} />
        </View>
        <Text style={styles.title}>{t(SEARCH_MESSAGES.START_SEARCH)}</Text>
        <Text style={styles.subtitle}>{t(SEARCH_MESSAGES.MIN_CHARACTERS)}</Text>
      </View>
    );
  }

  if (hasNoResults) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t(SEARCH_MESSAGES.NO_RESULTS)}</Text>
        <Text style={styles.subtitle}>{t(SEARCH_MESSAGES.TRY_DIFFERENT)}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 150,
    height: 150,
    backgroundColor: SEARCH_COLORS.inputBackground,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: SEARCH_COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: SEARCH_COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 22,
  },
});