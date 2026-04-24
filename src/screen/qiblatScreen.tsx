import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { Menu, Compass } from "lucide-react-native"; // Library icon yang biasa kamu pakai

const QiblaScreen = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [magnetometer, setMagnetometer] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);
  const [distance, setDistance] = useState(2405); // Dummy distance sesuai gambar

  useEffect(() => {
    _requestPermission();
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      _getCurrentLocation();
    } catch (error) {
      console.log("Permission error:", error);
    }
  };

  const _getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      calculateQibla(latitude, longitude);
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  const calculateQibla = (lat: number, lon: number) => {
    const phiK = (21.4225 * Math.PI) / 180;
    const lambdaK = (39.8262 * Math.PI) / 180;
    const phiU = (lat * Math.PI) / 180;
    const lambdaU = (lon * Math.PI) / 180;

    const angle = Math.atan2(
      Math.sin(lambdaK - lambdaU),
      Math.cos(phiU) * Math.tan(phiK) -
        Math.sin(phiU) * Math.cos(lambdaK - lambdaU),
    );
    setQiblaDir((angle * 180) / Math.PI);
  };

  const _subscribe = () => {
    // Simple compass implementation - rotates continuously to simulate device orientation
    // In a production app, you would integrate with native heading sensor
    let angle = 0;
    const interval = setInterval(() => {
      angle = (angle + 0.5) % 360;
      setMagnetometer(angle);
    }, 50);

    setSubscription({ remove: () => clearInterval(interval) });
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const compassRotation = 360 - magnetometer;
  const qiblaRotation = compassRotation + qiblaDir;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Menu color="white" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Qibla Direction</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Compass color="#A44AFF" size={20} fill="#A44AFF" />
        </TouchableOpacity>
      </View>

      {/* Compass Section */}
      <View style={styles.compassSection}>
        <Text style={styles.cardinalPoint}>N</Text>
        <View style={styles.outerCircle}>
          <Text style={styles.cardinalW}>W</Text>
          <View style={styles.innerCircle}>
            {/* Jarum Kompas / Pointer Qibla */}
            <View
              style={[
                styles.pointerContainer,
                { transform: [{ rotate: `${qiblaRotation}deg` }] },
              ]}
            >
              <View style={styles.qiblaPointer}>
                <Text style={styles.qiblaText}>Qibla</Text>
                <View style={styles.arrowTriangle} />
              </View>
            </View>
            {/* Center Dot */}
            <View style={styles.centerDot}>
              <Compass color="#A44AFF" size={40} fill="#A44AFF" opacity={0.5} />
            </View>
          </View>
          <Text style={styles.cardinalE}>S</Text>
        </View>
        <Text style={styles.cardinalPoint}>S</Text>
      </View>

      {/* Info Boxes */}
      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Direction</Text>
          <Text style={styles.infoValue}>{Math.round(qiblaDir)}°</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{distance.toLocaleString()} km</Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>Instructions</Text>
        <Text style={styles.instructionText}>• Hold your device flat</Text>
        <Text style={styles.instructionText}>
          • Allow location and compass access
        </Text>
        <Text style={styles.instructionText}>
          • Rotate yourself until the arrow points up
        </Text>
        <Text style={styles.instructionText}>
          • You are now facing the Qibla directions
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1535",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcon: {
    backgroundColor: "rgba(164, 74, 255, 0.2)",
    padding: 8,
    borderRadius: 50,
  },
  compassSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  outerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: "#A44AFF",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    position: "relative",
  },
  innerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#121931",
    justifyContent: "center",
    alignItems: "center",
  },
  cardinalPoint: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardinalW: {
    position: "absolute",
    left: -30,
    color: "white",
    fontWeight: "bold",
  },
  cardinalE: {
    position: "absolute",
    right: -30,
    color: "white",
    fontWeight: "bold",
  },
  centerDot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#A44AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  pointerContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  qiblaPointer: {
    position: "absolute",
    top: -20, // Mengatur posisi ujung panah
    alignItems: "center",
  },
  qiblaText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    transform: [{ rotate: "180deg" }], // Menyesuaikan arah baca
    marginBottom: 5,
  },
  arrowTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 40,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#A44AFF",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 15,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#1C274C",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
  },
  infoLabel: {
    color: "#8D92A3",
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    color: "#A44AFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  instructionCard: {
    backgroundColor: "#1C274C",
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  instructionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    color: "#8D92A3",
    fontSize: 14,
    lineHeight: 22,
  },
});

export default QiblaScreen;
