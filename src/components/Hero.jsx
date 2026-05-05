import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const heroSlides = [
  '/assets/hero_slide/hero.jpg',
  '/assets/hero_slide/hero_slide1.jpg',
  '/assets/hero_slide/hero_slide2.jpg',
  '/assets/hero_slide/hero_slide3.jpg',
  '/assets/hero_slide/hero_slide4.jpg',
  '/assets/hero_slide/hero_slide5.jpg',
  '/assets/hero_slide/hero_slide6.jpg',
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-bg"></div>
        <div className="hero-image-container">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroSlides[currentSlide]}
              src={heroSlides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
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

