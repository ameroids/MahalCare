import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle, X, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveDirectory, loadDirectoryMeta } from "../../data/directoryService";
import "../AdminUpload/AdminUpload.css"; // Reuse existing styles

const SAMPLE_JSON = [
  { Specialty: "Anaesthesiologist", Name: "Dr. Talib Husain Saifee", Title: "Family Consultant", Qualifications: "MBBS, DA", Timings: "2:00 pm – 3:00 pm", Contact: "+91 94240 51222", Address: "158, Mohammadi, Haidery Township" },
  { Specialty: "Ayush", Name: "Dr. Aamir Tayyebi", Title: "Gen Physician", Qualifications: "BUMS", Timings: "4:00 pm – 7:30 pm", Contact: "+91 98269 12120", Address: "Tayyebi Dawakhana, 51, Bohra Bazar" },
];

function downloadSampleTemplate() {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_JSON);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Directory Template");
  XLSX.writeFile(wb, "mahal-us-shifa-directory-template.xlsx");
}

export default function AdminDirectoryUpload({ onDone }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ status: "idle", error: null });
  const [meta, setMeta] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setMeta(loadDirectoryMeta());
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    setUploadStatus({ status: "loading", error: null });
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          
          if (rows.length === 0) {
            setUploadStatus({ status: "error", error: "File is empty or could not be parsed." });
            return;
          }
          
          setPreview({ entries: rows, fileName: file.name });
          setUploadStatus({ status: "idle", error: null });
        } catch (err) {
          setUploadStatus({ status: "error", error: "Failed to parse file. Make sure it's a valid Excel or CSV file." });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setUploadStatus({ status: "error", error: "Failed to read file." });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const confirm = async () => {
    try {
      setUploadStatus({ status: "loading", error: null });
      const newMeta = await saveDirectory(preview.entries, { fileName: preview.fileName });
      setMeta(newMeta);
      setPreview(null);
      setUploadStatus({ status: "idle", error: null });
      onDone?.();
    } catch (err) {
      setUploadStatus({ status: "error", error: "Failed to save directory to database." });
    }
  };

  const cancel = () => {
    setPreview(null);
    setUploadStatus({ status: "idle", error: null });
  };

  if (preview) {
    return (
      <section className="admin-upload" aria-labelledby="admin-upload-preview-heading">
        <header className="admin-upload__preview-head">
          <div>
            <h3 id="admin-upload-preview-heading">Directory Preview: {preview.fileName}</h3>
            <p>{preview.entries.length} doctors found.</p>
          </div>
        </header>

        <div className="admin-upload__preview-table-wrap">
          <table className="admin-upload__preview-table">
            <thead>
              <tr>
                <th scope="col">Names</th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th scope="col">Mobile No</th>
              </tr>
            </thead>
            <tbody>
              {preview.entries.slice(0, 10).map((e, idx) => (
                <tr key={idx}>
                  <td><strong>{e.names || e.Names || e.name || e.Name}</strong></td>
                  <td>{e.category || e.Category || e.specialty || e.Specialty}</td>
                  <td>{e.type || e.Type || e.title || e.Title}</td>
                  <td>{e.mobile_no || e["mobile no"] || e["Mobile No"] || e.contact || e.Contact}</td>
                </tr>
              ))}
              {preview.entries.length > 10 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                    ... and {preview.entries.length - 10} more rows
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-upload__actions">
          {uploadStatus.status === "error" && (
            <p className="admin-upload__status admin-upload__status--error" style={{ color: 'red', marginRight: 'auto' }}>
              {uploadStatus.error} Check console for details.
            </p>
          )}
          {uploadStatus.status === "loading" && <span style={{ marginRight: 'auto' }}>Saving...</span>}
          <button className="btn btn-secondary" onClick={cancel} disabled={uploadStatus.status === "loading"}>
            <X size={16} /> Cancel
          </button>
          <button className="btn btn-primary" onClick={confirm} disabled={uploadStatus.status === "loading"}>
            <CheckCircle size={16} /> Confirm & Publish
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-upload" aria-labelledby="admin-directory-heading">
      <h3 id="admin-directory-heading" className="visually-hidden">Upload Doctors Directory</h3>
      
      <div
        className={`admin-upload__dropzone ${dragOver ? "admin-upload__dropzone--active" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <UploadCloud size={48} className="admin-upload__dropzone-icon" />
        <p><strong>Click to upload</strong> or drag and drop</p>
        <span>.xlsx or .csv — for the Doctors Directory</span>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="visually-hidden"
          onClick={(e) => { e.target.value = null; }}
          onChange={(e) => handleFile(e.target.files?.[0])}
          tabIndex={-1}
        />
      </div>

      <div aria-live="polite">
        {uploadStatus.status === "loading" && <p className="admin-upload__status">Processing…</p>}
        {uploadStatus.status === "error" && <p className="admin-upload__status admin-upload__status--error">{uploadStatus.error}</p>}
      </div>

      <div className="admin-upload__meta">
        <p>
          {meta ? (
            <>Current directory: <strong>{meta.entryCount} doctors</strong>{meta.fileName ? <> from “{meta.fileName}”</> : null}.</>
          ) : (
            <>No directory uploaded yet.</>
          )}
        </p>
        <div className="admin-upload__meta-actions">
          <button className="btn btn-ghost btn-sm" onClick={downloadSampleTemplate}>
            <Download size={14} /> Template
          </button>
        </div>
      </div>

      <div className="admin-upload__note">
        <FileSpreadsheet size={16} />
        <p>
          Expected columns: <code>category</code>, <code>names</code>, <code>type</code>, <code>qualifications</code>, <code>mobile no</code>, <code>time</code>, <code>address</code>.
        </p>
      </div>
    </section>
  );
}
