import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  Switch,
  Alert,
} from "react-native";
import MainTabNavigator from "../components/MainTabNavigator";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";

import { X, Bell, BellOff } from "lucide-react-native";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface CalendarDay {
  date: string;
  day: number;
  month: number;
  year: number;
  hijriDay: string;
  hijriMonth: string;
  hijriMonthNumber: number;
  hijriYear: string;
  dayOfWeek: number;
}

interface IslamicEvent {
  label: string;
  description: string;
  hijriDate: string;
}

interface FastingEvent {
  label: string;
  color: string;
  description: string;
}

interface SelectedEvent {
  islamicEvent: IslamicEvent | null;
  fastingEvent: FastingEvent | null;
  gregorianDate: string;
}

interface UpcomingNotification {
  type: "fasting" | "event";
  title: string;
  body: string;
  date: Date;
  identifier: string;
}

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const weekdays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const FastingScreen = () => {
  const defaultYear = new Date().getFullYear();
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [calendarData, setCalendarData] = useState<
    Record<number, CalendarDay[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  // Notification states
  const [fastingNotifEnabled, setFastingNotifEnabled] = useState(true);
  const [eventNotifEnabled, setEventNotifEnabled] = useState(true);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    requestNotificationPermissions();
    fetchCalendar();
  }, [selectedYear]);

  // Schedule notifications when calendar data or toggles change
  useEffect(() => {
    if (Object.keys(calendarData).length > 0) {
      scheduleAllNotifications();
    }
  }, [calendarData, fastingNotifEnabled, eventNotifEnabled]);

  const requestNotificationPermissions = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Izin Notifikasi",
          "Aplikasi membutuhkan izin notifikasi untuk mengirimkan pengingat puasa dan hari besar Islam.",
          [{ text: "OK" }],
        );
      }

      // Set notification channel for Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("fasting-reminders", {
          name: "Pengingat Puasa",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#A855F7",
          sound: "default",
        });

        await Notifications.setNotificationChannelAsync("islamic-events", {
          name: "Hari Besar Islam",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#10B981",
          sound: "default",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
    }
  };

  const getFastingEvent = (
    dayOfWeek: number,
    hijriDay: string,
    hijriMonthNumber: number,
  ): FastingEvent | null => {
    if (dayOfWeek === 1) {
      return {
        label: "Senin",
        color: "#3B82F6",
        description: "Puasa Sunnah Senin",
      };
    }

    if (dayOfWeek === 4) {
      return {
        label: "Kamis",
        color: "#3B82F6",
        description: "Puasa Sunnah Kamis",
      };
    }

    if (["13", "14", "15"].includes(hijriDay)) {
      return {
        label: "Ayyamul",
        color: "#10B981",
        description: "Puasa Ayyamul Bidh (Hari Putih)",
      };
    }

    if (hijriMonthNumber === 1 && hijriDay === "10") {
      return {
        label: "Asyura",
        color: "#EF4444",
        description: "Puasa Hari Asyura - Sangat Utama",
      };
    }

    if (hijriMonthNumber === 12 && hijriDay === "9") {
      return {
        label: "Arafah",
        color: "#EF4444",
        description: "Puasa Hari Arafah - Sangat Utama",
      };
    }

    if (hijriMonthNumber === 9) {
      return {
        label: "Ramadan",
        color: "#FBBF24",
        description: "Puasa Wajib Ramadan",
      };
    }

    return null;
  };

  const getIslamicEvent = (
    hijriDay: string,
    hijriMonthNumber: number,
  ): IslamicEvent | null => {
    if (hijriMonthNumber === 1 && hijriDay === "1") {
      return {
        label: "Tahun Baru Islam",
        description: "1 Muharram - Tahun Baru Hijriah",
        hijriDate: "1 Muharram",
      };
    }

    if (hijriMonthNumber === 1 && hijriDay === "10") {
      return {
        label: "Hari Asyura",
        description:
          "10 Muharram - Hari Raya untuk kaum Yahudi dan kami diperintahkan berpuasa",
        hijriDate: "10 Muharram",
      };
    }

    if (hijriMonthNumber === 3 && hijriDay === "12") {
      return {
        label: "Maulid Nabi Muhammad",
        description: "Kelahiran Nabi Muhammad SAW - 12 Rabiul Awal",
        hijriDate: "12 Rabiul Awal",
      };
    }

    if (hijriMonthNumber === 7 && hijriDay === "27") {
      return {
        label: "Isra Miraj",
        description: "Perjalanan Isra Miraj Nabi Muhammad SAW - 27 Rajab",
        hijriDate: "27 Rajab",
      };
    }

    if (hijriMonthNumber === 8 && hijriDay === "15") {
      return {
        label: "Nisfu Syaban",
        description: "Malam Nisfu Syaban - Malam Puasa Sunnah - 15 Syaban",
        hijriDate: "15 Syaban",
      };
    }

    if (hijriMonthNumber === 9 && hijriDay === "1") {
      return {
        label: "Awal Ramadan",
        description: "Awal bulan puasa Ramadan - 1 Ramadan",
        hijriDate: "1 Ramadan",
      };
    }

    if (hijriMonthNumber === 9 && hijriDay === "17") {
      return {
        label: "Nuzulul Quran",
        description: "Turunnya Al-Quran kepada Nabi Muhammad SAW - 17 Ramadan",
        hijriDate: "17 Ramadan",
      };
    }

    if (hijriMonthNumber === 9 && hijriDay === "27") {
      return {
        label: "Lailatul Qadar",
        description: "Malam Kemuliaan - Malam turunnya Al-Quran - 27 Ramadan",
        hijriDate: "27 Ramadan",
      };
    }

    if (hijriMonthNumber === 10 && hijriDay === "1") {
      return {
        label: "Idul Fitri",
        description: "Hari Raya Idul Fitri - Lebaran - 1 Syawal",
        hijriDate: "1 Syawal",
      };
    }

    if (hijriMonthNumber === 12 && hijriDay === "10") {
      return {
        label: "Idul Adha",
        description: "Hari Raya Idul Adha - Hari Raya Kurban - 10 Dzulhijjah",
        hijriDate: "10 Dzulhijjah",
      };
    }

    return null;
  };

  // Schedule all notifications
  const scheduleAllNotifications = async () => {
    try {
      setIsScheduling(true);

      // Cancel all previous notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!fastingNotifEnabled && !eventNotifEnabled) {
        setScheduledCount(0);
        setIsScheduling(false);
        return;
      }

      let count = 0;
      const now = new Date();

      // Go through all calendar data
      for (const monthIndex of Object.keys(calendarData)) {
        const days = calendarData[Number(monthIndex)];

        for (const day of days) {
          const eventDate = new Date(day.year, day.month - 1, day.day);

          // Only schedule for future dates
          if (eventDate <= now) continue;

          // Calculate notification time (previous day at 20:00 / 8PM)
          const notifDate = new Date(eventDate);
          notifDate.setDate(notifDate.getDate() - 1);
          notifDate.setHours(20, 0, 0, 0);

          // Skip if notification date is in the past
          if (notifDate <= now) continue;

          const diffMs = notifDate.getTime() - now.getTime();
          const diffSeconds = Math.floor(diffMs / 1000);

          // Expo limit: max 64 notifications at a time
          if (count >= 60) break;

          // Skip if too far in future (more than 30 days)
          if (diffSeconds > 30 * 24 * 60 * 60) continue;

          const fastingEvent = getFastingEvent(
            day.dayOfWeek,
            day.hijriDay,
            day.hijriMonthNumber,
          );

          const islamicEvent = getIslamicEvent(
            day.hijriDay,
            day.hijriMonthNumber,
          );

          // Schedule fasting notification
          if (fastingNotifEnabled && fastingEvent) {
            // Don't notify for regular Monday/Thursday (too frequent)
            // Only notify for special fasting days
            const isSpecialFasting =
              fastingEvent.label !== "Senin" && fastingEvent.label !== "Kamis";

            if (isSpecialFasting) {
              try {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: `🌙 Besok: ${fastingEvent.description}`,
                    body: `Jangan lupa niat puasa malam ini. Besok ${day.day} ${months[day.month - 1]} ${day.year} adalah hari ${fastingEvent.description}.`,
                    data: {
                      type: "fasting",
                      date: day.date,
                    },
                    sound: "default",
                    ...(Platform.OS === "android" && {
                      channelId: "fasting-reminders",
                    }),
                  },
                  trigger: {
                    type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: diffSeconds,
                  },
                });
                count++;
              } catch (e) {
                console.log("Error scheduling fasting notif:", e);
              }
            }

            // For Monday/Thursday, only schedule for the coming week
            if (!isSpecialFasting && diffSeconds < 7 * 24 * 60 * 60) {
              try {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: `🌙 Besok: ${fastingEvent.description}`,
                    body: `Jangan lupa niat puasa ${fastingEvent.label} malam ini.`,
                    data: {
                      type: "fasting",
                      date: day.date,
                    },
                    sound: "default",
                    ...(Platform.OS === "android" && {
                      channelId: "fasting-reminders",
                    }),
                  },
                  trigger: {
                    type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: diffSeconds,
                  },
                });
                count++;
              } catch (e) {
                console.log("Error scheduling weekly fasting notif:", e);
              }
            }
          }

          // Schedule Islamic event notification
          if (eventNotifEnabled && islamicEvent) {
            try {
              // Notification the day before at 20:00
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: `📿 Besok: ${islamicEvent.label}`,
                  body: `${islamicEvent.description}. Besok ${day.day} ${months[day.month - 1]} ${day.year}.`,
                  data: {
                    type: "event",
                    date: day.date,
                    hijriDate: islamicEvent.hijriDate,
                  },
                  sound: "default",
                  ...(Platform.OS === "android" && {
                    channelId: "islamic-events",
                  }),
                },
                trigger: {
                  type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                  seconds: diffSeconds,
                },
              });
              count++;

              // Also schedule notification on the day itself at 05:00
              const onDayNotif = new Date(eventDate);
              onDayNotif.setHours(5, 0, 0, 0);
              const onDayDiffMs = onDayNotif.getTime() - now.getTime();
              const onDayDiffSeconds = Math.floor(onDayDiffMs / 1000);

              if (onDayDiffSeconds > 0 && count < 60) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: `🕌 Hari Ini: ${islamicEvent.label}`,
                    body: `Selamat memperingati ${islamicEvent.label}! ${islamicEvent.description}.`,
                    data: {
                      type: "event",
                      date: day.date,
                      hijriDate: islamicEvent.hijriDate,
                    },
                    sound: "default",
                    ...(Platform.OS === "android" && {
                      channelId: "islamic-events",
                    }),
                  },
                  trigger: {
                    type: SchedulableTriggerInputTypes.TIME_INTERVAL,
                    seconds: onDayDiffSeconds,
                  },
                });
                count++;
              }
            } catch (e) {
              console.log("Error scheduling event notif:", e);
            }
          }
        }

        if (count >= 60) break;
      }

      setScheduledCount(count);
      console.log(`Scheduled ${count} notifications`);
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const allMonths: Record<number, CalendarDay[]> = {};

      await Promise.all(
        Array.from({ length: 12 }, async (_, monthIndex) => {
          try {
            const response = await fetch(
              `https://api.aladhan.com/v1/gToHCalendar/${monthIndex + 1}/${selectedYear}`,
            );

            const result = await response.json();

            const days: CalendarDay[] = result.data.map((item: any) => {
              const dateStr = item.gregorian.date;
              const [day, month, year] = dateStr.split("-").map(Number);
              const dateObj = new Date(year, month - 1, day);

              return {
                date: dateStr,
                day: day,
                month: month,
                year: year,
                dayOfWeek: dateObj.getDay(),
                hijriDay: item.hijri.day,
                hijriMonth: item.hijri.month.en,
                hijriMonthNumber: item.hijri.month.number,
                hijriYear: item.hijri.year,
              };
            });

            allMonths[monthIndex] = days;
          } catch (err) {
            console.log(`Error fetching month ${monthIndex + 1}:`, err);
          }
        }),
      );

      setCalendarData(allMonths);
    } catch (error) {
      console.log("Error fetching calendar:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFirstDay = (monthIndex: number) => {
    return new Date(selectedYear, monthIndex, 1).getDay();
  };

  const hexToRGBA = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const renderMonth = () => {
    const days = calendarData[selectedMonth] || [];
    const cells = [];
    const firstDay = getFirstDay(selectedMonth);

    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View
          key={`empty-${i}`}
          style={[styles.dayCell, { backgroundColor: "transparent" }]}
        />,
      );
    }

    for (const item of days) {
      const fastingEvent = getFastingEvent(
        item.dayOfWeek,
        item.hijriDay,
        item.hijriMonthNumber,
      );

      const islamicEvent = getIslamicEvent(
        item.hijriDay,
        item.hijriMonthNumber,
      );

      const isToday =
        item.day === today.getDate() &&
        selectedMonth === today.getMonth() &&
        selectedYear === today.getFullYear();

      cells.push(
        <TouchableOpacity
          key={item.date}
          activeOpacity={0.8}
          style={[
            styles.dayCell,
            fastingEvent && {
              backgroundColor: hexToRGBA(fastingEvent.color, 0.18),
              borderLeftWidth: 3,
              borderLeftColor: fastingEvent.color,
            },
            isToday && styles.todayCell,
          ]}
          onPress={() => {
            if (islamicEvent || fastingEvent) {
              setSelectedEvent({
                islamicEvent: islamicEvent,
                fastingEvent: fastingEvent,
                gregorianDate: item.date,
              });
              setShowModal(true);
            }
          }}
        >
          {islamicEvent && <View style={styles.dot} />}

          <Text
            style={[
              styles.dayNumber,
              fastingEvent && { color: fastingEvent.color },
            ]}
          >
            {item.day}
          </Text>

          <Text style={styles.hijriText}>{item.hijriDay}</Text>

          {fastingEvent && (
            <Text
              numberOfLines={1}
              style={[styles.eventLabel, { color: fastingEvent.color }]}
            >
              {fastingEvent.label}
            </Text>
          )}
        </TouchableOpacity>,
      );
    }

    return cells;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#081226"
          translucent={false}
        />
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Memuat Kalender Islam...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#081226"
        translucent={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Kalender Islam</Text>
          <Text style={styles.subtitle}>Kalender Puasa & Hari Islam</Text>
        </View>

        {/* NOTIFICATION SETTINGS */}
        <View style={styles.notifSection}>
          <Text style={styles.notifSectionTitle}>
            🔔 Pengaturan Notifikasi
          </Text>

          <View style={styles.notifRow}>
            <View style={styles.notifInfo}>
              <Bell color="#FBBF24" size={18} />
              <View style={styles.notifTextContainer}>
                <Text style={styles.notifLabel}>Pengingat Puasa</Text>
                <Text style={styles.notifDesc}>
                  Notifikasi malam sebelum hari puasa
                </Text>
              </View>
            </View>
            <Switch
              value={fastingNotifEnabled}
              onValueChange={setFastingNotifEnabled}
              trackColor={{ false: "#3E4462", true: "#A855F7" }}
              thumbColor="white"
            />
          </View>

          <View style={styles.notifRow}>
            <View style={styles.notifInfo}>
              <Bell color="#10B981" size={18} />
              <View style={styles.notifTextContainer}>
                <Text style={styles.notifLabel}>Hari Besar Islam</Text>
                <Text style={styles.notifDesc}>
                  Notifikasi sebelum hari besar Islam
                </Text>
              </View>
            </View>
            <Switch
              value={eventNotifEnabled}
              onValueChange={setEventNotifEnabled}
              trackColor={{ false: "#3E4462", true: "#A855F7" }}
              thumbColor="white"
            />
          </View>

          {/* Notification Status */}
          <View style={styles.notifStatus}>
            {isScheduling ? (
              <View style={styles.notifStatusRow}>
                <ActivityIndicator size="small" color="#A855F7" />
                <Text style={styles.notifStatusText}>
                  Menjadwalkan notifikasi...
                </Text>
              </View>
            ) : (
              <View style={styles.notifStatusRow}>
                {scheduledCount > 0 ? (
                  <Bell color="#10B981" size={14} />
                ) : (
                  <BellOff color="#EF4444" size={14} />
                )}
                <Text
                  style={[
                    styles.notifStatusText,
                    {
                      color: scheduledCount > 0 ? "#10B981" : "#EF4444",
                    },
                  ]}
                >
                  {scheduledCount > 0
                    ? `${scheduledCount} notifikasi terjadwal`
                    : "Tidak ada notifikasi terjadwal"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* YEAR SELECTOR */}
        <View style={styles.yearSelector}>
          <TouchableOpacity
            onPress={() => {
              setSelectedYear(selectedYear - 1);
              setSelectedMonth(0);
            }}
          >
            <Text style={styles.navButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.yearTitle}>{selectedYear}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedYear(selectedYear + 1);
              setSelectedMonth(0);
            }}
          >
            <Text style={styles.navButton}>›</Text>
          </TouchableOpacity>
        </View>

        {/* LEGEND */}
        <View style={styles.legendContainer}>
          <Legend color="#3B82F6" label="Senin & Kamis" />
          <Legend color="#10B981" label="Ayyamul Bidh" />
          <Legend color="#EF4444" label="Asyura & Arafah" />
          <Legend color="#FBBF24" label="Ramadan" />
          <View style={styles.legendItem}>
            <View style={styles.whiteDot} />
            <Text style={styles.legendText}>Hari Islam Penting</Text>
          </View>
        </View>

        {/* MONTH SELECTOR */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => {
              if (selectedMonth > 0) setSelectedMonth(selectedMonth - 1);
            }}
          >
            <Text style={styles.navButton}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {months[selectedMonth]} {selectedYear}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (selectedMonth < 11) setSelectedMonth(selectedMonth + 1);
            }}
          >
            <Text style={styles.navButton}>›</Text>
          </TouchableOpacity>
        </View>

        {/* WEEK */}
        <View style={styles.weekRow}>
          {weekdays.map((day) => (
            <Text key={day} style={styles.weekText}>
              {day}
            </Text>
          ))}
        </View>

        {/* CALENDAR */}
        <View style={styles.grid}>{renderMonth()}</View>
      </ScrollView>

      {/* MODAL */}
      <Modal transparent animationType="fade" visible={showModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <X size={22} color="white" />
            </TouchableOpacity>

            {selectedEvent && (
              <>
                {selectedEvent.islamicEvent && (
                  <>
                    <View style={styles.modalDot} />
                    <Text style={styles.modalTitle}>
                      {selectedEvent.islamicEvent.label}
                    </Text>
                    <Text style={styles.modalHijri}>
                      {selectedEvent.islamicEvent.hijriDate}
                    </Text>
                    <Text style={styles.modalDesc}>
                      {selectedEvent.islamicEvent.description}
                    </Text>
                  </>
                )}

                {selectedEvent.fastingEvent && (
                  <>
                    {!selectedEvent.islamicEvent && (
                      <View
                        style={[
                          styles.modalDot,
                          {
                            backgroundColor: selectedEvent.fastingEvent.color,
                          },
                        ]}
                      />
                    )}
                    {selectedEvent.islamicEvent && (
                      <Text style={styles.modalDivider}>
                        ──────────────────
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.modalTitle,
                        { color: selectedEvent.fastingEvent.color },
                      ]}
                    >
                      {selectedEvent.fastingEvent.label}
                    </Text>
                    <Text style={styles.modalDesc}>
                      {selectedEvent.fastingEvent.description}
                    </Text>
                  </>
                )}

                <Text style={styles.modalGregorian}>
                  {selectedEvent.gregorianDate}
                </Text>

                {/* Notification info in modal */}
                <View style={styles.modalNotifInfo}>
                  <Bell color="#A855F7" size={14} />
                  <Text style={styles.modalNotifText}>
                    {fastingNotifEnabled || eventNotifEnabled
                      ? "Notifikasi akan dikirim malam sebelumnya (20:00)"
                      : "Notifikasi dimatikan"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.closeModalText}>Tutup</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <MainTabNavigator active="fasting" />
    </SafeAreaView>
  );
};

const Legend = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendColor, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{label}</Text>
  </View>
);

