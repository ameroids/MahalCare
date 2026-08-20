import React from "react";
import { getMonthMatrix, monthLabel, WEEKDAY_LABELS } from "../../utils/dateUtils.js";
import "./CalendarView.css";

export default function CalendarView({ year, monthIndex, entriesByDate, selectedDate, onSelectDate, onPrevMonth, onNextMonth, onToday, isHijri }) {
  const cells = getMonthMatrix(year, monthIndex);

  const getDisplayDay = (cell, dayEntries) => {
    if (!isHijri) return cell.day;
    
    // If the Excel explicitly provided a hijri date for this day
    if (dayEntries.length > 0 && dayEntries[0].hijriDate) {
      const hd = String(dayEntries[0].hijriDate);
      return hd.replace(/[0-9]/g, w => String.fromCharCode(w.charCodeAt(0) + 1584));
    }
    
    // Fallback: Calculate mathematically
    try {
      const d = new Date(cell.iso);
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric' }).format(d);
    } catch(e) {
      return cell.day;
    }
  };

  const HIJRI_MONTHS_AR = [
    "محرم الحرام", 
    "صفر المظفر", 
    "ربيع الأول", 
    "ربيع الآخر", 
    "جمادى الأول", 
    "جمادى الآخر", 
    "رجب الأصب", 
    "شعبان الكريم", 
    "رمضان المعظم", 
    "شوال المكرم", 
    "ذو القعدة الحرام", 
    "ذو الحجة الحرام"
  ];

  const getHijriMonthAndYear = (date) => {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic', { month: 'numeric', year: 'numeric' });
    const parts = formatter.formatToParts(date);
    const mPart = parts.find(p => p.type === 'month')?.value;
    const yPart = parts.find(p => p.type === 'year')?.value;
    const mIndex = parseInt(mPart, 10) - 1;
    // convert year to arabic digits
    const arabicYear = String(yPart).replace(/[0-9]/g, w => String.fromCharCode(w.charCodeAt(0) + 1584));
    return {
      monthName: HIJRI_MONTHS_AR[mIndex] || "",
      year: arabicYear
    };
  };

  const displayMonthLabel = () => {
    if (!isHijri) return monthLabel(year, monthIndex);
    try {
      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);

      const firstHijri = getHijriMonthAndYear(firstDay);
      const lastHijri = getHijriMonthAndYear(lastDay);

      if (firstHijri.monthName !== lastHijri.monthName) {
        return `${firstHijri.monthName} - ${lastHijri.monthName} ${lastHijri.year}`;
      }
      return `${firstHijri.monthName} ${lastHijri.year}`;
    } catch(e) {
      return monthLabel(year, monthIndex);
    }
  };

  return (
    <div className={`calendar-view ${isHijri ? 'calendar-view--hijri' : ''}`}>
      <div className="calendar-view__bar">
        <div className="calendar-view__month">{displayMonthLabel()}</div>
        <div className="calendar-view__nav">
          <button className="btn btn-ghost btn-sm" onClick={onToday}>Today</button>
          <button className="calendar-view__step" onClick={onPrevMonth} aria-label="Previous month">‹</button>
          <button className="calendar-view__step" onClick={onNextMonth} aria-label="Next month">›</button>
        </div>
      </div>

      <div className="calendar-view__weekdays">
        {WEEKDAY_LABELS.map((w) => <span key={w}>{w}</span>)}
      </div>

      <div className="calendar-view__grid">
        {cells.map((cell) => {
          const dayEntries = entriesByDate.get(cell.iso) || [];
          const isSelected = cell.iso === selectedDate;
          return (
            <button
              key={cell.iso}
              className={[
                "calendar-view__cell",
                !cell.inMonth && "calendar-view__cell--muted",
                cell.isToday && "calendar-view__cell--today",
                isSelected && "calendar-view__cell--selected",
                dayEntries.length > 0 && "calendar-view__cell--has-entries",
              ].filter(Boolean).join(" ")}
              onClick={() => onSelectDate(cell.iso)}
            >
              <span className="calendar-view__day-num" style={isHijri ? { fontSize: '1.2em', fontWeight: 'bold' } : {}}>{getDisplayDay(cell, dayEntries)}</span>
              {dayEntries.length > 0 ? (
                <span className="calendar-view__chips">
                  {dayEntries.slice(0, 2).map((e) => (
                    <span key={e.id} className="calendar-view__chip">{e.doctorName.replace(/^Dr\.?\s*/i, "")}</span>
                  ))}
                  {dayEntries.length > 2 && (
                    <span className="calendar-view__chip calendar-view__chip--more">+{dayEntries.length - 2} more</span>
                  )}
                </span>
              ) : (
                <span className="calendar-view__chips">
                  <span className="calendar-view__chip" style={{ background: "transparent", border: "1px dashed var(--c-border-soft)", color: "var(--c-text-faint)", fontWeight: "normal" }}>
                    No Schedule
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
