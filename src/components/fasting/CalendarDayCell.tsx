import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { hexToRGBA, isToday } from "../../utils/calendarHelpers";
import { CalendarDay } from "../../types/quran.types";
import { getFastingEvent, getIslamicEvent } from "../../utils/fastingHelpers";
import { COLORS } from "../../constants/calendar.constants";

interface CalendarDayCellProps {
  day: CalendarDay;
  currentMonth: number;
  currentYear: number;
  onPress: (day: CalendarDay) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  currentMonth,
  currentYear,
  onPress,
}) => {
  const today = new Date();
  const isTodayDate = isToday(day.day, currentMonth, currentYear, today);
  
  const fastingEvent = getFastingEvent(
    day.dayOfWeek,
    day.hijriDay,
    day.hijriMonthNumber
  );
  const islamicEvent = getIslamicEvent(day.hijriDay, day.hijriMonthNumber);
  const hasEvent = !!(fastingEvent || islamicEvent);

  const cellStyle = [
    styles.dayCell,
    fastingEvent && {
      backgroundColor: hexToRGBA(fastingEvent.color, 0.18),
      borderLeftWidth: 3,
      borderLeftColor: fastingEvent.color,
    },
    isTodayDate && styles.todayCell,
  ];

  return (
    <TouchableOpacity
      style={cellStyle}
      activeOpacity={0.8}
      onPress={() => hasEvent && onPress(day)}
      disabled={!hasEvent}
    >
      {islamicEvent && <View style={styles.dot} />}
      
      <Text
        style={[
          styles.dayNumber,
          fastingEvent && { color: fastingEvent.color },
        ]}
      >
        {day.day}
      </Text>
      
      <Text style={styles.hijriText}>{day.hijriDay}</Text>
      
      {fastingEvent && (
        <Text
          numberOfLines={1}
          style={[styles.eventLabel, { color: fastingEvent.color }]}
        >
          {fastingEvent.label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    borderColor: COLORS.PRIMARY,
  },
  dayNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  hijriText: {
    color: COLORS.PRIMARY,
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
});