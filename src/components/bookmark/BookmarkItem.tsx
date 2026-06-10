import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { COLORS, BOOKMARK_COLORS } from "../../constants/colors";
import { BookmarkItem as BookmarkItemType } from "../../types/quran.types";

interface BookmarkItemProps {
  item: BookmarkItemType;
  onPress: (surahId: number, nomorAyat: number) => void;
  onRemove: (surahId: number, nomorAyat: number) => void;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  item,
  onPress,
  onRemove,
}) => {
  const handlePress = () => {
    onPress(item.surahId, item.nomorAyat);
  };

  const handleRemove = () => {
    onRemove(item.surahId, item.nomorAyat);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.surahName}>{item.surahName}</Text>
            <Text style={styles.ayahNumber}>
              {" "}
              • Ayah No {item.nomorAyat}
            </Text>
          </View>
          {item.ayahText && (
            <Text style={styles.arabicText} numberOfLines={2}>
              {item.ayahText}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={handleRemove}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Bookmark
          color={COLORS.PRIMARY}
          size={24}
          fill={COLORS.PRIMARY}
          strokeWidth={2}
        />
      </TouchableOpacity>
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
    backgroundColor: "rgba(26, 40, 68, 0.4)",
  },
  content: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  surahName: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  ayahNumber: {
    color: COLORS.SECONDARY,
    fontSize: 14,
  },
  arabicText: {
    color: COLORS.SECONDARY,
    fontSize: 12,
    marginTop: 5,
    lineHeight: 18,
  },
});