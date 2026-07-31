import React, { useState } from 'react';
import { LogIn, KeyRound } from 'lucide-react';
import './Login.css';

const BASE_PARTICLES = ['💊', '🩺', '🏥', '💉', '👨‍⚕️', '🔬', '🚑', '🩹'];
const PARTICLES = Array.from({ length: 35 }, (_, i) => BASE_PARTICLES[i % BASE_PARTICLES.length]);

export default function Login({ onLogin }) {
  const [its, setIts] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (its.trim().length === 8) {
      setError('');
      if (its === '12345678') { // Dummy admin ITS
        onLogin({ role: 'admin', its });
      } else {
        onLogin({ role: 'user', its });
      }
    } else {
      setError("Please enter exactly 8 digits for your ITS number.");
    }
  };

  return (
    <main className="login-container" aria-labelledby="login-heading">
      {/* Background Particles */}
      <div className="login-particles" aria-hidden="true">
        {PARTICLES.map((emoji, i) => {
          const left = (i * 17 + 11) % 95; 
          const duration = 14 + (i % 5) * 3; 
          const delay = -(i * 1.83); 
          const size = 1.2 + (i % 4) * 0.4;
          const opacity = 0.1 + (i % 3) * 0.15;
          
          return (
            <div 
              key={i} 
              className="login-particle"
              style={{
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                fontSize: `${size}rem`,
                opacity: opacity
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      <div className="login-box glass-card">
        <div className="login-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#ffffff', borderRadius: '16px', padding: '16px 28px', boxShadow: '0 6px 20px rgba(0,0,0,0.12)', marginBottom: '1.25rem' }}>
            <img src="/MahalCare_Logo.png" alt="MahalCare Logo" style={{ height: '120px', width: 'auto', objectFit: 'contain', display: 'block' }} />
          </div>
          <h2 id="login-heading" className="visually-hidden">MahalCare Appointment System</h2>
          <p className="login-subtitle">Enter your ITS number to access the Appointment System.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="its-input" className="visually-hidden">ITS Number</label>
            <input 
              id="its-input"
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="8"
              placeholder="••••••••" 
              value={its}
              onKeyDown={(e) => {
                // Allow control keys like Backspace, Delete, Tab, Arrow keys, etc.
                if (
                  ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key) || 
                  e.ctrlKey || 
                  e.metaKey
                ) {
                  return;
                }
                // Prevent anything that is not a digit
                if (!/^[0-9]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 8) setIts(val);
                if (error) setError('');
              }}
              required
              autoFocus
              className={`login-input ${error ? 'login-input--error' : ''}`}
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
            />
            {error && <div id="login-error" className="login-error-msg" role="alert">{error}</div>}
          </div>
          
          <button type="submit" className="btn btn-primary login-btn">
            Login <LogIn size={18} aria-hidden="true" />
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Admin ITS: <strong>12345678</strong></p>
        </div>
      </div>
    </main>
  );
}
