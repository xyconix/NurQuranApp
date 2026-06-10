import React from "react";
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { useSearch } from "../hooks/useSearch";
import { useSearchNavigation } from "../hooks/useSearchNavigation";
import { useRecentSearches } from "../hooks/useRecentSearches";
import {
  SearchHeader,
  SearchEmptyState,
  SearchResultsList,
  RecentSearches,
} from "../components/search";
import { SEARCH_COLORS } from "../constants/search.constants";

const SearchScreen = () => {
  const {
    query,
    setQuery,
    clearSearch,
    results,
    hasResults,
    isQueryTooShort,
    resultCount,
    isDebouncing,
  } = useSearch();

  const { navigateToSurahDetail, goBack } = useSearchNavigation();
  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllRecentSearches,
  } = useRecentSearches();

  const handleSurahPress = (surahId: number) => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }

    navigateToSurahDetail(surahId);
  };

  const handleRecentSearchSelect = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  const showEmptyState = !hasResults && (query.length > 0 || isQueryTooShort);
  const showRecentSearches = !query && recentSearches.length > 0 && !hasResults;
  const showResults = hasResults && !isDebouncing;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <SearchHeader
          query={query}
          onQueryChange={setQuery}
          onClear={clearSearch}
          onBack={goBack}
        />

        {showRecentSearches && (
          <RecentSearches
            searches={recentSearches}
            onSelect={handleRecentSearchSelect}
            onRemove={removeRecentSearch}
            onClearAll={clearAllRecentSearches}
          />
        )}

        {showEmptyState && (
          <SearchEmptyState
            isQueryTooShort={isQueryTooShort}
            hasNoResults={!hasResults}
          />
        )}

        {showResults && (
          <SearchResultsList
            results={results}
            resultCount={resultCount}
            onItemPress={handleSurahPress}
            isLoading={isDebouncing}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SEARCH_COLORS.background,
  },
  flex: {
    flex: 1,
  },
});

export default SearchScreen;
