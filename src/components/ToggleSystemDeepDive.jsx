import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import './ToggleSystemDeepDive.css';

const ToggleSystemDeepDive = ({ pack, onClose, onInitiateProvisioning }) => {
  const [magnifierStyle, setMagnifierStyle] = useState({ display: 'none' });
  const [showAddBtn, setShowAddBtn] = useState(false);
  const overlayRef = useRef(null);
  const imgRef = useRef(null);

  // Scroll Progress for the Power Meter
  const { scrollYProgress } = useScroll({
    container: overlayRef
  });

  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const powerPercent = Math.round(useTransform(scaleProgress, [0, 1], [0, 100]).get());

  // Block background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Show "ADD TO PAYLOAD" when power hits 100% (or near)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.95) setShowAddBtn(true);
      else setShowAddBtn(false);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Magnifier Logic
  const handleMouseMove = useCallback((e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;

    if (x < 0 || y < 0 || x > width || y > height) {
      setMagnifierStyle({ display: 'none' });
      return;
    }

    const zoom = 2;
    setMagnifierStyle({
      display: 'block',
      top: `${y - 75}px`,
      left: `${x - 75}px`,
      backgroundImage: `url(${pack.image})`,
      backgroundSize: `${width * zoom}px ${height * zoom}px`,
      backgroundPosition: `-${x * zoom - 75}px -${y * zoom - 75}px`
    });
  }, [pack.image]);

  const handleMouseLeave = () => setMagnifierStyle({ display: 'none' });

  // Flicker text animation variant
  const flickerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.02
      }
    }
  };

  const letterVariant = {
    hidden: { opacity: 0, x: -2 },
    visible: { opacity: 1, x: 0 }
  };

  if (pack.isLocked) {
    return (
      <motion.div 
        className="tsd-overlay tsd-locked"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="tsd-header">
          <div className="tsd-nav-bar">
            <div className="tsd-breadcrumb">SYSTEM {'>'} ARCHIVE {'>'} <span>v2.0_ENCRYPTED</span></div>
            <button className="tsd-close-btn" onClick={onClose}>CLOSE [×]</button>
          </div>
        </div>
        <div className="tsd-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>[ ⊘ ]</div>
          <h2 style={{ fontFamily: 'Science Gothic, sans-serif', fontSize: '2rem', letterSpacing: '2px', marginBottom: '10px' }}>ACCESS_DENIED</h2>
          <p style={{ fontFamily: 'Courier New, monospace', color: '#888', textAlign: 'center', maxWidth: '400px' }}>
            This data block is currently encrypted via 2048-bit Passion-Hash. 
            Estimated decryption completion: DROP_02_RELEASE.
          </p>
          <div style={{ marginTop: '40px', border: '1px solid #da3333', padding: '15px', color: '#da3333', fontSize: '0.7rem' }}>
            STATUS: AWAITING_AUTHENTICATION_KEY
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="tsd-overlay"
      ref={overlayRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── STICKY HEADER ── */}
      <header className="tsd-header">
        <div className="tsd-nav-bar">
          <div className="tsd-breadcrumb">
            SYSTEM {'>'} ARCHIVE {'>'} <span>V1.0</span>
          </div>
          <button className="tsd-close-btn" onClick={onClose}>
            CLOSE_ARCHIVE [×]
          </button>
        </div>

        <div className="tsd-meter-container">
          <div className="tsd-meter-label">LASER_OUTPUT</div>
          <div className="tsd-meter-track">
            <motion.div 
              className="tsd-meter-fill" 
              style={{ width: `${powerPercent}%` }}
            />
          </div>
          <div className="tsd-meter-percent">{powerPercent}%</div>
          
          <AnimatePresence>
            {showAddBtn && (
              <motion.button 
                className="tsd-meter-add-btn"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={onInitiateProvisioning}
                style={{
                  background: '#da3333',
                  color: '#FFF',
                  border: 'none',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  marginLeft: '15px',
                  cursor: 'pointer'
                }}
              >
                [ADD_TO_PAYLOAD]
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="tsd-content">
        
        {/* ── BLOCK A: MASTER GRAPHIC ── */}
        <section className="tsd-block-a">
          <div 
            className="tsd-graphic-viewer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img 
              ref={imgRef}
              src={pack.image} 
              alt={pack.title} 
              className="tsd-main-img" 
            />
            <div className="tsd-lens" style={magnifierStyle} />
            
            {/* Pulsing Visor */}
            <motion.div 
              className="tsd-visor-glow"
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="tsd-graphic-meta">
            <div className="tsd-tag">DATA_TYPE: FINE_ART_ANALYSIS</div>
            <motion.h1 
              className="tsd-title"
              variants={flickerVariant}
              initial="hidden"
              animate="visible"
            >
              {pack.title.split('').map((char, i) => (
                <motion.span key={i} variants={letterVariant}>{char}</motion.span>
              ))}
            </motion.h1>
            <p className="tsd-description">
              This high-resolution scan reveals the intentional textures and manual imperfections 
              woven into the inaugural Toggle iteration. Every line is a commitment.
            </p>
            <div style={{ border: '1px solid #DCD9CE', padding: '20px', fontSize: '0.75rem', background: '#F5F4F0' }}>
              <span style={{ color: '#888', display: 'block', marginBottom: '10px' }}>INTERACTIVE_SCAN_ACTIVE:</span>
              Hover over the chassis to inspect passion-grain and print depth.
            </div>
          </div>
        </section>

        {/* ── BLOCK B: TECHNICAL SPECS ── */}
        <section className="tsd-block-b">
          <div className="tsd-specs-header">HARDWARE_SPECIFICATIONS_v1.0</div>
          <div className="tsd-specs-grid">
            <div className="tsd-spec-item">
              <div className="tsd-spec-label">CHASSIS (FABRIC)</div>
              <div className="tsd-spec-value">300GSM Heavyweight Cotton – Obsidian Black Finish</div>
            </div>
            <div className="tsd-spec-item">
              <div className="tsd-spec-label">PRINTING (PROCESSING)</div>
              <div className="tsd-spec-value">High-Density Screen Print with Passion-Pigment Infusion</div>
            </div>
            <div className="tsd-spec-item">
              <div className="tsd-spec-label">FIT (GEOMETRY)</div>
              <div className="tsd-spec-value">Oversized 'Boxy' Silhouette – Calibrated for Street Comfort</div>
            </div>
            <div className="tsd-spec-item">
              <div className="tsd-spec-label">AUTHENTICATION</div>
              <div className="tsd-spec-value">Includes holographic 'Iteration 01' serial tag</div>
            </div>
          </div>
        </section>

        {/* ── BLOCK C: THE MANIFEST ── */}
        <section className="tsd-block-c">
          <div className="tsd-specs-header" style={{ marginBottom: '40px' }}>PACK_MANIFEST_CONTENTS</div>
          <div className="tsd-manifest-grid">
            <div className="tsd-manifest-item">
              <img src={pack.image} alt="Tee" className="tsd-item-img" />
              <div className="tsd-item-num">ITEM_01</div>
              <div className="tsd-item-name">The Toggle Tee</div>
            </div>
            <div className="tsd-manifest-item">
              <div style={{ background: '#F5F4F0', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="tsd-item-num">ITEM_02</div>
              <div className="tsd-item-name">Laser-Beam Decal</div>
            </div>
            <div className="tsd-manifest-item">
              <div style={{ background: '#F5F4F0', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10M7 12h10M7 16h6" />
                </svg>
              </div>
              <div className="tsd-item-num">ITEM_03</div>
              <div className="tsd-item-name">System Logic Card</div>
            </div>
          </div>
        </section>

        {/* ── THE LORE ── */}
        <section className="tsd-lore">
          <div className="tsd-lore-header">MISSION_LOG: LASER_BEAM_LOVE</div>
          <p className="tsd-lore-text">
            "Toggle doesn't fire out of aggression; he fires out of absolute conviction. 
            This first iteration captures the moment Toggle's core reached 110% capacity. 
            He found something he loved—the build, the code, the culture—and he manifested 
            that passion into a singular, world-shaking beam. He is in love with the process, 
            and he wants you to see it."
          </p>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="tsd-final-cta">
          <button className="tsd-initiate-btn" onClick={onInitiateProvisioning}>
            INITIATE PROVISIONING // PACK v1.0
          </button>
        </section>

      </div>
    </motion.div>
  );
};

export default ToggleSystemDeepDive;
