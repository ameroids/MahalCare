// -----------------------------------------------------------------------
// Roster storage service
// -----------------------------------------------------------------------
// Every other part of the app talks to the roster ONLY through the
// functions exported here. Now wired to use Supabase.
// -----------------------------------------------------------------------

import { supabase } from '../supabaseClient';

const META_KEY = "mahala_shifa_roster_meta_v3";

export async function loadRoster() {
  try {
    const { data, error } = await supabase.from('roster').select('*');
    if (error) {
      console.error("Supabase load error:", error);
      return null;
    }
    
    // Map database columns back to camelCase as expected by the app
    if (data && data.length > 0) {
      return data.map(row => ({
        id: row.id,
        date: row.date,
        doctorName: row.doctor_name,
        specialty: row.specialty,
        timing: row.timing,
        photo: row.photo
      }));
    }
    return null;
  } catch (err) {
    console.error("Failed to load roster from Supabase:", err);
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

export async function saveRoster(entries, meta = {}) {
  try {
    // 1. Delete all existing records (assuming we replace the whole roster on upload)
    await supabase.from('roster').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Insert new entries
    const dbEntries = entries.map(e => ({
      date: e.date,
      doctor_name: e.doctorName,
      specialty: e.specialty,
      timing: e.timing,
      photo: e.photo
    }));
    
    const { error } = await supabase.from('roster').insert(dbEntries);
    if (error) {
      console.error("Supabase save error:", error);
    }
  } catch (err) {
    console.error("Failed to save roster to Supabase:", err);
  }

  // We can still keep meta locally, or eventually move it to a 'meta' table in supabase
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

export async function clearRoster() {
  try {
    await supabase.from('roster').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  } catch (err) {
    console.error("Failed to clear roster in Supabase:", err);
  }
  window.localStorage.removeItem(META_KEY);
  window.dispatchEvent(new CustomEvent("roster:updated"));
}
