import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listenToActiveProducts } from '../firebase/api';
import './ToggleArchive.css';

const ToggleArchive = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [registryInput, setRegistryInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch products. We'll look for anything that might be Toggle related
    // so the timeline populates for the demo.
    const unsubscribe = listenToActiveProducts((activeProducts) => {
      const toggleProducts = activeProducts.filter(p => 
        p.dropName === 'Toggle_Init' || 
        (p.name && p.name.toLowerCase().includes('toggle'))
      );
      setProducts(toggleProducts);
    });
    return () => unsubscribe();
  }, []);

  const handleRegistrySubmit = (e) => {
    e.preventDefault();
    if (registryInput.trim()) {
      setShowModal(true);
    }
  };

  return (
    <div className="toggle-archive">
      {/* 1. HERO SECTION */}
      <section className="toggle-hero">
        <div className="toggle-hero-bg"></div>
        <div className="toggle-hero-overlay"></div>
        <div className="toggle-hero-content">
          <motion.h1 
            className="toggle-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            TOGGLE: ITERATION 01
          </motion.h1>
          <motion.p 
            className="toggle-subhead"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            The perpetual pulse of Soffware Boyz. Built with heart. Calibrated for passion.
          </motion.p>
          <motion.button 
            className="toggle-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            onClick={() => {
              document.getElementById('toggle-timeline').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore the Archive
          </motion.button>
        </div>
      </section>

      {/* MAIN SPLIT */}
      <div className="toggle-layout">
        
        {/* 2. SPEC SHEET SIDEBAR */}
        <aside className="toggle-sidebar">
          <div className="spec-header">
            <div className="blueprint-icon">
              {/* Minimal line art icon placeholder */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
            </div>
            <div className="spec-title">
              <h3>TOGGLE_OS</h3>
              <p>STATUS: ACTIVE // DREAMING</p>
            </div>
          </div>
          
          <ul className="spec-list">
            <li>Core: <span>High-Intensity Passion.</span></li>
            <li>Chassis: <span>Retro-Futurist Alloy.</span></li>
            <li>Current Mission: <span>LASER_BEAM_DREAMS.</span></li>
          </ul>

          <div className="toggly-scale">
            <p>Sincerity Level [100%]</p>
            <div className="scale-bar-container">
              <div className="scale-bar-fill"></div>
            </div>
          </div>
        </aside>

        {/* 3. RIGHT CONTENT AREA */}
        <div className="toggle-content">
          
          {/* DROP TIMELINE */}
          <section id="toggle-timeline" className="timeline-section">
            <h2>THE LIVING ARCHIVE</h2>
            <div className="timeline-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="timeline-item">
                    <div className="timeline-image">
                      <img src={product.images?.[0] || product.image} alt={product.name} />
                    </div>
                    <div className="timeline-details">
                      <h3>{product.name}</h3>
                      <p className="price">ZAR {product.price?.toLocaleString()}</p>
                      
                      <p className="poetic-desc">
                        The inaugural expression. Toggle manifests his internal drive through a focused, destructive, yet beautiful beam of energy. It’s not just a weapon; it’s a love letter to the craft.
                      </p>
                      
                      <button onClick={() => onProductClick && onProductClick(product)}>
                        VIEW SPECIFICS
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#888', fontStyle: 'italic' }}>Awaiting data sync... No artifacts found.</div>
              )}
            </div>
          </section>

          {/* 4. HARDWARE REGISTRY */}
          <section className="registry-section">
            <h2>THE HARDWARE REGISTRY</h2>
            <p>Enter the Serial Number located on your physical Toggle garment to unlock its digital certificate of authenticity.</p>
            <form className="registry-form" onSubmit={handleRegistrySubmit}>
              <input 
                type="text" 
                placeholder="e.g. TGL-01-XXXX" 
                value={registryInput}
                onChange={(e) => setRegistryInput(e.target.value)}
                required
              />
              <button type="submit">VERIFY</button>
            </form>
          </section>

          {/* 5. MOOD BOARD */}
          <section className="moodboard-section">
            <h2>SOURCE CODE (MOOD_BOARD)</h2>
            <div className="moodboard-grid">
              <div className="moodboard-item">
                <img src="/assets/toggle/nasa_moodboard_1778458576640.png" alt="1960s NASA Control Room" />
              </div>
              <div className="moodboard-item">
                <img src="/assets/toggle/circuit_macro_1778458612050.png" alt="Macro Circuit Board" />
              </div>
              <div className="moodboard-item">
                <img src="/assets/toggle/soccer_kit_vintage_1778458651002.png" alt="Vintage Soccer Kit" />
              </div>
            </div>
          </section>

          {/* 6. SOFFLIFE COMMUNITY SCROLL */}
          <section className="community-section">
            <h2>NETWORK SYNC: COMMUNITY CAPTURES</h2>
            <div className="community-scroll">
              <div className="community-item">
                <img src="/assets/toggle/sofflife_ugc_1_1778458696956.png" alt="Community Capture 1" />
                <div className="community-label">JHB_011</div>
              </div>
              {/* Additional placeholder items for scrolling effect */}
              <div className="community-item" style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#333' }}>AWAITING_UPLOAD...</span>
              </div>
              <div className="community-item" style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#333' }}>AWAITING_UPLOAD...</span>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* VERIFICATION MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="verification-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="verification-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3>Hardware Verified</h3>
              <p>Your piece has been successfully authenticated against the Toggle Mainframe. It is a genuine 1-of-1 artifact.</p>
              <div className="cert-serial">{registryInput.toUpperCase()}</div>
              <br/>
              <button onClick={() => { setShowModal(false); setRegistryInput(''); }}>CLOSE TERMINAL</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ToggleArchive;
