import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import './Login.css';

const BASE_PARTICLES = ['💊', '🩺', '🏥', '💉', '➕', '💚', '🩹'];
const PARTICLES = Array.from({ length: 25 }, (_, i) => BASE_PARTICLES[i % BASE_PARTICLES.length]);

export default function Login({ onLogin }) {
  const [its, setIts] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (its.trim().length === 8) {
      setError('');
      if (its === '12345678') {
        onLogin({ role: 'admin', its });
      } else {
        onLogin({ role: 'user', its });
      }
    } else {
      setError("Please enter exactly 8 digits.");
    }
  };

  return (
    <main className="login-container">
      {/* Background Particles */}
      <div className="login-particles" aria-hidden="true">
        {PARTICLES.map((emoji, i) => {
          const left = (i * 21 + 13) % 95; 
          const duration = 20 + (i % 7) * 4; 
          const delay = -(i * 2.5); 
          const size = 1 + (i % 3) * 0.5;
          const opacity = 0.05 + (i % 4) * 0.03;
          
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

      <div className="login-box">
        <div className="login-header">
          <div className="login-logo-container">
            <img src="/MahalCare_Logo.png" alt="MahalCare Logo" className="login-logo" />
          </div>
          <p className="login-subtitle">
            Enter your ITS number to access the<br />Appointment System.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <input 
              id="its-input"
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="8"
              placeholder="• • • • • • • •" 
              value={its}
              onKeyDown={(e) => {
                if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key) || e.ctrlKey || e.metaKey) return;
                if (!/^[0-9]$/.test(e.key)) e.preventDefault();
              }}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 8) setIts(val);
                if (error) setError('');
              }}
              required
              autoFocus
              className={`login-input ${error ? 'login-input--error' : ''}`}
            />
            {error && <div className="login-error-msg">{error}</div>}
          </div>
          
          <button type="submit" className="login-btn">
            Login <LogIn size={20} strokeWidth={2.5} />
          </button>
        </form>

        <div className="login-quote-section">
          <p className="quote-text">
            Care is not just what we do,<br/>
            it's who we are. ♡
          </p>
          <div className="quote-divider">
            <svg width="140" height="20" viewBox="0 0 140 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              {/* Main vine */}
              <path d="M20,10 Q70,18 120,10" />
              {/* Leaves */}
              <path d="M45,13 Q38,5 35,11 Q40,15 45,13" />
              <path d="M65,15 Q58,7 55,13 Q60,17 65,15" />
              <path d="M75,15 Q82,7 85,13 Q80,17 75,15" />
              <path d="M95,13 Q102,5 105,11 Q100,15 95,13" />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
