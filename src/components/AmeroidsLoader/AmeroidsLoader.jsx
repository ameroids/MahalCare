import React, { useState, useEffect } from 'react';
import './AmeroidsLoader.css';

export default function AmeroidsLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let current = 0;
    
    const updateProgress = () => {
      // Smooth incremental progress
      current += 0.8; 
      
      if (current >= 100) {
        current = 100;
        setProgress(current);
        
        // Start fade out shortly after hitting 100
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800); // Wait for CSS opacity transition
        }, 600); 
        return;
      }
      
      setProgress(current);

      // ~20ms gives a smooth 60fps-like progress bar animation
      setTimeout(updateProgress, 20);
    };

    const initialDelay = setTimeout(updateProgress, 200);
    return () => clearTimeout(initialDelay);
  }, [onComplete]);

  return (
    <div className={`classic-loader ${isFadingOut ? 'classic-loader--fade-out' : ''}`}>
      <div className="classic-loader__content">
        <h1 className="classic-loader__title">
          AME<span className="classic-loader__highlight">ROI</span>DS
        </h1>
        <div className="classic-loader__progress-wrapper">
          <div className="classic-loader__progress-container">
            <div 
              className="classic-loader__progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="classic-loader__progress-text">
            {Math.floor(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}
