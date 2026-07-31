import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRoster } from "../../context/RosterContext.jsx";
import NextDayDoctorCard from "./NextDayDoctorCard.jsx";
import DoctorModal from "../DoctorModal/DoctorModal.jsx";
import { getTomorrowISO, formatLongDate } from "../../utils/dateUtils.js";
import "./NextDayCarousel.css";

const AUTOPLAY_MS = 5000;

export default function NextDayCarousel({ onBookClick }) {
  const { entries } = useRoster();
  const tomorrow = getTomorrowISO();
  const doctors = useMemo(() => entries.filter((e) => e.date === tomorrow), [entries, tomorrow]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setVisibleCount(w < 640 ? 1 : w < 980 ? 2 : 3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const maxIndex = Math.max(0, doctors.length - visibleCount);

  useEffect(() => {
    if (paused || doctors.length <= visibleCount) return;
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, maxIndex, doctors.length, visibleCount]);

  useEffect(() => setIndex(0), [doctors.length, visibleCount]);

  const go = (delta) => {
    setIndex((i) => {
      const next = i + delta;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  };

  const cardWidthPct = 100 / visibleCount;

  return (
    <section id="next-day" className="section next-day">
      {/* Decorative SVG Background - Full Coverage */}
      <svg className="next-day__deco" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="220" cy="200" r="180" fill="rgba(15,118,110,0.06)" stroke="rgba(15,118,110,0.1)" strokeWidth="1"/>
        <circle cx="220" cy="200" r="130" fill="rgba(15,118,110,0.07)" stroke="rgba(15,118,110,0.12)" strokeWidth="1"/>
        <circle cx="220" cy="200" r="80"  fill="rgba(15,118,110,0.09)"/>
        <circle cx="220" cy="200" r="220" fill="none" stroke="rgba(15,118,110,0.06)" strokeWidth="1" strokeDasharray="4 8"/>
        <circle cx="220" cy="200" r="260" fill="none" stroke="rgba(15,118,110,0.04)" strokeWidth="1" strokeDasharray="3 10"/>
        <circle cx="380" cy="45"  r="32" fill="rgba(15,118,110,0.09)" stroke="rgba(15,118,110,0.15)" strokeWidth="1"/>
        <circle cx="380" cy="45"  r="18" fill="rgba(15,118,110,0.1)"/>
        <circle cx="880" cy="300" r="65" fill="rgba(15,118,110,0.07)" stroke="rgba(15,118,110,0.1)" strokeWidth="1"/>
        <circle cx="880" cy="300" r="38" fill="rgba(15,118,110,0.09)"/>
        <circle cx="1340" cy="80" r="22" fill="rgba(15,118,110,0.08)" stroke="rgba(15,118,110,0.14)" strokeWidth="1"/>
        <circle cx="60"  cy="380" r="48" fill="rgba(15,118,110,0.07)"/>
        <g fill="rgba(15,118,110,0.22)" stroke="none">
          <rect x="108" y="48"  width="5" height="22" rx="2.5"/><rect x="100" y="56"  width="21" height="5" rx="2.5"/>
          <rect x="475" y="22"  width="4" height="18" rx="2"/><rect x="468" y="29"  width="18" height="4" rx="2"/>
          <rect x="720" y="55"  width="4" height="18" rx="2"/><rect x="713" y="62"  width="18" height="4" rx="2"/>
          <rect x="1040" y="30" width="4" height="18" rx="2"/><rect x="1033" y="37" width="18" height="4" rx="2"/>
          <rect x="1360" y="200" width="3" height="14" rx="1.5"/><rect x="1354" y="206" width="14" height="3" rx="1.5"/>
          <rect x="600" y="330" width="3" height="14" rx="1.5"/><rect x="594" y="336" width="14" height="3" rx="1.5"/>
          <rect x="1150" y="310" width="4" height="18" rx="2"/><rect x="1143" y="317" width="18" height="4" rx="2"/>
        </g>
        <g fill="none" stroke="rgba(15,118,110,0.14)" strokeWidth="1">
          {[0,1,2,3,4,5].map(row =>
            [0,1,2,3,4,5,6].map(col => {
              const hx = 1060 + col * 54 + (row % 2 === 0 ? 0 : 27);
              const hy = -10 + row * 47;
              const r2 = 24;
              const pts = Array.from({length:6}, (_,i2) => {
                const a = Math.PI/180*(60*i2 - 30);
                return `${hx+r2*Math.cos(a)},${hy+r2*Math.sin(a)}`;
              }).join(' ');
              return <polygon key={`h${row}-${col}`} points={pts}/>;
            })
          )}
        </g>
        <path d="M0 340 Q180 290 360 320 Q540 350 720 310 Q900 270 1080 305 Q1260 340 1440 295 L1440 400 L0 400 Z" fill="rgba(15,118,110,0.05)"/>
        <path d="M0 360 Q200 310 420 345 Q640 378 860 340 Q1060 305 1260 340 Q1360 358 1440 330" fill="none" stroke="rgba(15,118,110,0.09)" strokeWidth="1.5"/>
        <path d="M0 380 Q250 335 500 368 Q750 398 1000 360 Q1200 328 1440 355" fill="none" stroke="rgba(15,118,110,0.06)" strokeWidth="1"/>
        <circle cx="310"  cy="90"  r="3.5" fill="rgba(15,118,110,0.22)"/>
        <circle cx="540"  cy="55"  r="2.5" fill="rgba(15,118,110,0.18)"/>
        <circle cx="670"  cy="200" r="4"   fill="rgba(15,118,110,0.14)"/>
        <circle cx="810"  cy="80"  r="2.5" fill="rgba(15,118,110,0.18)"/>
        <circle cx="950"  cy="160" r="3"   fill="rgba(15,118,110,0.15)"/>
        <circle cx="1120" cy="250" r="3.5" fill="rgba(15,118,110,0.12)"/>
        <circle cx="1260" cy="140" r="2.5" fill="rgba(15,118,110,0.18)"/>
        <circle cx="1390" cy="290" r="3"   fill="rgba(15,118,110,0.15)"/>
        <circle cx="440"  cy="310" r="2.5" fill="rgba(15,118,110,0.15)"/>
        <circle cx="760"  cy="355" r="2"   fill="rgba(15,118,110,0.18)"/>
      </svg>

      <div className="container">
        <div className="section-head next-day__head">
          <div className="next-day__title-wrap">
            <span className="eyebrow">Tomorrow at a glance</span>
            <h2 className="section-title">Next Day Doctors</h2>
            <p className="section-sub">{formatLongDate(tomorrow)}</p>
          </div>

          {doctors.length > visibleCount && (
            <div className="next-day__controls">
              <button className="next-day__arrow" onClick={() => go(-1)} aria-label="Previous doctors">‹</button>
              <button className="next-day__arrow" onClick={() => go(1)} aria-label="Next doctors">›</button>
            </div>
          )}
        </div>

        {doctors.length === 0 ? (
          <div className="empty-state">
            <strong>No doctors scheduled for tomorrow yet</strong>
            <p>Once the admin uploads the latest roster file, tomorrow's doctors will appear here automatically.</p>
          </div>
        ) : (
          <>
            <div
              className="next-day__viewport"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div
                ref={trackRef}
                className="next-day__track"
                style={{ transform: `translateX(-${index * cardWidthPct}%)` }}
              >
                {doctors.map((entry) => (
                  <div key={entry.id} className="next-day__slide" style={{ flexBasis: `${cardWidthPct}%` }}>
                    <NextDayDoctorCard entry={entry} onViewDetails={setSelected} onBook={onBookClick} />
                  </div>
                ))}
              </div>
            </div>

            {doctors.length > visibleCount && (
              <div className="next-day__dots">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    className={`next-day__dot ${i === index ? "next-day__dot--active" : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selected && <DoctorModal entry={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
