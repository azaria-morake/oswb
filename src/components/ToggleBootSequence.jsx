import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ToggleBootSequence.css';

const ToggleBootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "INITIALIZING_TOGGLE_CORE_v1.0.732...",
    "ESTABLISHING_SECURE_LINK [FIREBASE_SYNC]...",
    "SCANNING_PRODUCT_MANIFEST...",
    "PARSING_HARDWARE_REGISTRY...",
    "LOADING_PASSION_ENGINE...",
    "UI_LAYER_READY: [industrial_tech_aesthetic]",
    "SYSTEM_ACCESS_GRANTED."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootLogs.length) {
        setLines(prev => [...prev, bootLogs[currentLine]]);
        currentLine++;
        setProgress((currentLine / bootLogs.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="tbs-overlay"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tbs-container">
        <div className="tbs-terminal">
          <div className="tbs-header">
            <span>TOGGLE_SYSTEM_BOOT [01.0.732]</span>
          </div>
          <div className="tbs-content">
            {lines.map((line, i) => (
              <motion.div 
                key={i} 
                className="tbs-line"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
              >
                <span className="tbs-prompt">{'>'}</span> {line}
              </motion.div>
            ))}
            {lines.length === bootLogs.length && (
              <motion.div 
                className="tbs-cursor"
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
            )}
          </div>
          <div className="tbs-footer">
            <div className="tbs-progress-bar">
              <motion.div 
                className="tbs-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="tbs-percent">{Math.round(progress)}%</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToggleBootSequence;
