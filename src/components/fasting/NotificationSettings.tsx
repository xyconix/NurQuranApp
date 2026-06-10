import React from "react";
import { View, Text, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { Bell, BellOff } from "lucide-react-native";
import { COLORS } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface NotificationSettingsProps {
  fastingEnabled: boolean;
  onFastingToggle: (value: boolean) => void;
  eventEnabled: boolean;
  onEventToggle: (value: boolean) => void;
  scheduledCount: number;
  isScheduling: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  fastingEnabled,
  onFastingToggle,
  eventEnabled,
  onEventToggle,
  scheduledCount,
  isScheduling,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 {t("Notification Settings")}</Text>

      <View style={styles.row}>
        <View style={styles.info}>
          <Bell color={COLORS.WARNING} size={18} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{t("Fasting Reminders")}</Text>
            <Text style={styles.desc}>
              {t("Notification the night before fasting day")}
            </Text>
          </View>
        </View>
        <Switch
          value={fastingEnabled}
          onValueChange={onFastingToggle}
          trackColor={{ false: "#3E4462", true: COLORS.PRIMARY }}
          thumbColor="white"
        />
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Bell color={COLORS.SECONDARY} size={18} />
          <View style={styles.textContainer}>
            <Text style={styles.label}>{t("Important Islamic Days")}</Text>
            <Text style={styles.desc}>
              {t("Notification before important Islamic days")}
            </Text>
          </View>
        </View>
        <Switch
          value={eventEnabled}
          onValueChange={onEventToggle}
          trackColor={{ false: "#3E4462", true: COLORS.PRIMARY }}
          thumbColor="white"
        />
      </View>

      <View style={styles.status}>
        {isScheduling ? (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            <Text style={styles.statusText}>
              {t("Scheduling notifications")}...
            </Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            {scheduledCount > 0 ? (
              <Bell color={COLORS.SECONDARY} size={14} />
            ) : (
              <BellOff color={COLORS.ERROR} size={14} />
            )}
            <Text
              style={[
                styles.statusText,
                { color: scheduledCount > 0 ? COLORS.SECONDARY : COLORS.ERROR },
              ]}
            >
              {scheduledCount > 0
                ? `${scheduledCount} ${t("notifications scheduled")}`
                : t("No notifications scheduled")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: COLORS.CARD_BG,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: "600",
  },
  desc: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    marginTop: 2,
  },
  status: {
    borderTopWidth: 1,
    borderTopColor: "rgba(168, 85, 247, 0.15)",
    paddingTop: 12,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});