import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { PRAYER_COLORS } from "../../constants/prayer.constants";
import { useTranslation } from "react-i18next";

interface NotificationSettingsProps {
  isReminderActive: boolean;
  isPreNotificationActive: boolean;
  onReminderToggle: () => void;
  onPreNotificationToggle: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isReminderActive,
  isPreNotificationActive,
  onReminderToggle,
  onPreNotificationToggle,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("Notification Settings")}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>{t("Prayer Reminders")}</Text>
        <Switch
          value={isReminderActive}
          onValueChange={onReminderToggle}
          trackColor={{ false: "#3E4462", true: PRAYER_COLORS.PRIMARY }}
          thumbColor={PRAYER_COLORS.TEXT_PRIMARY}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t("15 min before notification")}</Text>
        <Switch
          value={isPreNotificationActive}
          onValueChange={onPreNotificationToggle}
          trackColor={{ false: "#3E4462", true: PRAYER_COLORS.PRIMARY }}
          thumbColor={PRAYER_COLORS.TEXT_PRIMARY}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: PRAYER_COLORS.CARD_BG,
    padding: 20,
    borderRadius: 15,
  },
  title: {
    color: PRAYER_COLORS.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    color: PRAYER_COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
});