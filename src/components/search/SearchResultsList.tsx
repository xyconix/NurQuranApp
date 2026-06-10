import React, { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SearchResultItem } from "./SearchResultItem";
import { SearchStats } from "./SearchStats";
import { Surah } from "../../types/search.types";

interface SearchResultsListProps {
  results: Surah[];
  resultCount: number;
  onItemPress: (surahId: number) => void;
  isLoading?: boolean;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = memo(({
  results,
  resultCount,
  onItemPress,
  isLoading,
}) => {
  const keyExtractor = useCallback((item: Surah) => item.nomor.toString(), []);
  
  const renderItem = useCallback(
    ({ item }: { item: Surah }) => (
      <SearchResultItem item={item} onPress={onItemPress} />
    ),
    [onItemPress]
  );

  const ListHeaderComponent = useCallback(() => (
    <SearchStats resultCount={resultCount} isLoading={isLoading} />
  ), [resultCount, isLoading]);

  if (results.length === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
});

SearchResultsList.displayName = 'SearchResultsList';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});