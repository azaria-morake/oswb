import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useInteraction } from '../InteractionContext';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { Search, User, Menu, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = ({ cartCount, isToggle }) => {
  const { triggerNotYetAlert } = useInteraction();
  const { openCartManager } = useCart();
  const { loginWithGoogle, account, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adSlide, setAdSlide] = useState(0);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const location = useLocation();
  const activeLink = location.pathname === '/drops' ? 'Drops' : location.pathname === '/toggle' ? 'Toggle' : location.pathname === '/' ? 'Home' : '';

  const navLinks = ['Home', 'Drops', 'Toggle', 'Collectibles'];

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Escape closes both search and drawer
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Auto-advance drawer slideshow while drawer is open
  const AD_SLIDES = [
    '/assets/hero_slide/hero_slide1.jpg',
    '/assets/hero_slide/hero_slide2.jpg',
    '/assets/hero_slide/hero_slide3.jpg',
    '/assets/hero_slide/hero_slide4.jpg',
    '/assets/hero_slide/hero_slide5.jpg',
    '/assets/hero_slide/hero_slide6.jpg',
  ];
  const AD_DURATION = 3000; // ms per slide

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const timer = setInterval(() => {
      setAdSlide(prev => (prev + 1) % AD_SLIDES.length);
    }, AD_DURATION);
    return () => clearInterval(timer);
  }, [isMobileMenuOpen, adSlide]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`main-header ${isToggle ? 'toggle-variant' : ''}`}>

        {/* Logo */}
        {!isToggle && (
          <div className={`header-logo ${isSearchOpen ? 'search-active' : ''}`}>
            <img src="/soffwareboyz.svg" alt="Soffware Boyz Logo" className="logo-img" />
          </div>
        )}

        {/* Spacer — pushes nav + search right on desktop, fills gap on mobile */}
        <div className="header-spacer" />

        {/* Desktop nav */}
        <nav className={`desktop-nav ${isSearchOpen ? 'search-active' : ''}`}>
          <ul onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link, index) => (
              <React.Fragment key={link}>
                <li onMouseEnter={() => setHoveredLink(link)} className="nav-item-container">
                  {link === 'Home' || link === 'Drops' || link === 'Toggle' ? (
                    <Link to={link === 'Home' ? '/' : link === 'Drops' ? '/drops' : '/toggle'} className="nav-btn">
                      {link}
                    </Link>
                  ) : (
                    <button className="disabled-link nav-btn" onClick={triggerNotYetAlert}>
                      {link}
                    </button>
                  )}
                  {((hoveredLink === link) || (!hoveredLink && activeLink === link)) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="nav-underline"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </li>
                {index < navLinks.length - 1 && <span className="nav-divider">|</span>}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        {/* Search */}
        <div ref={searchWrapperRef} className={`search-wrapper ${isSearchOpen ? 'active' : ''}`}>
          <AnimatePresence mode="wait" initial={false}>
            {isSearchOpen ? (
              <motion.div
                key="search-box"
                className="search-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Search size={16} className="search-icon-active" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="SEARCH FOR DROPS..."
                  className="search-input"
                />
                <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
                  <X size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-trigger"
                className="icon-btn search-trigger"
                onClick={() => setIsSearchOpen(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Search size={20} strokeWidth={1.5} />
                <span>Search</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right-side actions */}
        <div className="header-actions">
          <div className="header-separator desktop-only" />
          <button className="icon-btn desktop-only" onClick={!account ? loginWithGoogle : undefined}>
            <span>{account ? account.displayName?.split(' ')[0].toUpperCase() : 'LOGIN'}</span>
            <User size={20} strokeWidth={1.5} />
          </button>
          <div className="header-separator desktop-only" />

          <button
            className={`cart-btn ${isSearchOpen ? 'search-active' : ''}`}
            onClick={openCartManager}
          >
            <div className="cart-icon-wrapper">
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>

      </header>

      {/* ── Mobile slide-out drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="mobile-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Toggle-specific Drawer or Standard Drawer */}
            {isToggle ? (
              <motion.aside
                className="mobile-drawer toggle-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              >
                <div className="mobile-drawer-topbar">
                  <div className="ts-logo-text" style={{ fontSize: '1.5rem', marginBottom: 0 }}>TOGGLE</div>
                  <button
                    className="drawer-close-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ color: '#FFF' }}
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="drawer-nav">
                  <ul>
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 + 0.1, duration: 0.28, ease: 'easeOut' }}
                      >
                        <Link
                          to={link === 'Home' ? '/' : link === 'Drops' ? '/drops' : '/toggle'}
                          className={`drawer-nav-link toggle-nav-link ${activeLink === link ? 'active' : ''}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="drawer-ad-section" style={{ borderTop: '1px solid #222' }}>
                  <p className="drawer-ad-label" style={{ color: '#555' }}>TECHNICAL DOSSIER</p>
                  <div className="ts-specs" style={{ padding: '0 20px', fontSize: '0.7rem' }}>
                    <p style={{ color: '#888', margin: '10px 0' }}>STATUS: <span style={{ color: '#4CAF50' }}>● ACTIVE</span></p>
                    <p style={{ color: '#888' }}>MISSION: <span style={{ color: '#FFF' }}>LASER_BEAM_DREAMS</span></p>
                  </div>
                </div>

                <div className="drawer-footer" style={{ borderTop: '1px solid #222' }}>
                  <p style={{ fontSize: '0.6rem', color: '#444', textAlign: 'center' }}>© 2025 SOFFWARE BOYZ</p>
                </div>
              </motion.aside>
            ) : (
              <motion.aside
                className="mobile-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              >
                {/* Standard Drawer content as before */}
                <div className="mobile-drawer-topbar">
                  <img src="/soffwareboyz.svg" alt="Soffware Boyz" className="drawer-logo" />
                  <button className="drawer-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={22} />
                  </button>
                </div>

                <nav className="drawer-nav">
                  <ul>
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 + 0.1, duration: 0.28, ease: 'easeOut' }}
                      >
                        {link === 'Home' || link === 'Drops' || link === 'Toggle' ? (
                          <Link
                            to={link === 'Home' ? '/' : link === 'Drops' ? '/drops' : '/toggle'}
                            className={`drawer-nav-link ${activeLink === link ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {activeLink === link && (
                              <motion.span layoutId="drawer-active-bar" className="drawer-active-bar" />
                            )}
                            {link}
                          </Link>
                        ) : (
                          <button className={`drawer-nav-link ${activeLink === link ? 'active' : ''}`} onClick={triggerNotYetAlert}>
                            {activeLink === link && (
                              <motion.span layoutId="drawer-active-bar" className="drawer-active-bar" />
                            )}
                            {link}
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="drawer-ad-section">
                  <p className="drawer-ad-label">Featured</p>
                  <div className="drawer-ad-track-wrapper">
                    {AD_SLIDES.map((src, i) => (
                      <div key={src} className={`drawer-ad-slide ${i === adSlide ? 'active' : ''}`}>
                        <img src={src} alt={`Featured drop ${i + 1}`} />
                        {i === adSlide && (
                          <div className="drawer-ad-progress" key={adSlide} style={{ '--ad-duration': `${AD_DURATION}ms` }} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="drawer-ad-dots">
                    {AD_SLIDES.map((_, i) => (
                      <button key={i} className={`drawer-ad-dot ${i === adSlide ? 'active' : ''}`} onClick={() => setAdSlide(i)} />
                    ))}
                  </div>
                </div>

                <div className="drawer-footer">
                  <button className="drawer-footer-btn" onClick={!account ? loginWithGoogle : undefined}>
                    <User size={16} strokeWidth={1.5} />
                    <span>{account ? account.displayName?.split(' ')[0].toUpperCase() : 'LOGIN'}</span>
                  </button>
                </div>
              </motion.aside>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
