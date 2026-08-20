import React, { useState } from "react";
import { Clock, Calendar, ArrowRight, ZoomIn, CalendarDays } from "lucide-react";
import ImageZoomModal from "../ImageZoomModal/ImageZoomModal.jsx";
import "./DoctorCard.css";

function initials(name) {
  if (!name) return "DR";
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Deterministic accent color per specialty
const PALETTE = ["teal", "blue", "green"];
function accentFor(text) {
  if (!text) return "teal";
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export default function DoctorCard({ entry, onViewDetails, onBook, compact = false }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const accent = accentFor(entry?.specialty || entry?.doctorName);
  const name = entry?.doctorName || "Unknown Doctor";
  const specialty = entry?.specialty || "General";
  const time = entry?.timing || "Time not set";
  const date = entry?.date || "Date not set";

  return (
    <>
      <article 
        className={`doctor-card glass-card ${compact ? "doctor-card--compact" : ""}`}
        aria-labelledby={`doctor-name-${name.replace(/\s+/g, '-')}`}
      >
        <header className="doctor-card__top">
          {entry?.photo ? (
            <div className="doctor-card__photo-wrapper" onClick={() => setIsZoomed(true)} title="Click to zoom photo">
              <img 
                className="doctor-card__photo" 
                src={entry.photo} 
                alt={`Portrait of ${name}`} 
                loading="lazy" 
              />
              <span className="doctor-card__photo-zoom-hint" aria-hidden="true">
                <ZoomIn size={14} />
              </span>
            </div>
          ) : (
            <div 
              className={`doctor-card__avatar doctor-card__avatar--${accent}`}
              aria-hidden="true"
            >
              {initials(name)}
            </div>
          )}
          <div className="doctor-card__id">
            <h3 id={`doctor-name-${name.replace(/\s+/g, '-')}`} className="doctor-card__name">
              {name}
            </h3>
            <span className={`badge badge-${accent === "teal" ? "teal" : accent}`}>
              {specialty}
            </span>
          </div>
        </header>

        <div className="doctor-card__meta">
          <p className="doctor-card__meta-row">
            <Clock size={16} aria-hidden="true" /> 
            <span className="visually-hidden">Time:</span> {time}
          </p>
          {!compact && (
            <p className="doctor-card__meta-row doctor-card__meta-row--muted">
              <Calendar size={16} aria-hidden="true" /> 
              <span className="visually-hidden">Date:</span> {date}
            </p>
          )}
        </div>

        <div className="doctor-card__actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px' }}>
          <button 
            className="btn btn-ghost doctor-card__cta" 
            onClick={() => onViewDetails && onViewDetails(entry)}
            aria-label={`View details for ${name}`}
            style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
          >
            Details <ArrowRight size={14} aria-hidden="true" />
          </button>
          {onBook && (
            <button
              className="btn btn-primary doctor-card__book-btn"
              onClick={(e) => {
                e.stopPropagation();
                onBook(entry);
              }}
              aria-label={`Book appointment with ${name}`}
              style={{ padding: '8px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              <CalendarDays size={14} /> Book
            </button>
          )}
        </div>
      </article>

      {isZoomed && entry?.photo && (
        <ImageZoomModal 
          src={entry.photo} 
          alt={name} 
          onClose={() => setIsZoomed(false)} 
        />
      )}
    </>
  );
}
