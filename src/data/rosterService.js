// -----------------------------------------------------------------------
// Roster storage service
// -----------------------------------------------------------------------
// Every other part of the app talks to the roster ONLY through the
// functions exported here. Today that means localStorage; tomorrow it
// could mean a REST/GraphQL API behind an admin login and token — see the
// commented `// FUTURE:` notes below for exactly where that swap happens.
// Nothing in RosterContext.jsx or the components needs to change.
// -----------------------------------------------------------------------

const STORAGE_KEY = "mahala_shifa_roster_v3";
const META_KEY = "mahala_shifa_roster_meta_v3";

export function loadRoster() {
  // FUTURE: replace with `await api.get('/roster')`
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loadMeta() {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRoster(entries, meta = {}) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error("Failed to save roster to localStorage:", err);
  }
  const fullMeta = {
    uploadedAt: new Date().toISOString(),
    fileName: meta.fileName || "",
    entryCount: entries.length,
    ...meta,
  };
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(fullMeta));
  } catch (err) {
    console.error("Failed to save meta to localStorage:", err);
  }
  window.dispatchEvent(new CustomEvent("roster:updated"));
  return fullMeta;
}

export function clearRoster() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(META_KEY);
  window.dispatchEvent(new CustomEvent("roster:updated"));
}
