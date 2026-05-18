import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Switch, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useAppStore } from "../store/useAppStore";
import { Settings, Bell, Clock } from "lucide-react-native";

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
  const [isLoading, setIsLoading] = useState(false);

  // Efek untuk mengambil data saat pertama kali screen dimuat
  useEffect(() => {
    getPrayer();
  }, []);

  // PENTING: Jalankan ulang scheduleNotif setiap kali user mengubah switch reminder / pre-notif
  useEffect(() => {
    if (prayerTimes) {
      scheduleNotif(prayerTimes);
    }
  }, [isReminderActive, isPreNotificationActive, prayerTimes]);

  const getPrayer = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPrayerData(null, "Akses Lokasi Ditolak");
        setIsLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = loc.coords;

      setLocation(latitude, longitude);

      // 1. REVERSE GEOCODING: Menerjemahkan koordinat menjadi nama Kota & Negara (Bisa untuk seluruh dunia)
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      let dynamicLocationName = "Unknown Location";
      
      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        // Menggabungkan nama Kota/Region dan Negara
        dynamicLocationName = `${place.city || place.region || "Unknown City"}, ${place.country}`;
      }

      // 2. FETCH API ALADHAN: Menggunakan method 11 (Kemenag) khusus jika di Indonesia, atau otomatis menyesuaikan zona waktu dunia
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=11`,
      );

      const json = await res.json();

      if (json.code === 200 && json.data) {
        // Simpan data hasil fetch dan nama lokasi yang dinamis ke Zustand
        setPrayerData(json.data.timings, dynamicLocationName);
      }
    } catch (error) {
      console.error("Gagal memuat data jadwal sholat:", error);
    } finally {
      setIsLoading(false);
    }
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
      if (!timings[key]) continue;
      
      const date = parse(timings[key]);
      const diff = date.getTime() - Date.now();
      
      if (diff > 0) {
        const seconds = Math.floor(diff / 1000);
        
        // Notifikasi Tepat Waktu Sholat
        await Notifications.scheduleNotificationAsync({
          content: { 
            title: `Waktunya Sholat ${key}`,
            body: `Mari tunaikan ibadah sholat ${key} untuk wilayah ${locationName}.`
          },
          trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
        });

        // Notifikasi 15 Menit Sebelum
        if (isPreNotificationActive) {
          const beforeSeconds = seconds - 15 * 60;
          if (beforeSeconds > 0) {
            await Notifications.scheduleNotificationAsync({
              content: { 
                title: `15 Menit Lagi Sholat ${key}`,
                body: `Bersiap-siap, waktu sholat ${key} akan segera tiba.`
              },
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
      if (!prayerTimes[key]) continue;
      const [h, m] = prayerTimes[key].split(" ")[0].split(":");
      const t = new Date();
      t.setHours(parseInt(h));
      t.setMinutes(parseInt(m));
      t.setSeconds(0);
      if (t > now) return { name: key, time: t };
    }
    return null;
  };

  useEffect(() => {
    const i = setInterval(() => {
      const next = getNext();
      if (!next) {
        setCountdown("Selesai (Isya)");
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
        <TouchableOpacity style={styles.iconButton} onPress={getPrayer}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Settings color="white" size={24} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Card (Next Prayer) */}
        <View style={styles.todayCard}>
          <View style={styles.cardRow}>
            <Clock color="white" size={20} opacity={0.7} />
            <Text style={styles.todayLabel}>Next Prayer</Text>
          </View>
          <Text style={styles.mainTimeText}>{nextPrayer?.name || "---"}</Text>
          <Text style={styles.countdownText}>{nextPrayer ? `-${countdown}` : "Menunggu Data"}</Text>
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
  container: { flex: 1, backgroundColor: "#0B1535" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  iconButton: { padding: 5 },
  content: { paddingHorizontal: 20, paddingBottom: 30 },
  todayCard: { backgroundColor: "#A44AFF", borderRadius: 20, padding: 20, marginBottom: 20, elevation: 10 },
  cardRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  todayLabel: { color: "white", marginLeft: 8, fontSize: 16, opacity: 0.9 },
  mainTimeText: { color: "white", fontSize: 32, fontWeight: "bold" },
  countdownText: { color: "white", fontSize: 18, fontWeight: "500", marginTop: 4 },
  locationText: { color: "white", opacity: 0.7, marginTop: 15, fontSize: 14 },
  prayerCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#121931", padding: 20, borderRadius: 15, marginBottom: 12 },
  activeCard: { backgroundColor: "#1F2C52", borderColor: "#38A3E5", borderWidth: 1.5 },
  prayerInfo: { flexDirection: "row", alignItems: "center" },
  prayerName: { color: "white", fontSize: 18, fontWeight: "bold" },
  prayerStatus: { color: "#8D92A3", fontSize: 13 },
  timeText: { color: "white", fontSize: 18, fontWeight: "bold" },
  settingsSection: { marginTop: 20, backgroundColor: "#121931", padding: 20, borderRadius: 15 },
  settingsTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  settingLabel: { color: "#8D92A3", fontSize: 14 },
});

export default PrayerTimesScreen;