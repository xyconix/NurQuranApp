import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/colors";

export const CollectionLoadingState: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.text}>Loading collection...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.TEXT,
    marginTop: 12,
    fontSize: 16,
  },
});