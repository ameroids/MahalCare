import React, { useState } from 'react';
import './WhatsAppButton.css';

export default function WhatsAppButton() {
  const [showWarning, setShowWarning] = useState(false);

  const handleEmergencyClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const handleProceedCall = () => {
    setShowWarning(false);
    window.location.href = "tel:+917747848953";
  };

  return (
    <>
      <div className="floating-buttons-container">
        <a 
          href="tel:+917747848953" 
          className="float-btn emergency-btn" 
          aria-label="Emergency Contact"
          onClick={handleEmergencyClick}
        >
          <svg viewBox="0 0 24 24" className="float-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="float-text">Emergency</span>
        </a>

        <a 
          href="https://wa.me/917223861653" 
          className="float-btn whatsapp-btn" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Enquiry on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="float-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
          <span className="float-text">Enquiry</span>
        </a>
      </div>

      {showWarning && (
        <div className="emergency-modal-backdrop">
          <div className="emergency-modal glass-card">
            <div className="emergency-modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>Emergency Use Only</h3>
            <p>Please use this number <strong>strictly for medical emergencies</strong>. For general inquiries, appointments, or other matters, please use the Enquiry button.</p>
            <div className="emergency-modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowWarning(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#d93025', borderColor: '#d93025', color: '#fff' }} onClick={handleProceedCall}>Call Now</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
