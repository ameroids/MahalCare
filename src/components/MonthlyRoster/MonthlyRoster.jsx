import React, { useMemo, useState } from "react";
import { useRoster } from "../../context/RosterContext.jsx";
import Filters from "../Filters/Filters.jsx";
import CalendarView from "../CalendarView/CalendarView.jsx";
import DoctorCard from "../DoctorCard/DoctorCard.jsx";
import DoctorModal from "../DoctorModal/DoctorModal.jsx";
import { formatLongDate, formatShortDate, getTodayISO } from "../../utils/dateUtils.js";
import { motion } from "framer-motion";
import "./MonthlyRoster.css";

export default function MonthlyRoster({ onBookClick }) {
  const { entries, specialties } = useRoster();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [view, setView] = useState("calendar");
  const [specialty, setSpecialty] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [selectedEntry, setSelectedEntry] = useState(null);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesSpecialty = !specialty || e.specialty === specialty;
      const matchesSearch = !search || e.doctorName.toLowerCase().includes(search.toLowerCase());
      return matchesSpecialty && matchesSearch;
    });
  }, [entries, specialty, search]);

  const entriesByDate = useMemo(() => {
    const map = new Map();
    filtered.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    });
    return map;
  }, [filtered]);

  const monthEntries = useMemo(() => {
    return filtered
      .filter((e) => {
        const [y, m] = e.date.split("-").map(Number);
        return y === year && m - 1 === monthIndex;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered, year, monthIndex]);

  const selectedDayEntries = entriesByDate.get(selectedDate) || [];

  const goPrevMonth = () => {
    if (monthIndex === 0) { setMonthIndex(11); setYear((y) => y - 1); }
    else setMonthIndex((m) => m - 1);
  };
  const goNextMonth = () => {
    if (monthIndex === 11) { setMonthIndex(0); setYear((y) => y + 1); }
    else setMonthIndex((m) => m + 1);
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonthIndex(today.getMonth());
    setSelectedDate(getTodayISO());
  };

  const hasActiveFilters = Boolean(specialty || search);
  const clearFilters = () => { setSpecialty(""); setSearch(""); };

  return (
    <section id="monthly-roster" className="section monthly-roster">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-head monthly-roster__head">
          <div>
            <span className="eyebrow">The full picture</span>
            <h2 className="section-title">Monthly Roster</h2>
            <p className="section-sub">Browse every doctor visit for the month — filter by specialty or search a name.</p>
          </div>

          <div className="monthly-roster__toggle">
            <button className={view === "calendar" ? "is-active" : ""} onClick={() => setView("calendar")}>Calendar</button>
            <button className={view === "table" ? "is-active" : ""} onClick={() => setView("table")}>Table</button>
          </div>
        </div>

        <Filters
          specialties={specialties}
          specialty={specialty}
          onSpecialtyChange={setSpecialty}
          search={search}
          onSearchChange={setSearch}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {view === "calendar" ? (
          <div className="monthly-roster__calendar-layout">
            <div className="glass-card monthly-roster__calendar-card">
              <CalendarView
                year={year}
                monthIndex={monthIndex}
                entriesByDate={entriesByDate}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onPrevMonth={goPrevMonth}
                onNextMonth={goNextMonth}
                onToday={goToday}
              />
            </div>

            <div className="monthly-roster__day-panel">
              <h3 className="monthly-roster__day-title">{formatLongDate(selectedDate)}</h3>
              {selectedDayEntries.length === 0 ? (
                <div className="empty-state empty-state--compact">
                  <strong>No visits on this date</strong>
                  <p>Choose another date on the calendar to see who's available.</p>
                </div>
              ) : (
                <div className="monthly-roster__day-grid">
                  {selectedDayEntries.map((entry) => (
                    <DoctorCard key={entry.id} entry={entry} onViewDetails={setSelectedEntry} onBook={onBookClick} compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="monthly-roster__table-wrap glass-card">
            {monthEntries.length === 0 ? (
              <div className="empty-state">
                <strong>No matching visits this month</strong>
                <p>Try clearing filters or checking a different month.</p>
              </div>
            ) : (
              <table className="monthly-roster__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Timing</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {monthEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td data-label="Date">{formatShortDate(entry.date)}</td>
                      <td data-label="Doctor">{entry.doctorName}</td>
                      <td data-label="Specialty"><span className="badge">{entry.specialty}</span></td>
                      <td data-label="Timing">{entry.timing}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEntry(entry)}>Details</button>
                        <button className="btn btn-primary btn-sm" onClick={() => onBookClick && onBookClick(entry)}>Book</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </motion.div>

      {selectedEntry && <DoctorModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
    </section>
  );
}
