import React, { useState, useEffect, useRef } from 'react';
import { useInteraction } from '../InteractionContext';
import { Search, User, Menu, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = ({ onCartToggle, cartCount }) => {
  const { triggerNotYetAlert } = useInteraction();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const activeLink = 'Home';

  const navLinks = ['Home', 'Drops', 'Accessories', 'Collectibles'];

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click away listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  // Close search on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="logo-container">
          <img src="/soffwareboyz.svg" alt="Soffware Boyz Logo" className="logo-img" style={{ height: '52px' }} />
        </div>
      </div>

      <motion.div
        layout
        ref={searchWrapperRef}
        className={`search-wrapper ${isSearchOpen ? 'active' : ''}`}
      >
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search-box"
              className="search-box"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Search size={18} className="search-icon-active" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="SEARCH FOR DROPS..."
                className="search-input"
              />
              <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}>
                <X size={18} className="close-icon" />
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
              transition={{ duration: 0.2 }}
            >
              <Search size={20} strokeWidth={1.5} />
              <span>Search</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="header-right">
        <motion.nav layout className="desktop-nav">
          <ul onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link, index) => (
              <React.Fragment key={link}>
                <motion.li
                  layout
                  onMouseEnter={() => setHoveredLink(link)}
                  className="nav-item-container"
                >
                  <button className="disabled-link nav-btn" onClick={triggerNotYetAlert}>
                    {link}
                  </button>
                  {((hoveredLink === link) || (!hoveredLink && activeLink === link)) && (
                    <motion.div
                      layoutId="nav-underline"
                      className="nav-underline"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.li>
                {index < navLinks.length - 1 && <motion.span layout className="nav-divider">|</motion.span>}
              </React.Fragment>
            ))}
          </ul>
        </motion.nav>

        <motion.div layout className="header-separator desktop-only"></motion.div>

        <motion.button layout className="icon-btn desktop-only" onClick={triggerNotYetAlert}>
          <span>Account</span>
          <User size={20} strokeWidth={1.5} />
        </motion.button>
        <motion.div layout className="header-separator"></motion.div>
        <motion.button layout className="cart-btn" onClick={triggerNotYetAlert}>
          <div className="cart-icon-wrapper">
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span className="cart-label">{cartCount} ITEMS</span>
        </motion.button>

        <motion.button layout className="mobile-menu-btn" onClick={triggerNotYetAlert}>
          <Menu size={24} />
        </motion.button>
      </div>



    </header>
  );
};

export default Header;
