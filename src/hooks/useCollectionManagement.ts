import { useCallback } from "react";
import { Alert, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { CollectionBookmark } from "../types/quran.types";

export const useCollectionManagement = () => {
  const { t } = useTranslation();
  const {
    collections,
    createCollection,
    deleteCollection,
    pinCollection,
    unpinCollection,
  } = useAppStore();

  const handleCreateCollection = useCallback(() => {
    if (Platform.OS === "android") {
      Alert.alert(
        t("Create Collection"),
        t("Collection name will be auto generated."),
        [
          { text: t("Cancel"), style: "cancel" },
          {
            text: t("Create"),
            onPress: () => {
              const collectionName = `Collection ${collections.length + 1}`;
              createCollection(collectionName);
              Alert.alert(
                t("Success"),
                `${t("Collection")} "${collectionName}" ${t("created!")}`,
              );
            },
          },
        ],
      );
    } else {
      Alert.prompt(
        t("Create Collection"),
        t("Enter folder name:"),
        (text) => {
          if (text?.trim()) {
            createCollection(text);
            Alert.alert(
              t("Success"),
              `${t("Collection")} "${text}" ${t("created!")}`,
            );
          }
        },
        "plain-text",
      );
    }
  }, [t, collections.length, createCollection]);

  const handleDeleteCollection = useCallback(
    (collectionId: string, collectionName: string) => {
      Alert.alert(
        t("Confirm Delete"),
        t("Are you sure you want to delete this collection") + ` "${collectionName}"?`,
        [
          { text: t("Cancel"), style: "cancel" },
          {
            text: t("Delete"),
            style: "destructive",
            onPress: () => {
              deleteCollection(collectionId);
              Alert.alert(t("Success"), t("Collection deleted"));
            },
          },
        ],
      );
    },
    [t, deleteCollection]
  );

  const handleTogglePin = useCallback(
    (collection: CollectionBookmark) => {
      if (collection.isPinned) {
        unpinCollection(collection.id);
      } else {
        pinCollection(collection.id);
      }
    },
    [pinCollection, unpinCollection]
  );

  const handleCollectionLongPress = useCallback(
    (collection: CollectionBookmark) => {
      Alert.alert(t("Manage Collection"), collection.name, [
        {
          text: collection.isPinned ? t("Unpin Collection") : t("Pin Collection"),
          onPress: () => handleTogglePin(collection),
        },
        {
          text: t("Delete"),
          style: "destructive",
          onPress: () => handleDeleteCollection(collection.id, collection.name),
        },
        { text: t("Cancel"), style: "cancel" },
      ]);
    },
    [t, handleTogglePin, handleDeleteCollection]
  );

  return {
    collections,
    handleCreateCollection,
    handleDeleteCollection,
    handleTogglePin,
    handleCollectionLongPress,
  };
};