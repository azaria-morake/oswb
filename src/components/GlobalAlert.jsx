import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInteraction } from '../InteractionContext';
import './GlobalAlert.css';

const GlobalAlert = () => {
  const { isAlertOpen, closeAlert } = useInteraction();

  return (
    <AnimatePresence>
      {isAlertOpen && (
        <div className="global-alert-overlay">
          <motion.div 
            className="alert-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlert}
          />
          
          <motion.div 
            className="alert-modal"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="alert-content">
              <div className="alert-header">
                <div className="alert-icon">!</div>
                <h2 className="alert-title">SYSTEM RESTRICTED</h2>
              </div>
              
              <p className="alert-message">
                YOU CAN'T GO THERE YET. <br />
                <span className="alert-subtext">THE DROP IS CURRENTLY BEING PROCESSED.</span>
              </p>
              
              <div className="alert-actions">
                <div className="btn-orange-wrapper alert-btn-wrapper">
                  <div className="btn-orange-inner">
                    <button className="btn-orange alert-btn" onClick={closeAlert}>
                      BACK TO REALITY
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cyberpunk decorative elements */}
            <div className="alert-corner tl"></div>
            <div className="alert-corner tr"></div>
            <div className="alert-corner bl"></div>
            <div className="alert-corner br"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalAlert;
