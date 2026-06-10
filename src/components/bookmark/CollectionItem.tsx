import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Folder, Pin, ChevronRight } from "lucide-react-native";
import { COLORS, BOOKMARK_COLORS } from "../../constants/colors";
import { CollectionBookmark } from "../../types/quran.types";

interface CollectionItemProps {
  item: CollectionBookmark;
  onPress: (collectionId: string, collectionName: string) => void;
  onLongPress: (collection: CollectionBookmark) => void;
}

export const CollectionItem: React.FC<CollectionItemProps> = ({
  item,
  onPress,
  onLongPress,
}) => {
  const handlePress = () => {
    onPress(item.id, item.name);
  };

  const handleLongPress = () => {
    onLongPress(item);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Folder color={COLORS.PRIMARY} size={28} />
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={styles.collectionName}>{item.name}</Text>
            {item.isPinned && (
              <Pin
                color={BOOKMARK_COLORS.PIN}
                size={14}
                fill={BOOKMARK_COLORS.PIN}
                style={styles.pinIcon}
              />
            )}
          </View>
          <Text style={styles.itemCount}>
            {item.items?.length || 0} items
          </Text>
        </View>
      </View>
      <ChevronRight color={COLORS.TEXT} size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: BOOKMARK_COLORS.BOOKMARK_BORDER,
    backgroundColor: BOOKMARK_COLORS.COLLECTION_BG,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  collectionName: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: "600",
  },
  pinIcon: {
    marginLeft: 8,
  },
  itemCount: {
    color: COLORS.SECONDARY,
    fontSize: 14,
    marginTop: 2,
  },
});