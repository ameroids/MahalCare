import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Phone, FileText, Send, CheckCircle2, Hash, AlertCircle } from "lucide-react";
import { useRoster } from "../../context/RosterContext.jsx";
import { useBookings } from "../../context/BookingContext.jsx";
import { formatLongDate } from "../../utils/dateUtils.js";
import "./BookingModal.css";

const WHATSAPP_NUMBER = "919244064277"; // Umoor Sehhat / Mahal al Shifa desk number

export default function BookingModal({ initialDoctor = null, onClose }) {
  const { entries } = useRoster();
  const { bookAppointment } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    its: "",
    phone: "",
    selectedDoctorId: initialDoctor ? initialDoctor.id : (entries && entries[0] ? entries[0].id : ""),
    customDoctor: initialDoctor ? initialDoctor.doctorName : "",
    reason: ""
  });

  const [submittedToken, setSubmittedToken] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Selected doctor record if picked from list
  const activeDoctor = entries?.find((e) => e.id === formData.selectedDoctorId) || initialDoctor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const docName = activeDoctor ? activeDoctor.doctorName : (formData.customDoctor || "General Consultation");
    const specialty = activeDoctor?.specialty || "Medical Visit";
    const dateTimeStr = activeDoctor ? `${formatLongDate(activeDoctor.date)} (${activeDoctor.timing})` : "As scheduled";

    const result = await bookAppointment({
      name: formData.name,
      its: formData.its,
      phone: formData.phone,
      reason: formData.reason,
      doctorName: docName,
      specialty: specialty,
      date: activeDoctor?.date || "",
      timing: activeDoctor?.timing || ""
    });

    const token = result.booking.token;
    setSubmittedToken(token);
    setIsSubmitting(false);

    // Format WhatsApp message
    const message = 
`*Mahal al Shifa Appointment Request*
---------------------------------
*Patient Name:* ${formData.name}
*ITS Number:* ${formData.its}
*Phone:* ${formData.phone}
*Doctor:* ${docName}
*Specialty:* ${specialty}
*Scheduled:* ${dateTimeStr}
${formData.reason ? `*Reason:* ${formData.reason}\n` : ""}*Booking Token:* #${token}
---------------------------------
Please confirm my appointment. Thank you!`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new window/app
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="booking-modal__backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal glass-card" role="dialog" aria-modal="true" aria-label="Book Appointment">
        <button className="booking-modal__close" onClick={onClose} aria-label="Close modal">×</button>

        {!submittedToken ? (
          <>
            <div className="booking-modal__header">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                <img src="/mahal-al-shifa-logo.png" alt="Mahal al Shifa Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff', padding: '4px 10px', borderRadius: '8px', display: 'block' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem', whiteSpace: 'nowrap' }}>Mahal Al Shifa</h2>
              </div>
              <span className="eyebrow">Quick & Easy</span>
              <h2>Book an Appointment</h2>
              <p>Fill in your details below. Your request will be pre-formatted and forwarded directly to our WhatsApp helpdesk.</p>
            </div>

            <form className="booking-modal__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="patient-name">
                  <User size={15} /> Patient Name <span className="req">*</span>
                </label>
                <input
                  id="patient-name"
                  type="text"
                  required
                  placeholder="e.g. Taher Merchant"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patient-its">
                    <Hash size={15} /> ITS Number <span className="req">*</span>
                  </label>
                  <input
                    id="patient-its"
                    type="text"
                    required
                    pattern="\d{8}"
                    title="8-digit ITS number"
                    placeholder="8-digit ITS"
                    value={formData.its}
                    onChange={(e) => setFormData({ ...formData, its: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="patient-phone">
                    <Phone size={15} /> Mobile Number <span className="req">*</span>
                  </label>
                  <input
                    id="patient-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="select-doctor">
                  <Calendar size={15} /> Select Scheduled Doctor
                </label>
                {entries && entries.length > 0 ? (
                  <select
                    id="select-doctor"
                    value={formData.selectedDoctorId}
                    onChange={(e) => setFormData({ ...formData, selectedDoctorId: e.target.value })}
                  >
                    {entries.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.doctorName} — {doc.specialty} ({formatLongDate(doc.date)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Doctor Name or Specialty"
                    value={formData.customDoctor}
                    onChange={(e) => setFormData({ ...formData, customDoctor: e.target.value })}
                  />
                )}
              </div>

              <div className="form-group">
                <label htmlFor="patient-reason">
                  <FileText size={15} /> Reason / Medical Symptoms (Optional)
                </label>
                <textarea
                  id="patient-reason"
                  rows="3"
                  placeholder="Briefly describe your symptoms or visit reason..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="booking-modal__warning" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', backgroundColor: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '8px', color: 'var(--c-amber-700)', fontSize: '0.85rem', lineHeight: '1.4', marginTop: '4px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span><strong>Important:</strong> Your appointment will only be booked if you press <strong>Send</strong> after WhatsApp opens!</span>
              </div>

              <button type="submit" className="btn btn-primary booking-modal__submit" disabled={isSubmitting}>
                <Send size={18} /> {isSubmitting ? "Generating Token..." : "Submit & Forward to WhatsApp"}
              </button>
            </form>
          </>
        ) : (
          <div className="booking-modal__success">
            <CheckCircle2 size={54} className="success-icon" />
            <h3>Request Sent to WhatsApp!</h3>
            <p>Your appointment details have been forwarded to Mahal al Shifa helpdesk.</p>

            <div className="booking-modal__token-box">
              <span>Your Booking Token</span>
              <strong>#{submittedToken}</strong>
            </div>

            <p className="booking-modal__token-note">
              Please save this token number. Show it at the medical center reception upon arrival.
            </p>

            <button className="btn btn-secondary" onClick={onClose} style={{ width: "100%", marginTop: "1rem" }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
