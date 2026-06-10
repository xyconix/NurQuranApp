import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { getItemCountText } from "../../utils/collectionHelpers";

interface CollectionInfoProps {
  itemCount: number;
}

export const CollectionInfo: React.FC<CollectionInfoProps> = ({ itemCount }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.itemCount}>{getItemCountText(itemCount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.BACKGROUND,
  },
  itemCount: {
    color: COLORS.SECONDARY,
    fontSize: 14,
    fontWeight: "500",
  },
});