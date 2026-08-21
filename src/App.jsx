import React, { useState, useEffect } from "react";
import { RosterProvider } from "./context/RosterContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import NextDayCarousel from "./components/NextDayCarousel/NextDayCarousel.jsx";
import MonthlyRoster from "./components/MonthlyRoster/MonthlyRoster.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AdminUpload from "./components/AdminUpload/AdminUpload.jsx";

import Login from "./components/Login/Login.jsx";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton.jsx";
import HealthAdvice from "./components/HealthAdvice/HealthAdvice.jsx";
import FAQModal from "./components/FAQ/FAQ.jsx";
import BookingModal from "./components/BookingModal/BookingModal.jsx";
import AmeroidsLoader from "./components/AmeroidsLoader/AmeroidsLoader.jsx";


export default function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('mahalcare_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  }); // { role: 'user'|'admin', its: '...' }
  const [pendingAuth, setPendingAuth] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);


  const handleOpenBooking = (doctor = null) => {
    setBookingDoctor(doctor || null);
    setShowBooking(true);
  };

  useEffect(() => {
    if (auth) {
      localStorage.setItem('mahalcare_auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('mahalcare_auth');
    }
  }, [auth]);

  return (
    <BookingProvider>
      <RosterProvider>
        {/* Main Content */}
        {!auth && !pendingAuth ? (
          <Login onLogin={setPendingAuth} />
        ) : pendingAuth ? (
          <AmeroidsLoader onComplete={() => {
            setAuth(pendingAuth);
            setPendingAuth(null);
          }} />
        ) : auth.role === 'admin' ? (
          <div className="admin-page" style={{ padding: '1rem', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/MahalCare_Logo.png" alt="MahalCare Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '8px' }} />
                  <h2 style={{ margin: 0 }}>Admin Panel</h2>
                </div>
                <button className="btn btn-secondary" onClick={() => setAuth(null)}>Logout</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1rem' }}>
                  <AdminUpload onDone={() => {}} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Navbar onLogout={() => setAuth(null)} onBookClick={handleOpenBooking} />
            <main>
              <Hero onBookClick={handleOpenBooking} />
              <NextDayCarousel onBookClick={handleOpenBooking} />
              <MonthlyRoster onBookClick={handleOpenBooking} />
              <HealthAdvice />
            </main>
            <Footer onOpenFAQ={() => setShowFAQ(true)} />
            {showFAQ && <FAQModal onClose={() => setShowFAQ(false)} />}
            {showBooking && <BookingModal initialDoctor={bookingDoctor} onClose={() => setShowBooking(false)} />}
            <WhatsAppButton />
          </>
        )}

        {/* Loader Overlay */}
        {isInitialLoad && (
          <AmeroidsLoader onComplete={() => setIsInitialLoad(false)} />
        )}
      </RosterProvider>
    </BookingProvider>
  );
}
