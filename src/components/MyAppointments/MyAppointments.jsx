import React from 'react';
import { CalendarCheck, Clock, Stethoscope, Trash2 } from 'lucide-react';
import { useBookings } from '../../context/BookingContext.jsx';
import { formatLongDate } from '../../utils/dateUtils.js';
import './MyAppointments.css';

export default function MyAppointments({ userIts }) {
  const { bookings } = useBookings();
  
  // Only show bookings that belong to the currently logged-in user
  const myBookings = bookings.filter((b) => b.its === userIts);
  return (
    <section id="my-appointments" className="my-appointments" aria-labelledby="my-appointments-heading">
      <div className="container">
        <header className="my-appointments__header">
          <span className="eyebrow">Your Schedule</span>
          <h2 id="my-appointments-heading">My Appointments</h2>
          <p>Track all your upcoming consultations in one place.</p>
        </header>

        {myBookings.length === 0 ? (
          <div className="my-appointments__empty glass-card">
            <CalendarCheck size={48} aria-hidden="true" />
            <h3>No Appointments Yet</h3>
            <p>Browse available doctors and book your first appointment to see it here.</p>
          </div>
        ) : (
          <div className="my-appointments__grid">
            {myBookings.map((b) => (
              <article key={b.id} className="my-appointments__card glass-card">
                <div className="my-appointments__card-badge">
                  <span className="badge badge-teal">{b.specialty}</span>
                  {b.token && <span className="my-appointments__token">{b.token}</span>}
                </div>
                <div className="my-appointments__card-body">
                  <h3 className="my-appointments__doctor">{b.doctorName}</h3>
                  <div className="my-appointments__meta">
                    <div className="my-appointments__meta-item">
                      <CalendarCheck size={14} aria-hidden="true" />
                      <span>{formatLongDate(b.date)}</span>
                    </div>
                    <div className="my-appointments__meta-item">
                      <Clock size={14} aria-hidden="true" />
                      <span>{b.timing}</span>
                    </div>
                    <div className="my-appointments__meta-item">
                      <Stethoscope size={14} aria-hidden="true" />
                      <span>{b.reason}</span>
                    </div>
                  </div>
                </div>
                <div className="my-appointments__card-footer">
                  <span className="my-appointments__patient">Patient: {b.name}</span>
                  <span className="my-appointments__booked-at">Booked {new Date(b.createdAt).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
