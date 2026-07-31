import React from "react";
import { getMonthMatrix, monthLabel, WEEKDAY_LABELS } from "../../utils/dateUtils.js";
import "./CalendarView.css";

export default function CalendarView({ year, monthIndex, entriesByDate, selectedDate, onSelectDate, onPrevMonth, onNextMonth, onToday }) {
  const cells = getMonthMatrix(year, monthIndex);

  return (
    <div className="calendar-view">
      <div className="calendar-view__bar">
        <div className="calendar-view__month">{monthLabel(year, monthIndex)}</div>
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
              <span className="calendar-view__day-num">{cell.day}</span>
              {dayEntries.length > 0 && (
                <span className="calendar-view__chips">
                  {dayEntries.slice(0, 2).map((e) => (
                    <span key={e.id} className="calendar-view__chip">{e.doctorName.replace(/^Dr\.?\s*/i, "")}</span>
                  ))}
                  {dayEntries.length > 2 && (
                    <span className="calendar-view__chip calendar-view__chip--more">+{dayEntries.length - 2} more</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
