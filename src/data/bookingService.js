const BOOKINGS_KEY = "shifa_bookings";

/**
 * Generate a sequential token starting at 001.
 * Now creates a unique counter per doctor per date.
 */
export function generateDailyToken(date, doctorName) {
  // Sanitize the doctor name for the key
  const safeName = (doctorName || "Unknown").replace(/[^a-zA-Z0-9]/g, "_");
  const storageKey = `mahala_token_${date}_${safeName}`;

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
    const token = generateDailyToken(booking.date, booking.doctorName);
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
    // Also remove any token counters
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("mahala_token_") || key === "mahala_global_token_counter")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error("Failed to clear bookings from local storage", e);
  }
}
