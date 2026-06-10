import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FolderOpen } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

interface CollectionEmptyStateProps {
  message?: string;
}

export const CollectionEmptyState: React.FC<CollectionEmptyStateProps> = ({
  message = "No ayahs in this collection yet",
}) => {
  return (
    <View style={styles.container}>
      <FolderOpen color={COLORS.SECONDARY} size={64} strokeWidth={1.5} />
      <Text style={styles.title}>Empty Collection</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    color: COLORS.SECONDARY,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});