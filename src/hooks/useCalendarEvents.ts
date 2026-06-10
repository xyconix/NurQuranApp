import { useState, useCallback } from "react";
import { SelectedEvent, CalendarDay } from "../types/quran.types";
import { getFastingEvent, getIslamicEvent } from "../utils/fastingHelpers";

export const useCalendarEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDayPress = useCallback((day: CalendarDay) => {
    const fastingEvent = getFastingEvent(
      day.dayOfWeek,
      day.hijriDay,
      day.hijriMonthNumber
    );
    const islamicEvent = getIslamicEvent(day.hijriDay, day.hijriMonthNumber);

    if (islamicEvent || fastingEvent) {
      setSelectedEvent({
        islamicEvent,
        fastingEvent,
        gregorianDate: day.date,
      });
      setShowModal(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedEvent(null);
  }, []);

  return {
    selectedEvent,
    showModal,
    handleDayPress,
    closeModal,
  };
};