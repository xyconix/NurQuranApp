import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Share2, Play, Bookmark, Pause } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { AyatSurahItemProps } from "../../types/quran.types";



export const AyatItem: React.FC<AyatSurahItemProps> = ({
  item,
  index,
  language,
  isBookmarked,
  isPlaying,
  isLoadingAudio,
  onShare,
  onPlay,
  onBookmark,
  onBookmarkLongPress,
}) => {
  const translation = language === "en" ? item.teksInggris || item.teksIndonesia : item.teksIndonesia;

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index * 50, 500))}
      style={[styles.ayatContainer, isPlaying && styles.ayatContainerPlaying]}
    >
      <View style={styles.ayatActionBar}>
        <View style={styles.ayatNumberBadge}>
          <Text style={styles.ayatNumberText}>{item.nomorAyat}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onShare} style={styles.actionIcon}>
            <Share2 color={COLORS.PRIMARY} size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlay} style={styles.actionIcon} disabled={isLoadingAudio && isPlaying}>
            {isLoadingAudio && isPlaying ? (
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            ) : isPlaying ? (
              <Pause color={COLORS.PRIMARY} size={20} fill={COLORS.PRIMARY} />
            ) : (
              <Play color={COLORS.PRIMARY} size={20} fill="transparent" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onBookmark}
            onLongPress={onBookmarkLongPress}
            style={styles.actionIcon}
          >
            <Bookmark
              color={COLORS.PRIMARY}
              size={20}
              fill={isBookmarked ? COLORS.PRIMARY : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.arabicText}>{item.teksArab}</Text>
      <Text style={styles.translationText}>{translation}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  ayatContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  ayatContainerPlaying: {
    backgroundColor: "rgba(164, 74, 255, 0.08)",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY,
  },
  ayatActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.ACTION_BAR_BG,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  ayatNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  ayatNumberText: {
    color: COLORS.TEXT,
    fontWeight: "bold",
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  actionIcon: {
    padding: 4,
  },
  arabicText: {
    color: COLORS.TEXT,
    fontSize: 24,
    textAlign: "right",
    fontWeight: "bold",
    marginBottom: 16,
    lineHeight: 45,
  },
  translationText: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    lineHeight: 24,
  },
});