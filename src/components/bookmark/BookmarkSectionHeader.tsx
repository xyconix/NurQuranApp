import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

interface BookmarkSectionHeaderProps {
  title: string;
}

export const BookmarkSectionHeader: React.FC<BookmarkSectionHeaderProps> = ({ title }) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
});