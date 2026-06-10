import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useAppStore } from "../store/useAppStore";
import MainTabNavigator from "../components/MainTabNavigator";
import {
  PrayerHeader,
  TodayPrayerCard,
  PrayerTimeItem,
  NotificationSettings,
} from "../components/prayer";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import { usePrayerCountdown } from "../hooks/usePrayerCountdown";
import { usePrayerNotifications } from "../hooks/usePrayerNotifications";
import { PRAYER_KEYS, PRAYER_COLORS } from "../constants/prayer.constants";
import { formatPrayerTime } from "../utils/prayerHelpers";

const PrayerTimesScreen = () => {
  const {
    prayerTimes,
    locationName,
    isReminderActive,
    isPreNotificationActive,
    toggleReminder,
    togglePreNotification,
  } = useAppStore();

  const { fetchPrayerTimes, isLoading } = usePrayerTimes();
  const { countdown, currentPrayer, nextPrayer } = usePrayerCountdown(prayerTimes);
  const { scheduleAllNotifications } = usePrayerNotifications();

  // Initial data fetch
  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  // Reschedule notifications when settings or prayer times change
  useEffect(() => {
    if (prayerTimes) {
      scheduleAllNotifications(prayerTimes);
    }
  }, [isReminderActive, isPreNotificationActive, prayerTimes, scheduleAllNotifications]);

  const activePrayer = currentPrayer?.name;
  const upcomingPrayer = nextPrayer?.name;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={PRAYER_COLORS.BACKGROUND}
        translucent={false}
      />

      <PrayerHeader onRefresh={fetchPrayerTimes} isLoading={isLoading} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TodayPrayerCard
          nextPrayer={nextPrayer}
          prayerTimes={prayerTimes}
          countdown={countdown}
          locationName={locationName}
        />

        {PRAYER_KEYS.map((key) => (
          <PrayerTimeItem
            key={key}
            name={key}
            time={formatPrayerTime(prayerTimes?.[key] || "")}
            isActive={activePrayer === key}
            isNext={upcomingPrayer === key}
          />
        ))}

        <NotificationSettings
          isReminderActive={isReminderActive}
          isPreNotificationActive={isPreNotificationActive}
          onReminderToggle={toggleReminder}
          onPreNotificationToggle={togglePreNotification}
        />
      </ScrollView>

      <MainTabNavigator active="prayer" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRAYER_COLORS.BACKGROUND,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});

export default PrayerTimesScreen;