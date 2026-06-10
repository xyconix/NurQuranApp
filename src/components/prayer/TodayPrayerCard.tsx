import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { PRAYER_COLORS } from "../../constants/prayer.constants";
import { PrayerInfo, PrayerTimes } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface TodayPrayerCardProps {
  nextPrayer: PrayerInfo | null;
  prayerTimes: PrayerTimes | null;
  countdown: string;
  locationName: string;
}

export const TodayPrayerCard: React.FC<TodayPrayerCardProps> = ({
  nextPrayer,
  prayerTimes,
  countdown,
  locationName,
}) => {
  const { t } = useTranslation();

  const prayerTime = nextPrayer?.name && prayerTimes?.[nextPrayer.name]
    ? prayerTimes[nextPrayer.name]
    : "";

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Clock color={PRAYER_COLORS.TEXT_PRIMARY} size={20} opacity={0.7} />
        <Text style={styles.label}>
          {nextPrayer?.isCurrent ? t("Currently Running") : t("Next Prayer")}
        </Text>
      </View>
      
      <Text style={styles.mainTime}>{nextPrayer?.name || "---"}</Text>
      <Text style={styles.prayerTime}>{prayerTime}</Text>
      
      <Text style={styles.countdown}>
        {nextPrayer?.isCurrent ? countdown : countdown ? `-${countdown}` : t("Waiting for Data")}
      </Text>
      
      <Text style={styles.location}>{locationName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: PRAYER_COLORS.PRIMARY,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.9,
  },
  mainTime: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    fontSize: 32,
    fontWeight: "bold",
  },
  prayerTime: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    opacity: 0.9,
  },
  countdown: {
    color: PRAYER_COLORS.COUNTDOWN_TEXT,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
  },
  location: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    opacity: 0.7,
    marginTop: 15,
    fontSize: 14,
  },
});