import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ToggleShutdownSequence.css';

const ToggleShutdownSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(100);

  const shutdownLogs = [
    "INITIATING_SYSTEM_POWER_DOWN...",
    "TERMINATING_UI_LAYER [industrial_tech]...",
    "DISCONNECTING_FROM_PASSION_CORE...",
    "SAVING_SESSION_TELEMETRY...",
    "SHUTTING_DOWN_FIREBASE_LINK...",
    "FLUSHING_CACHE...",
    "SYSTEM_OFFLINE. SEE_YOU_IN_THE_FIELD."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < shutdownLogs.length) {
        setLines(prev => [...prev, shutdownLogs[currentLine]]);
        currentLine++;
        setProgress(100 - (currentLine / shutdownLogs.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 350);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="tss-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tss-container">
        <div className="tss-terminal">
          <div className="tss-header">
            <span>TOGGLE_SYSTEM_SHUTDOWN [SIGNAL_STRENGTH: DIMMING]</span>
          </div>
          <div className="tss-content">
            {lines.map((line, i) => (
              <motion.div 
                key={i} 
                className="tss-line"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
              >
                <span className="tss-prompt">{'>'}</span> {line}
              </motion.div>
            ))}
            {lines.length === shutdownLogs.length && (
              <motion.div 
                className="tss-cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            )}
          </div>
          <div className="tss-footer">
            <div className="tss-progress-bar">
              <motion.div 
                className="tss-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="tss-percent">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToggleShutdownSequence;
