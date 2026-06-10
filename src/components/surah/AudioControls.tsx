import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SkipBack, SkipForward } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

interface AudioControlsProps {
  currentIndex: number;
  totalAyahs: number;
  playingAyat?: number | null;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  currentIndex,
  totalAyahs,
  playingAyat,
  isLoading,
  onPrevious,
  onNext,
}) => {
  const progress = ((currentIndex + 1) / totalAyahs) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onPrevious}
          disabled={currentIndex === 0}
          style={styles.controlButton}
        >
          <SkipBack
            color={currentIndex === 0 ? COLORS.SECONDARY : COLORS.TEXT}
            size={22}
          />
        </TouchableOpacity>

        <View style={styles.nowPlayingContainer}>
          {isLoading && (
            <ActivityIndicator size="small" color={COLORS.TEXT} style={{ marginRight: 8 }} />
          )}
          <Text style={styles.nowPlayingText}>
            Ayah {playingAyat || "..."} / {totalAyahs}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNext}
          disabled={currentIndex >= totalAyahs - 1}
          style={styles.controlButton}
        >
          <SkipForward
            color={currentIndex >= totalAyahs - 1 ? COLORS.SECONDARY : COLORS.TEXT}
            size={22}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  controlButton: {
    padding: 10,
  },
  nowPlayingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nowPlayingText: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: "600",
  },
  progressBarContainer: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.TEXT,
    borderRadius: 2,
  },
});