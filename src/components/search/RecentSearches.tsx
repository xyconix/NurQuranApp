// components/search/RecentSearches.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Clock, X } from "lucide-react-native";
import { SEARCH_COLORS } from "../../constants/search.constants";
import { useTranslation } from "react-i18next";

interface RecentSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
  onClearAll: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSelect,
  onRemove,
  onClearAll,
}) => {
  const { t } = useTranslation();

  if (searches.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("Recent Searches")}</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={styles.clearText}>{t("Clear All")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searches}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recentItem}
            onPress={() => onSelect(item)}
            activeOpacity={0.7}
          >
            <Clock color={SEARCH_COLORS.secondaryText} size={16} />
            <Text style={styles.recentText}>{item}</Text>
            <TouchableOpacity
              onPress={() => onRemove(item)}
              style={styles.removeButton}
            >
              <X color={SEARCH_COLORS.secondaryText} size={14} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: SEARCH_COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  clearText: {
    color: SEARCH_COLORS.primary,
    fontSize: 14,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SEARCH_COLORS.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  recentText: {
    flex: 1,
    color: SEARCH_COLORS.text,
    fontSize: 14,
    marginLeft: 12,
  },
  removeButton: {
    padding: 4,
  },
});