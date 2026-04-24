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
import { ArrowLeft, Trash2, Share2, Pin } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useQuranStore } from "../../store/useAppStore";
import BottomTabBar from "../../components/MainTabNavigator";

// Constants
const PRIMARY_COLOR = "#A44AFF";
const ERROR_COLOR = "#FF6B6B";
const TEXT_COLOR = "white";
const SECONDARY_TEXT_COLOR = "#8D92A3";
const BORDER_COLOR = "rgba(42, 58, 90, 0.6)";
const BACKGROUND_COLOR = "#0B1535";
const ITEM_BACKGROUND_COLOR = "rgba(26, 40, 68, 0.4)";
const PIN_COLOR = "#FFD700";

// Types
type AyahItem = {
  surahId: number;
  nomorAyat: number;
  surahName: string;
  ayahText: string;
};

type Collection = {
  id: string;
  name: string;
  isPinned: boolean;
  items?: AyahItem[];
};

const CollectionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { collectionId, collectionName } = route.params;

  const {
    collections,
    removeAyatFromCollection,
    deleteCollection,
    pinCollection,
    unpinCollection,
  } = useQuranStore();

  const collection = collections.find((c) => c.id === collectionId);

  if (!collection || !collection.items) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Collection not found</Text>
      </SafeAreaView>
    );
  }

  const handleRemoveAyah = (surahId: number, nomorAyat: number) => {
    Alert.alert(
      "Remove Ayah",
      "Are you sure you want to remove this ayah from the collection?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeAyatFromCollection(collectionId, surahId, nomorAyat);
          },
        },
      ],
    );
  };

  const handleShare = (item: AyahItem) => {
    const message = `${item.surahName} - Ayah ${item.nomorAyat}\n\n${item.ayahText}`;
    // Implement sharing logic here
    Alert.alert("Share", message);
  };

  const handleNavigateToSurah = (item: AyahItem) => {
    navigation.navigate("SurahDetail", {
      surahId: item.surahId,
      nomorAyat: item.nomorAyat,
    });
  };

  const renderAyahItem = ({ item }: { item: AyahItem }) => (
    <View style={styles.ayahItem}>
      <TouchableOpacity
        style={styles.ayahContent}
        onPress={() => handleNavigateToSurah(item)}
        activeOpacity={0.7}
      >
        <View style={styles.ayahHeader}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.ayahNumber}>Ayah {item.nomorAyat}</Text>
        </View>
        <Text style={styles.ayahText}>{item.ayahText}</Text>
      </TouchableOpacity>
      <View style={styles.ayahActions}>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Share2 color={PRIMARY_COLOR} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemoveAyah(item.surahId, item.nomorAyat)}
        >
          <Trash2 color={ERROR_COLOR} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={TEXT_COLOR} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{collection.name}</Text>
        <View style={styles.headerIcons}>
          {collection.isPinned && (
            <Pin color={PIN_COLOR} size={20} fill={PIN_COLOR} />
          )}
        </View>
      </View>

      {/* Collection Info */}
      <Text style={styles.itemCount}>
        {collection.items?.length || 0} item
        {(collection.items?.length || 0) !== 1 ? "s" : ""}
      </Text>

      {/* Ayahs List */}
      {collection.items && collection.items.length > 0 ? (
        <FlatList
          data={collection.items as AyahItem[]}
          keyExtractor={(item) => `${item.surahId}-${item.nomorAyat}`}
          renderItem={renderAyahItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No ayahs in this collection yet
          </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  headerTitle: {
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 16,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  itemCount: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listContent: {
    paddingVertical: 12,
  },
  ayahItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
    backgroundColor: ITEM_BACKGROUND_COLOR,
  },
  ayahContent: {
    flex: 1,
    marginRight: 12,
  },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  surahName: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  ayahNumber: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 14,
  },
  ayahText: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 13,
    lineHeight: 20,
  },
  ayahActions: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 16,
  },
  errorText: {
    color: TEXT_COLOR,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CollectionDetailScreen;
