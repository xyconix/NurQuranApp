import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Search, ArrowLeft, X } from "lucide-react-native";
import { SEARCH_COLORS, SEARCH_SIZES } from "../../constants/search.constants";
import { useTranslation } from "react-i18next";

interface SearchHeaderProps {
  query: string;
  onQueryChange: (text: string) => void;
  onClear: () => void;
  onBack: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  query,
  onQueryChange,
  onClear,
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft color={SEARCH_COLORS.text} size={SEARCH_SIZES.iconSize} />
      </TouchableOpacity>
      
      <View style={styles.searchBar}>
        <Search color={SEARCH_COLORS.secondaryText} size={SEARCH_SIZES.smallIconSize} />
        <TextInput
          style={styles.input}
          placeholder={t("Search Surah (example: Al-Fatihah)")}
          placeholderTextColor={SEARCH_COLORS.placeholder}
          value={query}
          onChangeText={onQueryChange}
          autoFocus
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <X color={SEARCH_COLORS.text} size={SEARCH_SIZES.smallIconSize} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: SEARCH_SIZES.padding,
    gap: 15,
  },
  backButton: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SEARCH_COLORS.inputBackground,
    borderRadius: SEARCH_SIZES.borderRadius,
    paddingHorizontal: 15,
    height: SEARCH_SIZES.searchBarHeight,
  },
  input: {
    flex: 1,
    color: SEARCH_COLORS.text,
    fontSize: 16,
    marginLeft: 10,
  },
  clearButton: {
    padding: 4,
  },
});