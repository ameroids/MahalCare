import { supabase } from '../supabaseClient';

const META_KEY = "mahala_shifa_directory_meta_v2";

export async function loadDirectory() {
  try {
    const { data, error } = await supabase.from('doctors_directory').select('*').order('category', { ascending: true }).order('names', { ascending: true });
    if (error) {
      console.error("Supabase directory load error:", error);
      return null;
    }
    
    if (data && data.length > 0) {
      return data;
    }
    return [];
  } catch (err) {
    console.error("Failed to load directory from Supabase:", err);
    return null;
  }
}

export function loadDirectoryMeta() {
  try {
    const raw = window.localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveDirectory(entries, meta = {}) {
  try {
    await supabase.from('doctors_directory').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const dbEntries = entries.map(e => ({
      category: e.category || e.Category || e.specialty || e.Specialty || "General",
      names: e.names || e.Names || e.name || e.Name || "",
      type: e.type || e.Type || e.title || e.Title || "",
      qualifications: e.qualifications || e.Qualifications || "",
      mobile_no: e["mobile no"] || e["Mobile No"] || e.mobile_no || e.contact || e.Contact || "",
      time: e.time || e.Time || e.timings || e.Timings || "",
      address: e.address || e.Address || ""
    }));
    
    const { error } = await supabase.from('doctors_directory').insert(dbEntries);
    if (error) {
      console.error("Supabase directory save error:", error);
      throw error;
    }
  } catch (err) {
    console.error("Failed to save directory to Supabase:", err);
    throw err;
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
    console.error("Failed to save directory meta to localStorage:", err);
  }
  
  window.dispatchEvent(new CustomEvent("directory:updated"));
  return fullMeta;
}
