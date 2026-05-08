import React, { useState, useEffect } from 'react';
import './TopBanner.css';

const TopBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 22,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="top-banner">
      <div className="ticker-container">
        <div className="ticker-content">
          <span className="ticker-item">PROCESSING_SYSTEM_INIT...</span>
          <span className="ticker-item">ACCESS_GRANTED_SECURE_CONNECTION</span>
          <span className="ticker-item">UPDATING_MANIFEST_DROPS_LIVE</span>
          <span className="ticker-item">PROCESSING_SYSTEM_INIT...</span>
          <span className="ticker-item">ACCESS_GRANTED_SECURE_CONNECTION</span>
          <span className="ticker-item">UPDATING_MANIFEST_DROPS_LIVE</span>
        </div>
      </div>
      
      <div className="timer-container">
        <span className="timer-label">EST_RELEASE:</span>
        <div className="timer-clock">
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
