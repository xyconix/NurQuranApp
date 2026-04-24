import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  Folder,
  PlusSquare,
  ListFilter,
  Bookmark,
  Pin,
  ChevronRight,
} from "lucide-react-native";
import { useQuranStore } from "../store/useAppStore";
import { useNavigation } from "@react-navigation/native";
import Header from "./component/Header";
import BottomTabBar from "../components/MainTabNavigator";

// Constants
const PRIMARY_COLOR = "#A44AFF";
const SECONDARY_COLOR = "#8D92A3";
const TEXT_COLOR = "white";
const BACKGROUND_COLOR = "#0B1535";
const ITEM_BACKGROUND_COLOR = "rgba(26, 40, 68, 0.4)";
const BORDER_COLOR = "rgba(42, 58, 90, 0.6)";
const PIN_COLOR = "#FFD700";

// Types
type Collection = {
  id: string;
  name: string;
  isPinned: boolean;
  items?: any[];
};

type BookmarkItem = {
  surahId: number;
  nomorAyat: number;
  surahName: string;
  ayahText: string;
};

const BookmarkScreen = () => {
  const navigation = useNavigation<any>();
  const {
    bookmarks,
    collections,
    removeBookmark,
    deleteCollection,
    pinCollection,
    unpinCollection,
    createCollection,
  } = useQuranStore();

  const pinnedCollections = collections.filter((c) => c.isPinned);
  const unpinnedCollections = collections.filter((c) => !c.isPinned);

  // Collection handlers
  const handleAddCollection = () => {
    Alert.prompt(
      "Create Collection",
      "Enter collection name:",
      (text) => {
        if (text?.trim()) {
          createCollection(text);
          Alert.alert("Success", `Collection "${text}" created!`);
        }
      },
      "plain-text",
      "",
      "default",
    );
  };

  const handleLongPressCollection = (item: Collection) => {
    Alert.alert("Kelola Koleksi", item.name, [
      {
        text: item.isPinned ? "Lepas Pin" : "Pin Koleksi",
        onPress: () =>
          item.isPinned ? unpinCollection(item.id) : pinCollection(item.id),
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => deleteCollection(item.id),
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const handleCollectionOptions = (
    collectionId: string,
    collectionName: string,
  ) => {
    Alert.alert(collectionName, "What would you like to do?", [
      {
        text: "View Ayahs",
        onPress: () =>
          navigation.navigate("CollectionDetail", {
            collectionId,
            collectionName,
          }),
      },
      {
        text: pinnedCollections.some((c) => c.id === collectionId)
          ? "Unpin"
          : "Pin",
        onPress: () => {
          if (pinnedCollections.some((c) => c.id === collectionId)) {
            unpinCollection(collectionId);
          } else {
            pinCollection(collectionId);
          }
        },
      },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert(
            "Delete Collection",
            `Are you sure you want to delete "${collectionName}"? This cannot be undone.`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteCollection(collectionId);
                  Alert.alert("Success", "Collection deleted");
                },
              },
            ],
          );
        },
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  // Render functions
  const renderBookmarkItem = ({ item }: { item: BookmarkItem }) => (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahId: item.surahId,
          nomorAyat: item.nomorAyat,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.surahName}>{item.surahName}</Text>
            <Text style={styles.ayahNumber}> • Ayah {item.nomorAyat}</Text>
          </View>
          <Text style={styles.arabicTextSmall}>{item.ayahText}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => removeBookmark(item.surahId, item.nomorAyat)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Bookmark
          color={PRIMARY_COLOR}
          size={24}
          fill={PRIMARY_COLOR}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCollectionItem = ({ item }: { item: Collection }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() =>
        navigation.navigate("CollectionDetail", {
          collectionId: item.id,
          collectionName: item.name,
        })
      }
      onLongPress={() => handleLongPressCollection(item)}
    >
      <View style={styles.itemLeft}>
        <Folder color={PRIMARY_COLOR} size={28} />
        <View style={styles.textContainer}>
          <View style={styles.collectionHeader}>
            <Text style={styles.collectionName}>{item.name}</Text>
            {item.isPinned && (
              <Pin
                color={PIN_COLOR}
                size={14}
                fill={PIN_COLOR}
                style={styles.pinIcon}
              />
            )}
          </View>
          <Text style={styles.itemCount}>{item.items?.length || 0} items</Text>
        </View>
      </View>
      <ChevronRight color={TEXT_COLOR} size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Bookmarks" />

      {/* Add New Collection Button */}
      <TouchableOpacity style={styles.addSection} onPress={handleAddCollection}>
        <View style={styles.itemLeft}>
          <PlusSquare color={PRIMARY_COLOR} size={28} />
          <Text style={styles.addText}>Add new collection</Text>
        </View>
        <ListFilter color={TEXT_COLOR} size={24} />
      </TouchableOpacity>

      {/* Bookmarks List */}
      {bookmarks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Bookmarked Ayahs</Text>
          <FlatList
            data={bookmarks as BookmarkItem[]}
            keyExtractor={(item) => `${item.surahId}-${item.nomorAyat}`}
            renderItem={renderBookmarkItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Pinned Collections */}
      {pinnedCollections.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pinned Collections</Text>
          <FlatList
            data={pinnedCollections}
            keyExtractor={(item) => item.id}
            renderItem={renderCollectionItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Other Collections */}
      {unpinnedCollections.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Collections</Text>
          <FlatList
            data={unpinnedCollections}
            keyExtractor={(item) => item.id}
            renderItem={renderCollectionItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </>
      )}

      {bookmarks.length === 0 && collections.length === 0 && (
        <View style={styles.emptyState}>
          <Bookmark color={SECONDARY_COLOR} size={48} />
          <Text style={styles.emptyStateText}>
            No bookmarks or collections yet
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={handleAddCollection}
          >
            <Text style={styles.emptyStateButtonText}>Create Collection</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomTabBar active="bookmark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  addSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: "rgba(26, 40, 68, 0.3)",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(164, 74, 255, 0.3)",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  addText: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  bookmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(141, 146, 163, 0.3)",
    backgroundColor: ITEM_BACKGROUND_COLOR,
  },
  surahName: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  ayahNumber: {
    color: SECONDARY_COLOR,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  arabicTextSmall: {
    color: SECONDARY_COLOR,
    fontSize: 12,
    marginTop: 5,
  },
  collectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: "rgba(26, 40, 68, 0.3)",
  },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  collectionName: {
    color: TEXT_COLOR,
    fontSize: 18,
    fontWeight: "600",
  },
  itemCount: {
    color: SECONDARY_COLOR,
    fontSize: 14,
    marginTop: 2,
  },
  pinIcon: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: SECONDARY_COLOR,
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  emptyStateButtonText: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookmarkScreen;
