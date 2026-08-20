import * as XLSX from "xlsx";

/**
 * Reads a File (.xlsx, .xls, or .json) and returns an array of plain row
 * objects (keys = column headers / JSON keys). Normalization into the
 * app's standard roster shape happens separately in normalizeRoster.js —
 * this module's only job is "get raw rows out of the file".
 */
export function parseRosterFile(file) {
  return new Promise((resolve, reject) => {
    const name = file.name.toLowerCase();

    if (name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          const rows = Array.isArray(parsed) ? parsed : parsed.roster || parsed.entries || [];
          resolve(rows);
        } catch (err) {
          reject(new Error("This JSON file couldn't be read. Check that it's valid JSON."));
        }
      };
      reader.onerror = () => reject(new Error("The file couldn't be opened."));
      reader.readAsText(file);
      return;
    }

    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = new Uint8Array(reader.result);
          const workbook = XLSX.read(data, { type: "array", cellDates: false });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          resolve(rows);
        } catch (err) {
          reject(new Error("This Excel file couldn't be read. Check that it's a valid .xlsx or .xls file."));
        }
      };
      reader.onerror = () => reject(new Error("The file couldn't be opened."));
      reader.readAsArrayBuffer(file);
      return;
    }

    reject(new Error("Unsupported file type. Upload a .xlsx, .xls, or .json file."));
  });
}
