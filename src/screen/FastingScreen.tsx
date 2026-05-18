import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { X } from "lucide-react-native";

interface CalendarDay {
  date: string;

  day: number;

  hijriDay: string;

  hijriMonth: string;

  hijriMonthNumber: number;

  hijriYear: string;
}

interface IslamicEvent {
  label: string;

  description: string;

  hijriDate: string;
}

interface SelectedEvent extends IslamicEvent {
  gregorianDate: string;
}

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const weekdays = [
  "Min",
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
];

const FastingScreen = () => {
  const currentYear =
    new Date().getFullYear();

  const today = new Date();

  const [selectedMonth, setSelectedMonth] =
    useState(today.getMonth());

  const [calendarData, setCalendarData] =
    useState<Record<number, CalendarDay[]>>(
      {},
    );

  const [loading, setLoading] =
    useState(true);

  const [selectedEvent, setSelectedEvent] =
    useState<SelectedEvent | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      setLoading(true);

      const allMonths: Record<
        number,
        CalendarDay[]
      > = {};

      await Promise.all(
        Array.from(
          { length: 12 },
          async (_, monthIndex) => {
            const response = await fetch(
              `https://api.aladhan.com/v1/gToHCalendar/${
                monthIndex + 1
              }/${currentYear}`,
            );

            const result =
              await response.json();

            const days: CalendarDay[] =
              result.data.map((item: any) => ({
                date:
                  item.gregorian.date,

                day: Number(
                  item.gregorian.day,
                ),

                hijriDay:
                  item.hijri.day,

                hijriMonth:
                  item.hijri.month.en,

                hijriMonthNumber:
                  item.hijri.month.number,

                hijriYear:
                  item.hijri.year,
              }));

            allMonths[monthIndex] = days;
          },
        ),
      );

      setCalendarData(allMonths);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFastingEvent = (
    gregorianDate: string,
    hijriDay: string,
    hijriMonthNumber: number,
  ) => {
    const date =
      new Date(gregorianDate);

    const day =
      date.getDay();

    // SENIN
    if (day === 1) {
      return {
        label: "Senin",
        color: "#3B82F6",
      };
    }

    // KAMIS
    if (day === 4) {
      return {
        label: "Kamis",
        color: "#3B82F6",
      };
    }

    // AYYAMUL BITH
    if (
      ["13", "14", "15"].includes(
        hijriDay,
      )
    ) {
      return {
        label: "Ayyamul",
        color: "#10B981",
      };
    }

    // ASYURA
    if (
      hijriMonthNumber === 1 &&
      hijriDay === "10"
    ) {
      return {
        label: "Asyura",
        color: "#EF4444",
      };
    }

    // ARAFAH
    if (
      hijriMonthNumber === 12 &&
      hijriDay === "9"
    ) {
      return {
        label: "Arafah",
        color: "#EF4444",
      };
    }

    // RAMADAN
    if (
      hijriMonthNumber === 9
    ) {
      return {
        label: "Ramadan",
        color: "#FBBF24",
      };
    }

    return null;
  };

  const getIslamicEvent = (
    hijriDay: string,
    hijriMonthNumber: number,
  ): IslamicEvent | null => {
    // TAHUN BARU ISLAM
    if (
      hijriMonthNumber === 1 &&
      hijriDay === "1"
    ) {
      return {
        label:
          "Tahun Baru Islam",

        description:
          "1 Muharram - Tahun Baru Hijriah",

        hijriDate:
          "1 Muharram",
      };
    }

    // ASYURA
    if (
      hijriMonthNumber === 1 &&
      hijriDay === "10"
    ) {
      return {
        label: "Hari Asyura",

        description:
          "10 Muharram",

        hijriDate:
          "10 Muharram",
      };
    }

    // MAULID NABI
    if (
      hijriMonthNumber === 3 &&
      hijriDay === "12"
    ) {
      return {
        label:
          "Maulid Nabi",

        description:
          "Kelahiran Nabi Muhammad SAW",

        hijriDate:
          "12 Rabiul Awal",
      };
    }

    // ISRA MIRAJ
    if (
      hijriMonthNumber === 7 &&
      hijriDay === "27"
    ) {
      return {
        label:
          "Isra Miraj",

        description:
          "Perjalanan Isra Miraj Nabi Muhammad SAW",

        hijriDate:
          "27 Rajab",
      };
    }

    // NISFU SYABAN
    if (
      hijriMonthNumber === 8 &&
      hijriDay === "15"
    ) {
      return {
        label:
          "Nisfu Syaban",

        description:
          "Malam Nisfu Syaban",

        hijriDate:
          "15 Syaban",
      };
    }

    // AWAL RAMADAN
    if (
      hijriMonthNumber === 9 &&
      hijriDay === "1"
    ) {
      return {
        label:
          "Awal Ramadan",

        description:
          "Awal bulan puasa Ramadan",

        hijriDate:
          "1 Ramadan",
      };
    }

    // NUZULUL QURAN
    if (
      hijriMonthNumber === 9 &&
      hijriDay === "17"
    ) {
      return {
        label:
          "Nuzulul Quran",

        description:
          "Turunnya Al-Quran",

        hijriDate:
          "17 Ramadan",
      };
    }

    // IDUL FITRI
    if (
      hijriMonthNumber === 10 &&
      hijriDay === "1"
    ) {
      return {
        label:
          "Idul Fitri",

        description:
          "Hari Raya Idul Fitri",

        hijriDate:
          "1 Syawal",
      };
    }

    // IDUL ADHA
    if (
      hijriMonthNumber === 12 &&
      hijriDay === "10"
    ) {
      return {
        label:
          "Idul Adha",

        description:
          "Hari Raya Idul Adha",

        hijriDate:
          "10 Dzulhijjah",
      };
    }

    return null;
  };

  const getFirstDay = (
    monthIndex: number,
  ) => {
    return new Date(
      currentYear,
      monthIndex,
      1,
    ).getDay();
  };

  const hexToRGBA = (
    hex: string,
    opacity: number,
  ) => {
    const r = parseInt(
      hex.slice(1, 3),
      16,
    );

    const g = parseInt(
      hex.slice(3, 5),
      16,
    );

    const b = parseInt(
      hex.slice(5, 7),
      16,
    );

    return `rgba(${r},${g},${b},${opacity})`;
  };

  const renderMonth = () => {
    const days =
      calendarData[selectedMonth] || [];

    const cells = [];

    const firstDay =
      getFirstDay(selectedMonth);

    // EMPTY CELL
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <View
          key={`empty-${i}`}
          style={[
            styles.dayCell,
            {
              backgroundColor:
                "transparent",
            },
          ]}
        />,
      );
    }

    // DAY CELL
    for (const item of days) {
      const fastingEvent =
        getFastingEvent(
          item.date,
          item.hijriDay,
          item.hijriMonthNumber,
        );

      const islamicEvent =
        getIslamicEvent(
          item.hijriDay,
          item.hijriMonthNumber,
        );

      const isToday =
        item.day === today.getDate() &&
        selectedMonth ===
          today.getMonth();

      cells.push(
        <TouchableOpacity
          key={item.date}
          activeOpacity={0.8}
          style={[
            styles.dayCell,

            fastingEvent && {
              backgroundColor:
                hexToRGBA(
                  fastingEvent.color,
                  0.18,
                ),

              borderLeftWidth: 3,

              borderLeftColor:
                fastingEvent.color,
            },

            isToday &&
              styles.todayCell,
          ]}
          onPress={() => {
            if (islamicEvent) {
              setSelectedEvent({
                ...islamicEvent,

                gregorianDate:
                  item.date,
              });

              setShowModal(true);
            }
          }}
        >
          {/* DOT EVENT */}
          {islamicEvent && (
            <View style={styles.dot} />
          )}

          {/* DAY */}
          <Text
            style={[
              styles.dayNumber,

              fastingEvent && {
                color:
                  fastingEvent.color,
              },
            ]}
          >
            {item.day}
          </Text>

          {/* HIJRI */}
          <Text style={styles.hijriText}>
            {item.hijriDay}
          </Text>

          {/* LABEL */}
          {fastingEvent && (
            <Text
              numberOfLines={1}
              style={[
                styles.eventLabel,

                {
                  color:
                    fastingEvent.color,
                },
              ]}
            >
              {fastingEvent.label}
            </Text>
          )}
        </TouchableOpacity>,
      );
    }

    return cells;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#A855F7"
        />

        <Text style={styles.loadingText}>
          Memuat Kalender Islam...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Kalender Islam
          </Text>

          <Text style={styles.subtitle}>
            Kalender Puasa & Hari Islam
          </Text>
        </View>

        {/* LEGEND */}
        <View style={styles.legendContainer}>
          <Legend
            color="#3B82F6"
            label="Senin/Kamis"
          />

          <Legend
            color="#10B981"
            label="Ayyamul Bidh"
          />

          <Legend
            color="#EF4444"
            label="Asyura"
          />

          <Legend
            color="#FBBF24"
            label="Ramadan"
          />

          <View style={styles.legendItem}>
            <View style={styles.whiteDot} />

            <Text style={styles.legendText}>
              Hari Islam
            </Text>
          </View>
        </View>

        {/* MONTH SELECTOR */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => {
              if (selectedMonth > 0) {
                setSelectedMonth(
                  selectedMonth - 1,
                );
              }
            }}
          >
            <Text style={styles.navButton}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.monthTitle}>
            {months[selectedMonth]}{" "}
            {currentYear}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (selectedMonth < 11) {
                setSelectedMonth(
                  selectedMonth + 1,
                );
              }
            }}
          >
            <Text style={styles.navButton}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* WEEK */}
        <View style={styles.weekRow}>
          {weekdays.map((day) => (
            <Text
              key={day}
              style={styles.weekText}
            >
              {day}
            </Text>
          ))}
        </View>

        {/* CALENDAR */}
        <View style={styles.grid}>
          {renderMonth()}
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={showModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setShowModal(false)
              }
            >
              <X
                size={22}
                color="white"
              />
            </TouchableOpacity>

            {selectedEvent && (
              <>
                <View
                  style={styles.modalDot}
                />

                <Text
                  style={styles.modalTitle}
                >
                  {selectedEvent.label}
                </Text>

                <Text
                  style={styles.modalHijri}
                >
                  {
                    selectedEvent.hijriDate
                  }
                </Text>

                <Text
                  style={styles.modalDesc}
                >
                  {
                    selectedEvent.description
                  }
                </Text>

                <Text
                  style={
                    styles.modalGregorian
                  }
                >
                  {
                    selectedEvent.gregorianDate
                  }
                </Text>

                <TouchableOpacity
                  style={
                    styles.closeModalButton
                  }
                  onPress={() =>
                    setShowModal(false)
                  }
                >
                  <Text
                    style={
                      styles.closeModalText
                    }
                  >
                    Tutup
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Legend = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => (
  <View style={styles.legendItem}>
    <View
      style={[
        styles.legendColor,
        {
          backgroundColor: color,
        },
      ]}
    />

    <Text style={styles.legendText}>
      {label}
    </Text>
  </View>
);

export default FastingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#081226",
  },

  loading: {
    flex: 1,
    backgroundColor: "#081226",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "white",
    marginTop: 12,
  },

  header: {
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 6,
  },

  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  legendItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 8,
  },

  whiteDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    marginRight: 8,
  },

  legendText: {
    color: "#CBD5E1",
    fontSize: 12,
  },

  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  navButton: {
    color: "#A855F7",
    fontSize: 34,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },

  monthTitle: {
    color: "#A855F7",
    fontSize: 24,
    fontWeight: "bold",
  },

  weekRow: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 14,
  },

  weekText: {
    width: "14.28%",
    textAlign: "center",
    color: "#94A3B8",
    fontWeight: "700",
    fontSize: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginBottom: 40,
  },

  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    backgroundColor: "#111C34",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },

  todayCell: {
    borderWidth: 2,
    borderColor: "#A855F7",
  },

  dayNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  hijriText: {
    color: "#A855F7",
    fontSize: 9,
    marginTop: 2,
    fontWeight: "600",
  },

  eventLabel: {
    fontSize: 7,
    fontWeight: "700",
    marginTop: 2,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    position: "absolute",
    top: 5,
    right: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
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

  modalTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  modalHijri: {
    color: "#C084FC",
    marginTop: 8,
    fontWeight: "700",
  },

  modalDesc: {
    color: "#CBD5E1",
    marginTop: 14,
    textAlign: "center",
    lineHeight: 22,
  },

  modalGregorian: {
    color: "#94A3B8",
    marginTop: 12,
  },

  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#A855F7",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },

  closeModalText: {
    color: "white",
    fontWeight: "bold",
  },
});