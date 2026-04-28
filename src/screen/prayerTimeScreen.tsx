import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Switch, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useAppStore } from "../store/useAppStore";
import { Settings, Bell, Clock } from "lucide-react-native"; // Pastikan sudah install lucide-react-native

const PrayerTimesScreen = () => {
  const {
    prayerTimes,
    setPrayerData,
    setLocation,
    locationName,
    isReminderActive,
    isPreNotificationActive,
    toggleReminder,
    togglePreNotification,
  } = useAppStore();

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await getPrayer();
  };

  const getPrayer = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    setLocation(latitude, longitude);

    // Menggunakan method 11 (Kemenag RI) untuk akurasi di Indonesia
    const res = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`,
    );

    const json = await res.json();
    setPrayerData(json.data.timings, "Your Location");
    scheduleNotif(json.data.timings);
  };

  const scheduleNotif = async (timings: Record<string, string>) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!isReminderActive) return;

    const parse = (t: string) => {
      const [h, m] = t.split(" ")[0].split(":").map(Number);
      const d = new Date();
      d.setHours(h);
      d.setMinutes(m);
      d.setSeconds(0);
      return d;
    };

    const prayerKeys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    for (let key of prayerKeys) {
      const date = parse(timings[key]);
      const diff = date.getTime() - Date.now();
      
      if (diff > 0) {
        const seconds = Math.floor(diff / 1000);
        await Notifications.scheduleNotificationAsync({
          content: { title: `Waktunya Sholat ${key}` },
          trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
        });

        if (isPreNotificationActive) {
          const beforeSeconds = seconds - 15 * 60;
          if (beforeSeconds > 0) {
            await Notifications.scheduleNotificationAsync({
              content: { title: `15 menit lagi Sholat ${key}` },
              trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: beforeSeconds },
            });
          }
        }
      }
    }
  };

  const getNext = () => {
    if (!prayerTimes) return null;
    const now = new Date();
    for (let key of ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]) {
      const [h, m] = prayerTimes[key].split(" ")[0].split(":");
      const t = new Date();
      t.setHours(parseInt(h));
      t.setMinutes(parseInt(m));
      if (t > now) return { name: key, time: t };
    }
    return null;
  };

  useEffect(() => {
    const i = setInterval(() => {
      const next = getNext();
      if (!next) {
        setCountdown("Selesai");
        return;
      }
      const diff = next.time.getTime() - Date.now();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h > 0 ? h + 'j ' : ''}${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(i);
  }, [prayerTimes]);

  const prayerList = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const nextPrayer = getNext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prayer Times</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Settings color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Card (Next Prayer) */}
        <View style={styles.todayCard}>
          <View style={styles.cardRow}>
            <Clock color="white" size={20} opacity={0.7} />
            <Text style={styles.todayLabel}>Next Prayer</Text>
          </View>
          <Text style={styles.mainTimeText}>{nextPrayer?.name || "Imsak"}</Text>
          <Text style={styles.countdownText}>-{countdown}</Text>
          <Text style={styles.locationText}>{locationName}</Text>
        </View>

        {/* List of Prayer Times */}
        {prayerList.map((key) => {
          const isActive = nextPrayer?.name === key;
          return (
            <View key={key} style={[styles.prayerCard, isActive && styles.activeCard]}>
              <View style={styles.prayerInfo}>
                <Bell color={isActive ? "white" : "#A44AFF"} size={22} fill={isActive ? "white" : "transparent"} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={[styles.prayerName, isActive && { color: "white" }]}>{key}</Text>
                  <Text style={[styles.prayerStatus, isActive && { color: "white", opacity: 0.8 }]}>
                    {isActive ? "Coming up next" : "Reminder active"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.timeText, isActive && { color: "white" }]}>
                {prayerTimes?.[key] || "--:--"}
              </Text>
            </View>
          );
        })}

        {/* Notification Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Notification Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Prayer Reminders</Text>
            <Switch
              value={isReminderActive}
              onValueChange={toggleReminder}
              trackColor={{ false: "#3E4462", true: "#A44AFF" }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>15 min before notification</Text>
            <Switch
              value={isPreNotificationActive}
              onValueChange={togglePreNotification}
              trackColor={{ false: "#3E4462", true: "#A44AFF" }}
              thumbColor="white"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1535", // Deep dark blue
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 5,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  todayCard: {
    backgroundColor: "#A44AFF", // Purple accent
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#A44AFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  todayLabel: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.9,
  },
  mainTimeText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  countdownText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
  },
  locationText: {
    color: "white",
    opacity: 0.7,
    marginTop: 15,
    fontSize: 14,
  },
  prayerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#121931", // Slightly lighter navy
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
  },
  activeCard: {
    backgroundColor: "#1F2C52",
    borderColor: "#38A3E5", // Blue highlight from your image
    borderWidth: 1.5,
  },
  prayerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  prayerName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  prayerStatus: {
    color: "#8D92A3",
    fontSize: 13,
  },
  timeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsSection: {
    marginTop: 20,
    backgroundColor: "#121931",
    padding: 20,
    borderRadius: 15,
  },
  settingsTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  settingLabel: {
    color: "#8D92A3",
    fontSize: 14,
  },
});

export default PrayerTimesScreen;