import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listenToHomepageConfig } from '../firebase/api';
import './Hero.css';

const Hero = () => {
  const [heroImage, setHeroImage] = useState('/assets/hero_slide/hero.jpg');

  useEffect(() => {
    const unsub = listenToHomepageConfig((config) => {
      if (config && config.heroImage) {
        setHeroImage(config.heroImage);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-bg"></div>
        <div className="hero-image-container">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroImage}
              src={heroImage}
              alt="Hero"
              className="hero-image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>


        <div className="hero-text-overlay">
          <div className="hero-title-container">
            <h1>SOFFWARE</h1>
            <h1>BOYZ <span className="highlight-line">|</span> DROP 001</h1>
          </div>

          <div className="btn-orange-wrapper hero-btn-wrapper">
            <div className="btn-orange-inner">
              <button className="btn-orange hero-btn">
                SHOP THE DROP
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

