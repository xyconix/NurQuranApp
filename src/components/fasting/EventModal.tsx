import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { X, Bell } from "lucide-react-native";
import { SelectedEvent } from "../../types/quran.types";
import { COLORS } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface EventModalProps {
  visible: boolean;
  event: SelectedEvent | null;
  onClose: () => void;
  notificationsEnabled: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  event,
  onClose,
  notificationsEnabled,
}) => {
  const { t } = useTranslation();

  if (!event) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={22} color="white" />
          </TouchableOpacity>

          {event.islamicEvent && (
            <>
              <View style={styles.modalDot} />
              <Text style={styles.title}>{event.islamicEvent.label}</Text>
              <Text style={styles.hijriDate}>{event.islamicEvent.hijriDate}</Text>
              <Text style={styles.description}>
                {event.islamicEvent.description}
              </Text>
            </>
          )}

          {event.fastingEvent && (
            <>
              {!event.islamicEvent && (
                <View
                  style={[
                    styles.modalDot,
                    { backgroundColor: event.fastingEvent.color },
                  ]}
                />
              )}
              {event.islamicEvent && (
                <Text style={styles.divider}>──────────────────</Text>
              )}
              <Text
                style={[
                  styles.title,
                  { color: event.fastingEvent.color },
                ]}
              >
                {event.fastingEvent.label}
              </Text>
              <Text style={styles.description}>
                {event.fastingEvent.description}
              </Text>
            </>
          )}

          <Text style={styles.gregorianDate}>{event.gregorianDate}</Text>

          <View style={styles.notifInfo}>
            <Bell color={COLORS.PRIMARY} size={14} />
            <Text style={styles.notifText}>
              {notificationsEnabled
                ? "Notifikasi akan dikirim malam sebelumnya (20:00)"
                : "Notifikasi dimatikan"}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "82%",
    backgroundColor: "#172554",
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  modalDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  hijriDate: {
    color: "#C084FC",
    marginTop: 8,
    fontWeight: "700",
  },
  description: {
    color: "#CBD5E1",
    marginTop: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  gregorianDate: {
    color: "#94A3B8",
    marginTop: 12,
  },
  divider: {
    color: "#CBD5E1",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 12,
  },
  notifInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  notifText: {
    color: "#C084FC",
    fontSize: 11,
    fontWeight: "500",
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeModalText: {
    color: "white",
    fontWeight: "bold",
  },
});