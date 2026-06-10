import { Platform } from "react-native";
import { NOTIFICATION_TIMES } from "../constants/calendar.constants";

export const getNotificationDate = (eventDate: Date, dayBefore: boolean = true): Date => {
  const notifDate = new Date(eventDate);
  if (dayBefore) {
    notifDate.setDate(notifDate.getDate() - 1);
  }
  notifDate.setHours(
    dayBefore ? NOTIFICATION_TIMES.EVENING : NOTIFICATION_TIMES.MORNING,
    0, 0, 0
  );
  return notifDate;
};

export const getNotificationChannelId = (type: 'fasting' | 'event'): string => {
  return type === 'fasting' ? 'fasting-reminders' : 'islamic-events';
};

export const getNotificationTitle = (
  type: 'fasting' | 'event',
  label: string,
  isTomorrow: boolean = true
): string => {
  const prefix = isTomorrow ? "Tomorrow" : "Today";
  const emoji = type === 'fasting' ? '🌙' : '📿';
  return `${emoji} ${prefix}: ${label}`;
};

export const shouldScheduleWeeklyFasting = (diffSeconds: number): boolean => {
  const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
  return diffSeconds < WEEK_IN_SECONDS;
};

export const isWithinNotificationLimit = (
  diffSeconds: number,
  maxDays: number = 30
): boolean => {
  const maxSeconds = maxDays * 24 * 60 * 60;
  return diffSeconds <= maxSeconds;
};