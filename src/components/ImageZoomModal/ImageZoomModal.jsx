import React, { useEffect } from "react";
import { X, ZoomIn } from "lucide-react";
import "./ImageZoomModal.css";

export default function ImageZoomModal({ src, alt, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div 
      className="image-zoom-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Zoom view for ${alt || "Doctor Photo"}`}
    >
      <div className="image-zoom-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="image-zoom-close" 
          onClick={onClose}
          aria-label="Close zoomed image"
        >
          <X size={24} />
        </button>
        <div className="image-zoom-frame">
          <img src={src} alt={alt || "Doctor Photo"} className="image-zoom-img" />
          {alt && <p className="image-zoom-caption">{alt}</p>}
        </div>
      </div>
    </div>
  );
}
