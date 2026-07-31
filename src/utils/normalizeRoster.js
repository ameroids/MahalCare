// Turns loosely-structured rows (from Excel headers or hand-written JSON)
// into a single, predictable roster entry shape used everywhere else in
// the app:
//   { id, date: "YYYY-MM-DD", doctorName, specialty, timing, photo, phone, notes }
//
// Keeping this mapping in one place means the upload step is the only spot
// that needs to change if a hospital's spreadsheet format changes.

const FIELD_ALIASES = {
  date: ["date", "day", "visitdate", "appointmentdate", "scheduledate", "dt"],
  doctorName: ["doctorname", "doctor", "name", "physician", "consultant", "doc", "doctor_name", "drname"],
  specialty: ["specialty", "speciality", "department", "field", "expertise", "dept", "spec"],
  timing: ["timing", "time", "consultationtime", "slot", "hours", "schedule", "timings"],
  photo: ["photo", "photourl", "image", "imageurl", "picture", "avatar"],
  phone: ["phone", "contact", "phonenumber", "mobile"],
  notes: ["notes", "remarks", "description", "info"],
};

function keyFor(rawKey) {
  const clean = String(rawKey).trim().toLowerCase().replace(/[\s_\-]/g, "");
  for (const [standard, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.includes(clean)) return standard;
  }
  return null;
}

function excelSerialToISO(serial) {
  // Excel's epoch is 1899-12-30
  const epoch = new Date(Date.UTC(1899, 11, 30));
  const ms = epoch.getTime() + serial * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

export function normalizeDate(value) {
  if (value === null || value === undefined || value === "") return "";

  if (typeof value === "number") {
    return excelSerialToISO(value);
  }

  const str = String(value).trim();

  // Already ISO: 2026-07-28
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  // DD/MM/YYYY or DD-MM-YYYY or MM/DD/YYYY or D/M/YYYY
  const slashMatch = str.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (slashMatch) {
    const [, first, second, year] = slashMatch;
    let day, month;
    const p1 = parseInt(first, 10);
    const p2 = parseInt(second, 10);

    if (p1 > 12) {
      // First number > 12 -> must be DD/MM/YYYY
      day = p1;
      month = p2;
    } else if (p2 > 12) {
      // Second number > 12 -> must be MM/DD/YYYY
      month = p1;
      day = p2;
    } else {
      // Both <= 12: default to DD/MM/YYYY (common format for standard uploads)
      day = p1;
      month = p2;
    }
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  // Handle strings like "28 July 2026", "28th July", "July 28", "28-Jul-2026", etc.
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    // Return local date string YYYY-MM-DD to avoid UTC conversion shifts
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return str;
}

/**
 * @param {Array<Object>} rawRows - array of row objects with arbitrary keys
 * @returns {{entries: Array<Object>, skipped: number}}
 */
export function normalizeRoster(rawRows) {
  const entries = [];
  let skipped = 0;

  rawRows.forEach((row, index) => {
    if (!row || typeof row !== "object") { skipped++; return; }

    const mapped = {};
    Object.entries(row).forEach(([rawKey, value]) => {
      const standardKey = keyFor(rawKey);
      if (standardKey) {
        mapped[standardKey] = value;
      } else {
        // Fallback direct checks if header key matches directly
        const cleanKey = String(rawKey).trim().toLowerCase();
        if (cleanKey.includes("date") || cleanKey.includes("day")) mapped.date = mapped.date || value;
        if (cleanKey.includes("doc") || cleanKey.includes("name")) mapped.doctorName = mapped.doctorName || value;
        if (cleanKey.includes("spec") || cleanKey.includes("dept")) mapped.specialty = mapped.specialty || value;
        if (cleanKey.includes("time") || cleanKey.includes("slot")) mapped.timing = mapped.timing || value;
      }
    });

    // Also support exact direct property access if keys match standard shape
    const dateVal = mapped.date || row.date || row.Date || row.day || row.Day;
    const docVal = mapped.doctorName || row.doctorName || row.DoctorName || row.doctor || row.Doctor || row.name || row.Name;

    const date = normalizeDate(dateVal);
    const doctorName = docVal ? String(docVal).trim() : "";

    if (!doctorName) {
      skipped++;
      return;
    }

    // Fallback date to today if missing
    const finalDate = date || new Date().toISOString().slice(0, 10);

    const rawPhoto = String(mapped.photo || row.photo || row.Photo || "").trim();
    const photo = rawPhoto
      ? (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://") || rawPhoto.startsWith("/")
          ? rawPhoto
          : `/doctors/${rawPhoto}`)
      : "";

    entries.push({
      id: `row-${index}-${finalDate}-${doctorName}`.replace(/\s+/g, "_"),
      date: finalDate,
      doctorName,
      specialty: mapped.specialty || row.specialty || row.Specialty || row.Speciality || "General",
      timing: mapped.timing || row.timing || row.Timing || row.Time || "Timing not specified",
      photo,
      phone: mapped.phone || row.phone || row.Phone || "",
      notes: mapped.notes || row.notes || row.Notes || "",
    });
  });

  const uniqueEntries = [];
  const seenKeys = new Set();
  
  entries.sort((a, b) => a.date.localeCompare(b.date));
  for (const entry of entries) {
    const key = `${entry.date}__${entry.doctorName.toLowerCase()}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueEntries.push(entry);
    } else {
      skipped++;
    }
  }

  return { entries: uniqueEntries, skipped };
}
