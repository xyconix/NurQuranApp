import React from "react";
import { View, StyleSheet } from "react-native";
import { StarSVG } from "../../../assets/svg";
import { STAR_POSITIONS, SPLASH_SIZES } from "../../constants/splash.constants";

interface StarPosition {
  top?: number;
  left?: number;
  right?: number;
  opacity: number;
}

const Star: React.FC<StarPosition> = ({ top, left, right, opacity }) => (
  <View style={[styles.star, { top, left, right, opacity }]}>
    <StarSVG width={SPLASH_SIZES.starSize} height={SPLASH_SIZES.starSize} />
  </View>
);

export const DecorativeStars: React.FC = () => {
  return (
    <>
      {STAR_POSITIONS.map((position, index) => (
        <Star key={`star-${index}`} {...position} />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  star: {
    position: "absolute",
  },
});