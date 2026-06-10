import { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../store/useAppStore";
import { sortCollectionsByPin } from "../utils/bookmarkHelpers";

export const useBookmarkScreen = () => {
  const navigation = useNavigation<any>();
  const { bookmarks, collections, removeBookmark } = useAppStore();

  const { pinned: pinnedCollections, unpinned: unpinnedCollections } = useMemo(
    () => sortCollectionsByPin(collections),
    [collections]
  );

  const handleBookmarkPress = (surahId: number, nomorAyat: number) => {
    navigation.navigate("SurahDetail", {
      surahId,
      nomorAyat,
    });
  };

  const handleRemoveBookmark = (surahId: number, nomorAyat: number) => {
    removeBookmark(surahId, nomorAyat);
  };

  const handleCollectionPress = (collectionId: string, collectionName: string) => {
    navigation.navigate("CollectionDetail", {
      collectionId,
      collectionName,
    });
  };

  const hasAnyContent = bookmarks.length > 0 || collections.length > 0;

  return {
    bookmarks,
    pinnedCollections,
    unpinnedCollections,
    hasAnyContent,
    handleBookmarkPress,
    handleRemoveBookmark,
    handleCollectionPress,
  };
};