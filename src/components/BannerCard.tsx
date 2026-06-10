import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AnimatedQuran } from "./SurahAssets";
import { COLORS } from "../constants/colors";
import { useTranslation } from "react-i18next";

type Props = {
  juzId: number;
};

export const BannerCard: React.FC<Props> = ({ juzId }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.bannerCard}>
      <Text style={styles.bannerTitle}>
        {t("Juz")} {juzId}
      </Text>
      <View style={styles.divider} />
      <AnimatedQuran />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    margin: 20,
    padding: 25,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 20,
    alignItems: "center",
  },
  bannerTitle: {
    color: COLORS.TEXT,
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "80%",
    marginVertical: 15,
  },
});