import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadRoster, loadMeta, saveRoster, clearRoster } from "../data/rosterService.js";
import { parseRosterFile } from "../data/parseFile.js";
import { normalizeRoster } from "../utils/normalizeRoster.js";
import { generateSampleRoster } from "../data/sampleRoster.js";

const RosterContext = createContext(null);

export function RosterProvider({ children }) {
  const [entries, setEntries] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [uploadState, setUploadState] = useState({ status: "idle", error: "", skipped: 0 });

  const refresh = useCallback(() => {
    const stored = loadRoster();
    if (stored && stored.length > 0) {
      setEntries(stored);
      setMeta(loadMeta());
      setIsDemo(false);
    } else {
      setEntries(generateSampleRoster());
      setMeta(null);
      setIsDemo(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("roster:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("roster:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const uploadFile = useCallback(async (file) => {
    setUploadState({ status: "loading", error: "", skipped: 0 });
    try {
      const rawRows = await parseRosterFile(file);
      const { entries: normalized, skipped } = normalizeRoster(rawRows);

      if (normalized.length === 0) {
        setUploadState({
          status: "error",
          error: "No usable rows were found. Make sure the file has Date and Doctor Name columns.",
          skipped,
        });
        return { ok: false, entries: [] };
      }

      setUploadState({ status: "preview", error: "", skipped });
      return { ok: true, entries: normalized, skipped, fileName: file.name };
    } catch (err) {
      setUploadState({ status: "error", error: err.message || "Something went wrong reading that file.", skipped: 0 });
      return { ok: false, entries: [] };
    }
  }, []);

  const confirmUpload = useCallback((normalizedEntries, fileName) => {
    const savedMeta = saveRoster(normalizedEntries, { fileName });
    setEntries(normalizedEntries);
    setMeta(savedMeta);
    setIsDemo(false);
    setUploadState({ status: "idle", error: "", skipped: 0 });
  }, []);

  const resetUploadState = useCallback(() => {
    setUploadState({ status: "idle", error: "", skipped: 0 });
  }, []);

  const resetToDemo = useCallback(() => {
    clearRoster();
    refresh();
  }, [refresh]);

  const specialties = useMemo(() => {
    const set = new Set(entries.map((e) => e.specialty).filter(Boolean));
    return Array.from(set).sort();
  }, [entries]);

  const value = {
    entries,
    meta,
    isDemo,
    specialties,
    uploadState,
    uploadFile,
    confirmUpload,
    resetUploadState,
    resetToDemo,
  };

  return <RosterContext.Provider value={value}>{children}</RosterContext.Provider>;
}

export function useRoster() {
  const ctx = useContext(RosterContext);
  if (!ctx) throw new Error("useRoster must be used within a RosterProvider");
  return ctx;
}
