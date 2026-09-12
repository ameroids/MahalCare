import React, { useState } from 'react';
import { Download, Trash2, CalendarX2, CalendarDays, FileSpreadsheet } from 'lucide-react';
import { useBookings } from '../../context/BookingContext.jsx';
import { formatLongDate, getTodayISO } from '../../utils/dateUtils.js';
import './AdminBookings.css';

export default function AdminBookings() {
  const { bookings, clearAllBookings, updateStatus } = useBookings();
  const [viewMode, setViewMode] = useState('daywise'); // 'daywise' | 'all'
  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  const displayedBookings = viewMode === 'daywise' 
    ? bookings.filter(b => b.date === selectedDate)
    : bookings;

  const handleDownloadCSV = () => {
    if (displayedBookings.length === 0) return;

    // Headers
    const headers = ['Token', 'Booking ID', 'Patient Name', 'ITS Number', 'Phone', 'Reason', 'Doctor', 'Specialty', 'Appointment Date', 'Timing', 'Status', 'Booked At'];
    
    // Rows
    const rows = displayedBookings.map(b => [
      b.token || 'N/A',
      b.id,
      `"${b.name}"`,
      b.its,
      `"${b.phone}"`,
      `"${b.reason.replace(/"/g, '""')}"`, // escape quotes
      `"${b.doctorName}"`,
      `"${b.specialty}"`,
      b.date,
      `"${b.timing}"`,
      `"${b.status || 'Pending'}"`,
      new Date(b.createdAt).toLocaleString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    const filename = viewMode === 'daywise' 
      ? `bookings_${selectedDate}.csv` 
      : `all_bookings_record_${new Date().toISOString().split('T')[0]}.csv`;
      
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to delete ALL booking records? This cannot be undone.")) {
      clearAllBookings();
    }
  };

  return (
    <section className="admin-bookings glass-card">
      <header className="admin-bookings__header">
        <div>
          <h2>Booking Records</h2>
          <p>View and download patient appointments.</p>
        </div>
        <div className="admin-bookings__actions">
          {bookings.length > 0 && viewMode === 'all' && (
            <button className="btn btn-secondary btn-sm" onClick={handleClear}>
              <Trash2 size={16} /> Clear All
            </button>
          )}
          {displayedBookings.length > 0 && (
            <button className="btn btn-primary btn-sm" onClick={handleDownloadCSV}>
              <Download size={16} /> Download CSV
            </button>
          )}
        </div>
      </header>

      <div className="admin-bookings__tabs">
        <button 
          className={`btn ${viewMode === 'daywise' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setViewMode('daywise')}
        >
          <CalendarDays size={16} /> Daywise Records
        </button>
        <button 
          className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setViewMode('all')}
        >
          <FileSpreadsheet size={16} /> All Records (Monthly)
        </button>
      </div>

      {viewMode === 'daywise' && (
        <div className="admin-bookings__date-picker">
          <label htmlFor="daywise-date">Select Date:</label>
          <input 
            id="daywise-date"
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      )}

      {displayedBookings.length === 0 ? (
        <div className="admin-bookings__empty">
          <CalendarX2 size={48} className="text-teal-faint" />
          <p>{viewMode === 'daywise' ? `No bookings found for ${formatLongDate(selectedDate)}.` : 'No bookings have been made yet.'}</p>
        </div>
      ) : (
        <div className="admin-bookings__table-wrap">
          <table className="admin-bookings__table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient</th>
                <th>ITS Number</th>
                <th>Doctor</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th>Booked At</th>
              </tr>
            </thead>
            <tbody>
              {displayedBookings.map(b => (
                <tr key={b.id}>
                  <td data-label="Token">
                    <strong className="admin-bookings__token">{b.token || '—'}</strong>
                  </td>
                  <td data-label="Patient">
                    <strong>{b.name}</strong>
                    <div className="text-xs text-muted">{b.phone}</div>
                  </td>
                  <td data-label="ITS Number">{b.its}</td>
                  <td data-label="Doctor">
                    <strong>{b.doctorName}</strong>
                    <div className="text-xs text-muted">{b.specialty}</div>
                  </td>
                  <td data-label="Appointment Date">
                    {formatLongDate(b.date)}
                    <div className="text-xs text-muted">{b.timing}</div>
                  </td>
                  <td data-label="Status">
                    <select 
                      value={b.status || 'Pending'} 
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="admin-bookings__status-select"
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td data-label="Booked At" className="text-xs text-muted">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
