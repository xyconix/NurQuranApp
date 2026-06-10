import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { BookOpen, ChevronRight } from "lucide-react-native";
import { AnimatedQuran } from "../SurahAssets";
import { HOME_COLORS, CARD_LAYOUT, DEFAULT_SURAH_NAME, DEFAULT_AYAH_NUMBER } from "../../constants/home.constants";
import { LastRead } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface LastReadCardProps {
  lastRead: LastRead | null;
  onPress: () => void;
}

export const LastReadCard: React.FC<LastReadCardProps> = ({
  lastRead,
  onPress,
}) => {
  const { t } = useTranslation();
  const hasLastRead = !!lastRead;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      disabled={!hasLastRead}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.labelContainer}>
          <BookOpen color={HOME_COLORS.TEXT_PRIMARY} size={14} />
          <Text style={styles.labelText}>{t("Last Read")}</Text>
        </View>
        
        <Text style={styles.surahName} numberOfLines={1}>
          {lastRead?.namaLatin || t(DEFAULT_SURAH_NAME)}
        </Text>
        
        <View style={styles.ayahContainer}>
          <Text style={styles.ayahLabel}>{t("Ayah No")}:</Text>
          <Text style={styles.ayahNumber}>
            {lastRead?.nomorAyat || DEFAULT_AYAH_NUMBER}
          </Text>
        </View>

        <View style={styles.continueContainer}>
          <Text style={styles.continueText}>{t("Continue Reading")}</Text>
          <ChevronRight color={HOME_COLORS.TEXT_PRIMARY} size={16} />
        </View>
      </View>
      
      <View style={styles.illustration}>
        <AnimatedQuran />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    height: CARD_LAYOUT.HEIGHT,
    backgroundColor: HOME_COLORS.CARD_BACKGROUND,
    borderRadius: CARD_LAYOUT.BORDER_RADIUS,
    flexDirection: "row",
    padding: CARD_LAYOUT.PADDING,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  labelText: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.9,
  },
  surahName: {
    color: HOME_COLORS.PINK_ACCENT,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ayahContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  ayahLabel: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 12,
    opacity: 0.8,
  },
  ayahNumber: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
  continueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  continueText: {
    color: HOME_COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.8,
  },
  illustration: {
    position: "absolute",
    right: -10,
    bottom: -10,
    opacity: 0.9,
  },
});