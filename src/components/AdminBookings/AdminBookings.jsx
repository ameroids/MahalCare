import React from 'react';
import { Download, Trash2, CalendarX2 } from 'lucide-react';
import { useBookings } from '../../context/BookingContext.jsx';
import { formatLongDate } from '../../utils/dateUtils.js';
import './AdminBookings.css';

export default function AdminBookings() {
  const { bookings, clearAllBookings } = useBookings();

  const handleDownloadCSV = () => {
    if (bookings.length === 0) return;

    // Headers
    const headers = ['Token', 'Booking ID', 'Patient Name', 'ITS Number', 'Phone', 'Reason', 'Doctor', 'Specialty', 'Appointment Date', 'Timing', 'Booked At'];
    
    // Rows
    const rows = bookings.map(b => [
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
      new Date(b.createdAt).toLocaleString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bookings_record_${new Date().toISOString().split('T')[0]}.csv`);
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
          {bookings.length > 0 && (
            <>
              <button className="btn btn-secondary btn-sm" onClick={handleClear}>
                <Trash2 size={16} /> Clear All
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleDownloadCSV}>
                <Download size={16} /> Download CSV
              </button>
            </>
          )}
        </div>
      </header>

      {bookings.length === 0 ? (
        <div className="admin-bookings__empty">
          <CalendarX2 size={48} className="text-teal-faint" />
          <p>No bookings have been made yet.</p>
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
                <th>Booked At</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <strong className="admin-bookings__token">{b.token || '—'}</strong>
                  </td>
                  <td>
                    <strong>{b.name}</strong>
                    <div className="text-xs text-muted">{b.phone}</div>
                  </td>
                  <td>{b.its}</td>
                  <td>
                    <strong>{b.doctorName}</strong>
                    <div className="text-xs text-muted">{b.specialty}</div>
                  </td>
                  <td>
                    {formatLongDate(b.date)}
                    <div className="text-xs text-muted">{b.timing}</div>
                  </td>
                  <td className="text-xs text-muted">
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
