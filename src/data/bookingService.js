const BOOKINGS_KEY = "shifa_bookings";

/**
 * Generate a daily sequential token starting at 001 for each date.
 * Format: 001, 002, 003, etc.
 */
export function generateDailyToken(date) {
  const targetDate = date || new Date().toISOString().split("T")[0];
  const storageKey = `mahala_token_counter_${targetDate}`;
  let count = parseInt(localStorage.getItem(storageKey) || "0", 10);
  count += 1;
  localStorage.setItem(storageKey, count.toString());
  return String(count).padStart(3, "0");
}

export function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load bookings from local storage", e);
    return [];
  }
}

export function saveBooking(booking) {
  try {
    const current = loadBookings();
    const token = generateDailyToken(booking.date);
    const newBooking = {
      ...booking,
      id: crypto.randomUUID(),
      token,
      createdAt: new Date().toISOString(),
    };
    const updated = [...current, newBooking];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return { updated, newBooking };
  } catch (e) {
    console.error("Failed to save booking to local storage", e);
    throw new Error("Unable to save booking");
  }
}

export function clearBookings() {
  try {
    localStorage.removeItem(BOOKINGS_KEY);
  } catch (e) {
    console.error("Failed to clear bookings from local storage", e);
  }
}
