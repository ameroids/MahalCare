import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadBookings, saveBooking, clearBookings } from "../data/bookingService.js";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  const refreshBookings = useCallback(() => {
    setBookings(loadBookings());
  }, []);

  useEffect(() => {
    refreshBookings();
    window.addEventListener("storage", refreshBookings);
    return () => {
      window.removeEventListener("storage", refreshBookings);
    };
  }, [refreshBookings]);

  const bookAppointment = useCallback(async (bookingDetails) => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const { updated, newBooking } = saveBooking(bookingDetails);
        setBookings(updated);
        resolve({ ok: true, booking: newBooking });
      }, 800); // simulate network delay
    });
  }, []);

  const clearAllBookings = useCallback(() => {
    clearBookings();
    refreshBookings();
  }, [refreshBookings]);

  const value = {
    bookings,
    bookAppointment,
    clearAllBookings,
    refreshBookings
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingProvider");
  return ctx;
}
