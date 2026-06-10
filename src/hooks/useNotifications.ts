import { useState, useEffect, useCallback } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useTranslation } from "react-i18next";
import {
  getNotificationDate,
  getNotificationChannelId,
  getNotificationTitle,
  shouldScheduleWeeklyFasting,
  isWithinNotificationLimit,
} from "../utils/notificationHelpers";
import { getFastingEvent, getIslamicEvent, isSpecialFasting } from "../utils/fastingHelpers";
import { CalendarDay } from "../types/quran.types";
import {
  MAX_NOTIFICATIONS,
  NOTIFICATION_DAYS_LIMIT,
  WEEKLY_NOTIFICATION_DAYS,
} from "../constants/calendar.constants";
import { MONTHS } from "../constants/calendar.constants";

export const useNotifications = () => {
  const { t } = useTranslation();
  const [fastingNotifEnabled, setFastingNotifEnabled] = useState(true);
  const [eventNotifEnabled, setEventNotifEnabled] = useState(true);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [isScheduling, setIsScheduling] = useState(false);

  const requestPermissions = useCallback(async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          t("Notification Permission"),
          t("App needs notification permission to send reminders.")
        );
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("fasting-reminders", {
          name: t("Fasting Reminders"),
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#A855F7",
          sound: "default",
        });

        await Notifications.setNotificationChannelAsync("islamic-events", {
          name: t("Important Islamic Days"),
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#10B981",
          sound: "default",
        });
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  }, [t]);

  const scheduleAllNotifications = useCallback(async (
    calendarData: Record<number, CalendarDay[]>
  ) => {
    try {
      setIsScheduling(true);
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!fastingNotifEnabled && !eventNotifEnabled) {
        setScheduledCount(0);
        return;
      }

      let count = 0;
      const now = new Date();

      for (const monthIndex of Object.keys(calendarData)) {
        const days = calendarData[Number(monthIndex)];

        for (const day of days) {
          if (count >= MAX_NOTIFICATIONS) break;

          const eventDate = new Date(day.year, day.month - 1, day.day);
          if (eventDate <= now) continue;

          const notifDate = getNotificationDate(eventDate, true);
          if (notifDate <= now) continue;

          const diffSeconds = Math.floor((notifDate.getTime() - now.getTime()) / 1000);
          
          if (!isWithinNotificationLimit(diffSeconds, NOTIFICATION_DAYS_LIMIT)) continue;

          const fastingEvent = getFastingEvent(
            day.dayOfWeek,
            day.hijriDay,
            day.hijriMonthNumber
          );
          const islamicEvent = getIslamicEvent(day.hijriDay, day.hijriMonthNumber);

          // Schedule fasting notification
          if (fastingNotifEnabled && fastingEvent) {
            const isSpecial = isSpecialFasting(fastingEvent);
            const shouldSchedule = isSpecial || shouldScheduleWeeklyFasting(diffSeconds);

            if (shouldSchedule && count < MAX_NOTIFICATIONS) {
              try {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: getNotificationTitle('fasting', fastingEvent.description, true),
                    body: isSpecial
                      ? `${t("Don't forget to make the intention for fasting tonight")}. ${t("Tomorrow")} ${day.day} ${t(MONTHS[day.month - 1])} ${day.year} ${t("is the day")} ${fastingEvent.description}.`
                      : `${t("Don't forget to make the intention for fasting")} ${fastingEvent.label} ${t("tonight")}.`,
                    data: { type: "fasting", date: day.date },
                    sound: "default",
                    ...(Platform.OS === "android" && { channelId: "fasting-reminders" }),
                  },
                  trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: diffSeconds },
                });
                count++;
              } catch (e) {
                console.error("Error scheduling fasting notif:", e);
              }
            }
          }

          // Schedule Islamic event notification
          if (eventNotifEnabled && islamicEvent && count < MAX_NOTIFICATIONS) {
            try {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: getNotificationTitle('event', islamicEvent.label, true),
                  body: `${islamicEvent.description}. ${t("Tomorrow")} ${day.day} ${t(MONTHS[day.month - 1])} ${day.year}.`,
                  data: { type: "event", date: day.date, hijriDate: islamicEvent.hijriDate },
                  sound: "default",
                  ...(Platform.OS === "android" && { channelId: "islamic-events" }),
                },
                trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: diffSeconds },
              });
              count++;

              // Schedule morning notification on the day
              const onDayNotif = getNotificationDate(eventDate, false);
              const onDayDiffSeconds = Math.floor((onDayNotif.getTime() - now.getTime()) / 1000);

              if (onDayDiffSeconds > 0 && count < MAX_NOTIFICATIONS) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: getNotificationTitle('event', islamicEvent.label, false),
                    body: `${t("Happy to commemorate")} ${islamicEvent.label}! ${islamicEvent.description}.`,
                    data: { type: "event", date: day.date, hijriDate: islamicEvent.hijriDate },
                    sound: "default",
                    ...(Platform.OS === "android" && { channelId: "islamic-events" }),
                  },
                  trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: onDayDiffSeconds },
                });
                count++;
              }
            } catch (e) {
              console.error("Error scheduling event notif:", e);
            }
          }
        }
      }

      setScheduledCount(count);
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    } finally {
      setIsScheduling(false);
    }
  }, [fastingNotifEnabled, eventNotifEnabled, t]);

  return {
    fastingNotifEnabled,
    setFastingNotifEnabled,
    eventNotifEnabled,
    setEventNotifEnabled,
    scheduledCount,
    isScheduling,
    requestPermissions,
    scheduleAllNotifications,
  };
};