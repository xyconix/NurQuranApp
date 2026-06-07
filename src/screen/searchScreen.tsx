import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Search, ArrowLeft, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../store/useAppStore";

// Constants
const MIN_SEARCH_LENGTH = 2;
const COLORS = {
  primary: "#A44AFF",
  background: "#0B1535",
  cardBackground: "rgba(26, 40, 68, 0.4)",
  inputBackground: "#121931",
  text: "white",
  secondaryText: "#8D92A3",
  border: "rgba(164, 74, 255, 0.2)",
};

const SIZES = {
  borderRadius: 12,
  padding: 20,
  cardPadding: 16,
  numberBadge: 40,
  searchBarHeight: 50,
  iconSize: 24,
  smallIconSize: 20,
};

interface Surah {
  nomor: number;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  nama: string;
}

const SearchScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState("");
  const { allSurahs } = useAppStore();

  const filteredResults = useMemo(() => {
    if (query.length < MIN_SEARCH_LENGTH) return [];

    const searchKey = query.toLowerCase();
    return allSurahs.filter(
      (surah: Surah) =>
        surah.namaLatin.toLowerCase().includes(searchKey) ||
        surah.arti.toLowerCase().includes(searchKey),
    );
  }, [query, allSurahs]);

  const handleClearSearch = useCallback(() => {
    setQuery("");
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Surah }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("SurahDetail", { surahId: item.nomor })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>{item.nomor}</Text>
          </View>
          <View style={styles.surahInfo}>
            <Text style={styles.title}>{item.namaLatin}</Text>
            <Text style={styles.subTitle}>
              {item.arti} • {item.jumlahAyat} {t("Ayat")}
            </Text>
          </View>
          <Text style={styles.arabic}>{item.nama}</Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation],
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {query.length < MIN_SEARCH_LENGTH ? (
        <>
          <View style={styles.bigSearchIcon}>
            <Search color={COLORS.primary} size={80} opacity={0.3} />
          </View>
          <Text style={styles.emptyTitle}>{t("Start Search")}</Text>
          <Text style={styles.emptySub}>
            {t("Enter at least 2 characters to search Quran surahs")}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyTitle}>{t("Surah Not Found")}</Text>
          <Text style={styles.emptySub}>
            {t("Try searching with different keywords")}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={COLORS.text} size={SIZES.iconSize} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search color={COLORS.secondaryText} size={SIZES.smallIconSize} />
          <TextInput
            style={styles.input}
            placeholder={t("Search Surah (example: Al-Fatihah)")}
            placeholderTextColor={COLORS.secondaryText}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X color={COLORS.text} size={SIZES.smallIconSize} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {filteredResults.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.foundText}>
            {t("Found")} {filteredResults.length} {t("results")}
          </Text>
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.nomor.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled
          />
        </View>
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    gap: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 15,
    height: SIZES.searchBarHeight,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  bigSearchIcon: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySub: {
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 22,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  foundText: {
    color: COLORS.secondaryText,
    marginBottom: 15,
    fontSize: 14,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.cardPadding,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  numberBadge: {
    width: SIZES.numberBadge,
    height: SIZES.numberBadge,
    borderRadius: SIZES.numberBadge / 2,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  surahInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  subTitle: {
    color: COLORS.secondaryText,
    fontSize: 13,
    marginTop: 4,
  },
  arabic: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SearchScreen;
