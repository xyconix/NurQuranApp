import { useMemo, useCallback } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppStore } from "../store/useAppStore";
import { AyahItemCollection } from "../types/quran.types";

export const useCollectionDetail = (collectionId: string) => {
  const navigation = useNavigation<any>();
  const {
    collections,
    removeAyatFromCollection,
    deleteCollection,
    pinCollection,
    unpinCollection,
  } = useAppStore();

  const collection = useMemo(
    () => collections.find((c) => c.id === collectionId),
    [collections, collectionId]
  );

  const items = useMemo<AyahItemCollection[]>(
    () =>
      (collection?.items ?? []).map((item) => ({
        ...item,
        ayahText: item.ayahText ?? "",
      })),
    [collection?.items]
  );

  const handleRemoveAyah = useCallback(
    (item: AyahItemCollection) => {
      Alert.alert(
        "Remove Ayah",
        "Are you sure you want to remove this ayah from the collection?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              removeAyatFromCollection(
                collectionId,
                item.surahId,
                item.nomorAyat
              );
            },
          },
        ]
      );
    },
    [collectionId, removeAyatFromCollection]
  );

  const handleShare = useCallback((item: AyahItemCollection) => {
    const message = `${item.surahName} - Ayah ${item.nomorAyat}\n\n${item.ayahText}`;
    // Implement actual share functionality here
    Alert.alert("Share", message);
  }, []);

  const handleNavigateToSurah = useCallback(
    (item: AyahItemCollection) => {
      navigation.navigate("SurahDetail", {
        surahId: item.surahId,
        nomorAyat: item.nomorAyat,
      });
    },
    [navigation]
  );

  const handleDeleteCollection = useCallback(() => {
    Alert.alert(
      "Delete Collection",
      `Are you sure you want to delete "${collection?.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteCollection(collectionId);
            navigation.goBack();
          },
        },
      ]
    );
  }, [collectionId, collection?.name, deleteCollection, navigation]);

  const handleTogglePin = useCallback(() => {
    if (collection?.isPinned) {
      unpinCollection(collectionId);
    } else {
      pinCollection(collectionId);
    }
  }, [collection?.isPinned, collectionId, pinCollection, unpinCollection]);

  return {
    collection,
    items,
    itemCount: items.length,
    isEmpty: items.length === 0,
    isPinned: collection?.isPinned || false,
    handleRemoveAyah,
    handleShare,
    handleNavigateToSurah,
    handleDeleteCollection,
    handleTogglePin,
    goBack: () => navigation.goBack(),
  };
};
