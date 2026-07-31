import React, { useEffect } from "react";
import AdminUpload from "../AdminUpload/AdminUpload.jsx";
import "./AdminModal.css";

// NOTE: this modal is intentionally open-access for now. When the
// login / token-management feature from the roadmap is built, wrap this
// component's contents with an auth check (e.g. `if (!isAdmin) return <LoginPrompt />`)
// — nothing else in the app needs to change.
export default function AdminModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="admin-modal__backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal glass-card" role="dialog" aria-modal="true" aria-label="Admin: upload roster">
        <div className="admin-modal__head">
          <div>
            <span className="eyebrow">Admin</span>
            <h3>Upload Monthly Roster</h3>
          </div>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <AdminUpload onDone={onClose} />
      </div>
    </div>
  );
}
