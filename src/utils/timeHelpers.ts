export const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
  const [h, m] = timeStr.split(" ")[0].split(":").map(Number);
  return { hours: h, minutes: m };
};

export const createDateFromTime = (timeStr: string): Date => {
  const { hours, minutes } = parseTimeString(timeStr);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

export const formatCountdown = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  
  return parts.join(' ');
};

export const getTimeDifference = (targetDate: Date): number => {
  return targetDate.getTime() - Date.now();
};

export const isTimePassed = (timeStr: string): boolean => {
  const prayerTime = createDateFromTime(timeStr);
  return prayerTime.getTime() < Date.now();
};