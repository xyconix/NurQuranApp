import React from "react";
import { View, StyleSheet } from "react-native";
import { CloudSVG } from "../../../assets/svg";
import { CLOUD_POSITIONS, SPLASH_SIZES } from "../../constants/splash.constants";

interface CloudPosition {
  top: number;
  left?: number;
  right?: number;
  scale: number;
}

const Cloud: React.FC<CloudPosition> = ({ top, left, right, scale }) => (
  <View
    style={[
      styles.cloud,
      { top, left, right, transform: [{ scale }] },
    ]}
  >
    <CloudSVG width={SPLASH_SIZES.cloudSize} height={SPLASH_SIZES.cloudSize} />
  </View>
);

export const DecorativeClouds: React.FC = () => {
  return (
    <>
      {CLOUD_POSITIONS.map((position, index) => (
        <Cloud key={`cloud-${index}`} {...position} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  cloud: {
    position: "absolute",
    opacity: 0.7,
  },
});