export default FastingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081226",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  loading: {
    flex: 1,
    backgroundColor: "#081226",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  loadingText: {
    color: "white",
    marginTop: 12,
  },

  header: {
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 6,
  },

  // Notification styles
  notifSection: {
    marginHorizontal: 20,
    backgroundColor: "rgba(17, 28, 52, 0.8)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.2)",
  },

  notifSectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },

  notifRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  notifInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  notifTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  notifLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  notifDesc: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },

  notifStatus: {
    borderTopWidth: 1,
    borderTopColor: "rgba(168, 85, 247, 0.15)",
    paddingTop: 12,
    marginTop: 4,
  },

  notifStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  notifStatusText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "500",
  },

  yearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  yearTitle: {
    color: "#A855F7",
    fontSize: 20,
    fontWeight: "bold",
  },

  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  legendItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },

  whiteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    marginRight: 8,
  },

  legendText: {
    color: "#CBD5E1",
    fontSize: 12,
  },

  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  navButton: {
    color: "#A855F7",
    fontSize: 34,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },

  monthTitle: {
    color: "#A855F7",
    fontSize: 24,
    fontWeight: "bold",
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 14,
  },

  weekText: {
    width: "14.28%",
    textAlign: "center",
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginBottom: 40,
  },

  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    backgroundColor: "#111C34",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },

  todayCell: {
    borderWidth: 2,
    borderColor: "#A855F7",
  },

  dayNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  hijriText: {
    color: "#A855F7",
    fontSize: 9,
    marginTop: 2,
    fontWeight: "600",
  },

  eventLabel: {
    fontSize: 7,
    fontWeight: "700",
    marginTop: 2,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    position: "absolute",
    top: 5,
    right: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "82%",
    backgroundColor: "#172554",
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  modalDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 16,
  },

  modalTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  modalHijri: {
    color: "#C084FC",
    marginTop: 8,
    fontWeight: "700",
  },

  modalDesc: {
    color: "#CBD5E1",
    marginTop: 14,
    textAlign: "center",
    lineHeight: 22,
  },

  modalGregorian: {
    color: "#94A3B8",
    marginTop: 12,
  },

  modalNotifInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },

  modalNotifText: {
    color: "#C084FC",
    fontSize: 11,
    fontWeight: "500",
  },

  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#A855F7",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },

  closeModalText: {
    color: "white",
    fontWeight: "bold",
  },

  modalDivider: {
    color: "#CBD5E1",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 12,
  },
});