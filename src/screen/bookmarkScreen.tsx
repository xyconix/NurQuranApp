import React from "react";
import { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import BottomTabBar from "../components/MainTabNavigator";
import {
  AddCollectionCard,
  BookmarkItem,
  CollectionItem,
  BookmarkSectionHeader,
  EmptyBookmarkState,
  BookmarkSearchBar,
} from "../components/bookmark";
import { useBookmarkScreen } from "../hooks/useBookmarkScreen";
import { useCollectionManagement } from "../hooks/useCollectionManagement";
import { COLORS } from "../constants/colors";

const BookmarkScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    bookmarks,
    pinnedCollections,
    unpinnedCollections,
    hasAnyContent,
    handleBookmarkPress,
    handleRemoveBookmark,
    handleCollectionPress,
  } = useBookmarkScreen();
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;
    const query = searchQuery.toLowerCase();
    return bookmarks.filter(
      (item) =>
        item.surahName.toLowerCase().includes(query) ||
        item.ayahText?.toLowerCase().includes(query),
    );
  }, [bookmarks, searchQuery]);
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim())
      return { pinned: pinnedCollections, unpinned: unpinnedCollections };
    const query = searchQuery.toLowerCase();
    const filterFn = (c: any) => c.name.toLowerCase().includes(query);
    return {
      pinned: pinnedCollections.filter(filterFn),
      unpinned: unpinnedCollections.filter(filterFn),
    };
  }, [pinnedCollections, unpinnedCollections, searchQuery]);

  const { handleCreateCollection, handleCollectionLongPress } =
    useCollectionManagement();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.BACKGROUND}
        translucent={false}
      />

      <Header title={t("Bookmarks")} />
      <BookmarkSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AddCollectionCard onPress={handleCreateCollection} />

        {bookmarks.length > 0 && (
          <View>
            <BookmarkSectionHeader title={t("Bookmarked Ayahs")} />
            {bookmarks.map((item) => (
              <BookmarkItem
                key={`${item.surahId}-${item.nomorAyat}`}
                item={item}
                onPress={handleBookmarkPress}
                onRemove={handleRemoveBookmark}
              />
            ))}
          </View>
        )}

        {pinnedCollections.length > 0 && (
          <View>
            <BookmarkSectionHeader title={t("Pinned Collections")} />
            {pinnedCollections.map((item) => (
              <CollectionItem
                key={item.id}
                item={item}
                onPress={handleCollectionPress}
                onLongPress={handleCollectionLongPress}
              />
            ))}
          </View>
        )}

        {unpinnedCollections.length > 0 && (
          <View>
            <BookmarkSectionHeader title={t("Collections")} />
            {unpinnedCollections.map((item) => (
              <CollectionItem
                key={item.id}
                item={item}
                onPress={handleCollectionPress}
                onLongPress={handleCollectionLongPress}
              />
            ))}
          </View>
        )}

        {!hasAnyContent && (
          <EmptyBookmarkState onCreateCollection={handleCreateCollection} />
        )}
      </ScrollView>

      <BottomTabBar active="bookmark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default BookmarkScreen;
