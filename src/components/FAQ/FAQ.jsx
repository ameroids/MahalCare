import React, { useEffect, useState } from "react";
import { ChevronDown, HelpCircle, Search, MessageSquare, PhoneCall, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./FAQ.css";

const FAQS = [
  {
    id: 1,
    question: "How do I book an appointment with a doctor?",
    answer: "Click the 'Book Appointment' or 'Book' button on any doctor card across Today's Doctor, Tomorrow's Doctor, or the Monthly Roster. Fill in your name, 8-digit ITS number, phone, and reason. Your request will be automatically formatted with a daily token and sent to our WhatsApp desk (+91 9244064277).",
    category: "Booking"
  },
  {
    id: 2,
    question: "How do booking token numbers work?",
    answer: "Every day, appointment tokens start sequentially at 001 (e.g. 001, 002, 003). Each new date automatically resets back to 001. Please keep your token number ready when arriving at the reception desk.",
    category: "Tokens"
  },
  {
    id: 3,
    question: "Can I view full-size doctor photos?",
    answer: "Yes! Simply click on any doctor's photo thumbnail on Today's Doctor, Tomorrow's Doctor, or Calendar cards to open an interactive full-screen photo zoom view.",
    category: "Photos"
  },
  {
    id: 4,
    question: "When is the doctor roster updated?",
    answer: "The roster is updated automatically whenever Umoor Sehhat medical administration publishes the latest monthly schedule. When no schedule file is published or when cleared by admin, the roster displays an empty schedule.",
    category: "Roster"
  },
  {
    id: 5,
    question: "Can I print or save doctor visit schedules?",
    answer: "Yes! Click 'Details' on any doctor entry in the calendar or monthly roster table, then click 'Print / Save PDF' to save or print your appointment slip.",
    category: "General"
  },
  {
    id: 6,
    question: "How can I contact WhatsApp Support or Emergency Helpdesk?",
    answer: "For general inquiries or support, click the floating Enquiry button on the bottom right or WhatsApp Support in the footer to message +91 9244064277. For urgent medical emergencies, call +91 96308 52953.",
    category: "Support"
  }
];


export default function FAQModal({ onClose }) {
  const [openId, setOpenId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faq-modal__backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="faq-modal glass-card" role="dialog" aria-modal="true" aria-label="Frequently Asked Questions">
        <button className="faq-modal__close" onClick={onClose} aria-label="Close FAQ modal">×</button>

        {/* Modal Header */}
        <div className="faq-modal__head">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '0.75rem' }}>
            <img src="/mahal-al-shifa-logo.png" alt="Mahal al Shifa Logo" style={{ height: '38px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '8px', display: 'block' }} />
            <h2 style={{ margin: 0, fontSize: '1.4rem', whiteSpace: 'nowrap' }}>Mahal Al Shifa</h2>
          </div>
          <span className="eyebrow">
            <HelpCircle size={14} aria-hidden="true" /> Got Questions?
          </span>
          <h3>Frequently Asked Questions</h3>
          <p>Everything you need to know about doctor rosters & appointments.</p>
        </div>

        {/* Search Filter */}
        <div className="faq-search-wrap">
          <div className="faq-search-box">
            <Search size={18} className="faq-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search questions (e.g. booking, ITS, timing)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="faq-search-input"
              aria-label="Search FAQs"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="faq-search-clear"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Accordion List */}
        <div className="faq-list">
          {filteredFaqs.length === 0 ? (
            <div className="empty-state">
              <strong>No matching questions found</strong>
              <p>Try searching with a different keyword or contact support.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`faq-card ${isOpen ? "faq-card--open" : ""}`}
                >
                  <button
                    className="faq-trigger"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className="faq-question">
                      {faq.question}
                    </span>
                    <span className="faq-badge">{faq.category}</span>
                    <ChevronDown
                      size={20}
                      className={`faq-chevron ${isOpen ? "faq-chevron--rotated" : ""}`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        className="faq-answer-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <div className="faq-answer-content">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Support Footer */}
        <div className="faq-contact-banner">
          <div className="faq-contact-info">
            <MessageSquare size={20} className="text-teal" />
            <div>
              <h4>Need direct assistance?</h4>
              <p>Chat directly with our support team.</p>
            </div>
          </div>
          <div className="faq-contact-actions">
            <a
              href="https://wa.me/919244064277?text=Hi%2C%20I%20have%20a%20question%20about%20Mahal al Shifa"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
            >
              <MessageSquare size={14} /> WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
