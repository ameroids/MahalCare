import React from "react";
import { CalendarDays } from "lucide-react";
import "./NextDayDoctorCard.css";

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

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, " ");
}

export default function NextDayDoctorCard({ entry, onViewDetails, onBook }) {
  const name      = entry?.doctorName || "Unknown Doctor";
  const specialty = entry?.specialty  || "General";
  const time      = entry?.timing     || "—";
  const date      = entry?.date       || "—";

  return (
    <article className="nd-card" aria-label={`Tomorrow's doctor: ${name}`}>
      {/* ── Header ── */}
      <div className="nd-card__header">
        <div className="nd-card__header-text">
          <span className="nd-card__eyebrow">Tomorrow's Doctor</span>
          <span className="nd-card__brand">Mahal al Shifa</span>
        </div>
        {entry?.photo ? (
          <img src={entry.photo} alt={name} className="nd-card__avatar-photo" />
        ) : (
          <div className="nd-card__avatar" aria-hidden="true">
            {initials(name)}
          </div>
        )}
      </div>

      {/* ── Info rows ── */}
      <div className="nd-card__body">
        <div className="nd-card__row">
          <span className="nd-card__label">Doctor</span>
          <span className="nd-card__value nd-card__value--name">{name}</span>
        </div>
        <div className="nd-card__row">
          <span className="nd-card__label">Specialty</span>
          <span className="nd-card__value nd-card__value--bold">{specialty}</span>
        </div>
        <div className="nd-card__row">
          <span className="nd-card__label">Time</span>
          <span className="nd-card__value nd-card__value--teal">{time}</span>
        </div>
        <div className="nd-card__row">
          <span className="nd-card__label">Date</span>
          <span className="nd-card__value nd-card__value--bold">{formatDate(date)}</span>
        </div>
        <div className="nd-card__row nd-card__row--last">
          <span className="nd-card__label">Location</span>
          <span className="nd-card__value">Indore Saifee Nagar</span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="nd-card__footer">
        <button
          className="nd-card__btn-ghost"
          onClick={() => onViewDetails && onViewDetails(entry)}
          aria-label={`View details for ${name}`}
        >
          Details →
        </button>
      </div>
    </article>
  );
}
