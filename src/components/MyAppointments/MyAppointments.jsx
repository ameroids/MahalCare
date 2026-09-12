import React, { useEffect, useState } from 'react';
import { CalendarX2, CalendarCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { loadUserBookings } from '../../data/bookingService.js';
import { formatLongDate } from '../../utils/dateUtils.js';
import './MyAppointments.css';

export default function MyAppointments({ auth }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      if (auth && auth.its) {
        const userBookings = await loadUserBookings(auth.its);
        setAppointments(userBookings);
      }
      setLoading(false);
    }
    fetchBookings();
  }, [auth]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="status-badge status-confirmed"><CalendarCheck size={14} /> Confirmed</span>;
      case 'Completed':
        return <span className="status-badge status-completed"><CheckCircle2 size={14} /> Completed</span>;
      case 'Cancelled':
        return <span className="status-badge status-cancelled"><XCircle size={14} /> Cancelled</span>;
      case 'Pending':
      default:
        return <span className="status-badge status-pending"><Clock size={14} /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="my-appointments container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <section className="my-appointments container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
      <header className="my-appointments__header">
        <h2>My Appointments</h2>
        <p>Track and manage your scheduled visits.</p>
      </header>

      {appointments.length === 0 ? (
        <div className="my-appointments__empty glass-card">
          <CalendarX2 size={48} className="text-teal-faint" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No Appointments Found</h3>
          <p>You haven't booked any appointments yet.</p>
        </div>
      ) : (
        <div className="my-appointments__list">
          {appointments.map((appt) => (
            <div key={appt.id} className="my-appointments__card glass-card">
              <div className="my-appointments__card-header">
                <div>
                  <span className="token-label">Token #{appt.token || 'N/A'}</span>
                  <h3>{appt.doctorName}</h3>
                  <p className="specialty-label">{appt.specialty}</p>
                </div>
                <div>
                  {getStatusBadge(appt.status)}
                </div>
              </div>
              
              <div className="my-appointments__card-body">
                <div className="detail-row">
                  <strong>Date:</strong> {formatLongDate(appt.date)}
                </div>
                <div className="detail-row">
                  <strong>Timing:</strong> {appt.timing}
                </div>
                {appt.reason && (
                  <div className="detail-row">
                    <strong>Reason:</strong> {appt.reason}
                  </div>
                )}
                <div className="detail-row text-xs text-muted" style={{ marginTop: '1rem' }}>
                  Booked on {new Date(appt.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
