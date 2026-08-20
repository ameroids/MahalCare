import React from "react";
import "./Filters.css";

export default function Filters({ specialties, specialty, onSpecialtyChange, search, onSearchChange, onClear, hasActiveFilters }) {
  return (
    <div className="filters glass-card">
      <div className="filters__field">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search doctor name…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search doctor name"
        />
      </div>

      <div className="filters__field filters__field--select">
        <FilterIcon />
        <select value={specialty} onChange={(e) => onSpecialtyChange(e.target.value)} aria-label="Filter by specialty">
          <option value="">All specialties</option>
          {specialties.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button className="btn btn-ghost btn-sm filters__clear" onClick={onClear}>Clear filters</button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}
