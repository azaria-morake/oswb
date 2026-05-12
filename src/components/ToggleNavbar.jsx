import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../CartContext';
import './ToggleNavbar.css';

/* ── Sidebar content (mirrors desktop sidebar in ToggleArchive) ── */
const ToggleSideMenu = ({ isOpen, onClose, registryInput, setRegistryInput, onRegistrySubmit }) => {
  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tn-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="tn-sidemenu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            {/* Top bar */}
            <div className="tn-sidemenu-topbar">
              <div className="tn-sidemenu-logo">TOGGLE</div>
              <button className="tn-sidemenu-close" onClick={onClose} aria-label="Close menu">
                {/* X icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable sidebar content */}
            <div className="tn-sidemenu-body">

              {/* BRANDING */}
              <div className="tn-sm-brand">
                <div className="tn-sm-logo-text">TOGGLE</div>
                <p>PERPETUAL PASSION SYSTEMS<br /><span>Soffware Boyz</span></p>
              </div>

              {/* TECHNICAL DOSSIER */}
              <div className="tn-sm-section">
                <div className="tn-sm-section-header">
                  <span>TECHNICAL DOSSIER</span>
                  <div className="tn-sm-dot active" />
                </div>

                <div className="tn-sm-blueprint">
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#FFF" strokeWidth="1.5">
                    <path d="M50 20 C30 20 20 40 20 60 C20 70 30 80 50 80 C70 80 80 70 80 60 C80 40 70 20 50 20 Z" />
                    <circle cx="35" cy="55" r="5" />
                    <circle cx="65" cy="55" r="5" />
                    <path d="M40 70 Q50 75 60 70" />
                    <line x1="50" y1="10" x2="50" y2="20" />
                    <circle cx="50" cy="10" r="2" fill="#FFF" />
                    <path d="M20 50 C10 50 10 70 20 70" />
                    <path d="M80 50 C90 50 90 70 80 70" />
                  </svg>
                </div>

                <div className="tn-sm-status">
                  STATUS<br />
                  <span><span style={{ color: '#4CAF50', marginRight: '5px' }}>●</span>ACTIVE / DREAMING</span>
                </div>

                <div className="tn-sm-section-header" style={{ marginBottom: '10px' }}>
                  <span>TECHNICAL SPECIFICATIONS</span>
                </div>
                <ul className="tn-sm-specs">
                  <li>CORE: <span>High-Intensity Passion.</span></li>
                  <li>CHASSIS: <span>Retro-Futurist Alloy.</span></li>
                  <li>CURRENT MISSION: <span style={{ color: '#4CAF50' }}>LASER_BEAM_DREAMS.</span></li>
                </ul>
              </div>

              {/* TOGGLY SCALE */}
              <div className="tn-sm-section">
                <div className="tn-sm-scale-header">
                  <span>TOGGLY SCALE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.6rem' }}>
                  <span style={{ color: '#888' }}>SINCERITY LEVELS</span>
                  <span style={{ color: '#FFF', fontSize: '1rem', fontWeight: 'bold' }}>100%</span>
                </div>
                <div className="tn-sm-scale-bars">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className={`tn-sm-scale-bar filled`} />
                  ))}
                </div>
              </div>

              {/* HARDWARE REGISTRY */}
              <div className="tn-sm-section" style={{ borderBottom: '1px solid #1F1F1F' }}>
                <div className="tn-sm-section-header">
                  <span>HARDWARE REGISTRY</span>
                  <div className="tn-sm-dot" />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#FFF', marginBottom: '10px', fontWeight: 'bold' }}>REGISTER YOUR GEAR</p>
                <p className="tn-sm-registry-desc">Enter your unique patch code to unlock your digital certificate and join the Toggle Network.</p>

                <form className="tn-sm-registry-input" onSubmit={onRegistrySubmit}>
                  <input
                    type="text"
                    placeholder="ENTER PATCH CODE"
                    value={registryInput}
                    onChange={(e) => setRegistryInput(e.target.value)}
                    required
                  />
                  <button type="submit">→</button>
                </form>

                <p className="tn-sm-registry-desc" style={{ marginTop: '20px' }}>Where authenticity meets belonging.</p>
                <a href="#" className="tn-sm-learn-more">LEARN MORE →</a>
              </div>

              {/* NETWORK STATUS */}
              <div className="tn-sm-section" style={{ borderTop: 'none' }}>
                <div style={{ border: '1px solid #333', padding: '15px', fontSize: '0.65rem', letterSpacing: '1px' }}>
                  <span style={{ color: '#888', display: 'block', marginBottom: '5px' }}>NETWORK STATUS</span>
                  <span style={{ color: '#FFF' }}><span style={{ color: '#4CAF50', marginRight: '5px' }}>●</span>ALL SYSTEMS PASSIONATE</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingBottom: '10px', fontSize: '0.6rem', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <span>IG</span>
                  <span>X</span>
                  <span>YT</span>
                </div>
                <span>© 2025 Soffware Boyz.</span>
              </div>
            </div>

            {/* Back to Soffware Boyz */}
            <div className="tn-sidemenu-footer">
              <button
                className="tn-back-btn"
                onClick={() => { onClose(); navigate('/'); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Soffware Boyz
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

/* ── Toggle Navbar ── */
const ToggleNavbar = ({ registryInput, setRegistryInput, onRegistrySubmit, onOpenCart }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <>
      <header className="tn-navbar">
        {/* Left: Basket icon */}
        <button className="tn-basket-btn" onClick={onOpenCart} aria-label="Open cart">
          <div className="tn-basket-wrapper">
            {/* Toggle-aesthetic basket: structured tote bag */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="tn-cart-badge">{cartCount}</span>}
          </div>
        </button>

        {/* Center: Toggle logo */}
        <div className="tn-center-logo">TOGGLE</div>

        {/* Right: Menu icon */}
        <button className="tn-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          {/* Toggle-aesthetic: three stacked lines with varying lengths */}
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
            <line x1="0" y1="2" x2="24" y2="2" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="4" y1="10" x2="24" y2="10" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="8" y1="18" x2="24" y2="18" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
        </button>
      </header>

      <ToggleSideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        registryInput={registryInput}
        setRegistryInput={setRegistryInput}
        onRegistrySubmit={onRegistrySubmit}
      />
    </>
  );
};

export default ToggleNavbar;
