import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WEEKDAYS, COLORS } from "../../constants/calendar.constants";

export const CalendarWeekHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      {WEEKDAYS.map((day) => (
        <Text key={day} style={styles.text}>
          {day}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 14,
  },
  text: {
    width: "14.28%",
    textAlign: "center",
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 12,
  },
});