import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from "react-native";
import { Volume2 } from "lucide-react-native";
import { QARI_NAMES } from "../../constants/qari";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

interface QariSelectorProps {
  selectedQari: string;
  onSelectQari: (qari: string) => void;
}

export const QariSelector: React.FC<QariSelectorProps> = ({
  selectedQari,
  onSelectQari,
}) => {
  const { t } = useTranslation();

  const showQariSelector = () => {
    const buttons = Object.entries(QARI_NAMES).map(([key, name]) => ({
      text: `${name} ${selectedQari === key ? "✓" : ""}`,
      onPress: () => onSelectQari(key),
    }));
    buttons.push({ text: t("Cancel"), onPress: () => {} });

    Alert.alert(t("Select Qari (Reciter)"), t("Choose a reciter:"), buttons);
  };

  return (
    <TouchableOpacity
      style={styles.qariSelector}
      onPress={showQariSelector}
      activeOpacity={0.7}
    >
      <Volume2 color={COLORS.TEXT} size={16} />
      <Text style={styles.qariText}>{QARI_NAMES[selectedQari]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  qariSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  qariText: {
    color: COLORS.TEXT,
    fontSize: 13,
    fontWeight: "500",
  },
});