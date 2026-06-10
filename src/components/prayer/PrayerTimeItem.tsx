import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { PRAYER_COLORS } from "../../constants/prayer.constants";
import { PrayerName } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface PrayerTimeItemProps {
  name: PrayerName;
  time: string;
  isActive: boolean;
  isNext: boolean;
}

export const PrayerTimeItem: React.FC<PrayerTimeItemProps> = ({
  name,
  time,
  isActive,
  isNext,
}) => {
  const { t } = useTranslation();
  const isHighlighted = isActive || isNext;

  return (
    <View style={[styles.container, isHighlighted && styles.highlightedContainer]}>
      <View style={styles.info}>
        <Bell
          color={isHighlighted ? PRAYER_COLORS.TEXT_PRIMARY : PRAYER_COLORS.PRIMARY}
          size={22}
          fill={isHighlighted ? PRAYER_COLORS.TEXT_PRIMARY : "transparent"}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.name, isHighlighted && styles.highlightedText]}>
            {name}
          </Text>
          <Text style={[styles.status, isHighlighted && styles.highlightedStatus]}>
            {isActive
              ? t("Currently running")
              : isNext
                ? t("Next prayer")
                : t("Reminder active")}
          </Text>
        </View>
      </View>
      <Text style={[styles.time, isHighlighted && styles.highlightedText]}>
        {time || "--:--"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PRAYER_COLORS.CARD_BG,
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
  },
  highlightedContainer: {
    backgroundColor: PRAYER_COLORS.ACTIVE_CARD_BG,
    borderColor: PRAYER_COLORS.ACCENT,
    borderWidth: 1.5,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    color: PRAYER_COLORS.TEXT_SECONDARY,
    fontSize: 13,
  },
  time: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
  },
  highlightedText: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
  },
  highlightedStatus: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    opacity: 0.8,
  },
});