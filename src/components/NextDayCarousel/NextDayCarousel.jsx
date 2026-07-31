import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRoster } from "../../context/RosterContext.jsx";
import DoctorCard from "../DoctorCard/DoctorCard.jsx";
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
      <div className="container">
        <div className="section-head next-day__head">
          <div>
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
                    <DoctorCard entry={entry} onViewDetails={setSelected} onBook={onBookClick} />
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
