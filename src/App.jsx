import React, { useState, useEffect } from "react";
import { RosterProvider } from "./context/RosterContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import NextDayCarousel from "./components/NextDayCarousel/NextDayCarousel.jsx";
import MonthlyRoster from "./components/MonthlyRoster/MonthlyRoster.jsx";
import Footer from "./components/Footer/Footer.jsx";
import AdminUpload from "./components/AdminUpload/AdminUpload.jsx";
import AdminDirectoryUpload from "./components/AdminDirectoryUpload/AdminDirectoryUpload.jsx";

import Login from "./components/Login/Login.jsx";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton.jsx";
import HealthAdvice from "./components/HealthAdvice/HealthAdvice.jsx";
import FAQModal from "./components/FAQ/FAQ.jsx";
import BookingModal from "./components/BookingModal/BookingModal.jsx";
import AmeroidsLoader from "./components/AmeroidsLoader/AmeroidsLoader.jsx";
import DoctorsDirectory from "./components/DoctorsDirectory/DoctorsDirectory.jsx";


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
  const [currentView, setCurrentView] = useState('home');
  const [adminView, setAdminView] = useState('roster'); // 'roster' | 'directory'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);

  const handleViewChange = (newView) => {
    if (newView === currentView) return;
    setIsTransitioning(true);
    // Switch the view immediately so it's ready when the loader fades out
    setCurrentView(newView);
    window.scrollTo(0, 0);
  };


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
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                  <img src="/mahal-al-shifa-logo.png" alt="Mahal al Shifa Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain', backgroundColor: '#ffffff', padding: '4px 8px', borderRadius: '8px' }} />
                  <h2 style={{ margin: 0, whiteSpace: 'nowrap' }}>Mahal Al Shifa <span style={{ fontWeight: 400, opacity: 0.7 }}>Admin</span></h2>
                </div>
                <button className="btn btn-secondary" onClick={() => setAuth(null)}>Logout</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                  className={`btn ${adminView === 'roster' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: '1 1 200px' }}
                  onClick={() => setAdminView('roster')}
                >
                  Doctors Roster Upload
                </button>
                <button 
                  className={`btn ${adminView === 'directory' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: '1 1 200px' }}
                  onClick={() => setAdminView('directory')}
                >
                  Doctors Directory Upload
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1rem' }}>
                  {adminView === 'roster' ? (
                    <AdminUpload onDone={() => {}} />
                  ) : (
                    <AdminDirectoryUpload onDone={() => {}} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Navbar 
              onLogout={() => setAuth(null)} 
              onBookClick={handleOpenBooking} 
              currentView={currentView}
              onViewChange={handleViewChange}
            />
            {currentView === 'directory' ? (
              <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
                <DoctorsDirectory onBookClick={handleOpenBooking} />
              </main>
            ) : (
              <main>
                <Hero onBookClick={handleOpenBooking} />
                <NextDayCarousel onBookClick={handleOpenBooking} />
                <MonthlyRoster onBookClick={handleOpenBooking} />
                <HealthAdvice />
              </main>
            )}
            <Footer onOpenFAQ={() => setShowFAQ(true)} />
            {showFAQ && <FAQModal onClose={() => setShowFAQ(false)} />}
            {showBooking && <BookingModal initialDoctor={bookingDoctor} onClose={() => setShowBooking(false)} />}
            <WhatsAppButton />
          </>
        )}

        {/* Initial Loader Overlay */}
        {isInitialLoad && (
          <AmeroidsLoader onComplete={() => setIsInitialLoad(false)} />
        )}
        
        {/* Transition Loader Overlay */}
        {isTransitioning && !isInitialLoad && (
          <AmeroidsLoader onComplete={() => setIsTransitioning(false)} />
        )}
      </RosterProvider>
    </BookingProvider>
  );
}
