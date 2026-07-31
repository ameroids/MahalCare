import React, { useState, useEffect } from 'react';
import './AmeroidsLoader.css';

const LOADING_MESSAGES = [
  "INITIALIZING SYSTEM CORE",
  "ESTABLISHING SECURE UPLINK",
  "CALIBRATING RENDER PIPELINE",
  "DECRYPTING CLINIC DATA",
  "SYNCING ROSTER METADATA",
  "SYSTEM ONLINE"
];

export default function AmeroidsLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [timeStr, setTimeStr] = useState('');
  const [msgIndex, setMsgIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${mm}:${ss}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Progress simulation (takes about 2-3 seconds total, erratic buffering)
  useEffect(() => {
    let current = 0;
    
    const updateProgress = () => {
      // jump by random amounts to simulate erratic buffering
      const jump = Math.random() * 20 + 2; 
      current += jump;
      
      if (current >= 100) {
        current = 100;
        setProgress(Math.floor(current));
        setMsgIndex(LOADING_MESSAGES.length - 1);
        
        // Start fade out shortly after hitting 100
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500); // Wait for CSS opacity transition
        }, 400); 
        return;
      }
      
      setProgress(Math.floor(current));
      const targetIndex = Math.floor((current / 100) * (LOADING_MESSAGES.length - 1));
      setMsgIndex(targetIndex);

      // Random delay before next jump to feel like actual loading
      const nextDelay = Math.random() * 300 + 50;
      setTimeout(updateProgress, nextDelay);
    };

    const initialDelay = setTimeout(updateProgress, 300);
    return () => clearTimeout(initialDelay);
  }, [onComplete]);

  return (
    <div className={`ameroids-loader ${isFadingOut ? 'ameroids-loader--fade-out' : ''}`}>
      <div className="ameroids-loader__grid"></div>
      
      {/* Top Corners */}
      <div className="ameroids-loader__top-left">SYS <span className="dot">•</span> ONLINE</div>
      <div className="ameroids-loader__top-right">REV 01.0</div>

      {/* Center Branding */}
      <div className="ameroids-loader__brand">
        <div className="ameroids-loader__tech">TECH STUDIO</div>
        <h1 className="ameroids-loader__title">
          AME<span className="orange-text">ROI</span>DS
        </h1>
        <div className="ameroids-loader__subtitle">
          BUILDING THINGS WORTH LOADING FOR
        </div>
      </div>

      {/* Orbital Animation */}
      <div className="ameroids-loader__orbit-container">
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
        <div className="orbit-center-dot"></div>
        <div className="orbit-planet"></div>
      </div>

      {/* Progress Section */}
      <div className="ameroids-loader__progress-section">
        <div className="ameroids-loader__progress-msg">
          {LOADING_MESSAGES[msgIndex]}
        </div>
        <div className="ameroids-loader__progress-row">
          <div className="ameroids-loader__progress-bar-bg">
            <div 
              className="ameroids-loader__progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="ameroids-loader__progress-percent">{progress}%</div>
        </div>
      </div>

      {/* Bottom Corners */}
      <div className="ameroids-loader__bottom-left">AMEROIDS</div>
      <div className="ameroids-loader__bottom-right">{timeStr}</div>
    </div>
  );
}
