import { CalendarDay } from "../types/quran.types";

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const hexToRGBA = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

export const isToday = (
  day: number,
  month: number,
  year: number,
  currentDate: Date
): boolean => {
  return (
    day === currentDate.getDate() &&
    month === currentDate.getMonth() &&
    year === currentDate.getFullYear()
  );
};

export const formatGregorianDate = (day: CalendarDay): string => {
  return `${day.day}-${day.month}-${day.year}`;
};

export const fetchCalendarMonth = async (
  month: number,
  year: number
): Promise<CalendarDay[]> => {
  const response = await fetch(
    `https://api.aladhan.com/v1/gToHCalendar/${month + 1}/${year}`
  );
  const result = await response.json();

  return result.data.map((item: any) => {
    const dateStr = item.gregorian.date;
    const [day, monthNum, yearNum] = dateStr.split("-").map(Number);
    const dateObj = new Date(yearNum, monthNum - 1, day);

    return {
      date: dateStr,
      day: day,
      month: monthNum,
      year: yearNum,
      dayOfWeek: dateObj.getDay(),
      hijriDay: item.hijri.day,
      hijriMonth: item.hijri.month.en,
      hijriMonthNumber: item.hijri.month.number,
      hijriYear: item.hijri.year,
    };
  });
};