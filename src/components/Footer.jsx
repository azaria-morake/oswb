import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Footer.css';

const FacebookIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const TwitterIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
const InstagramIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const YoutubeIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;

const Footer = () => {
  const [btnText, setBtnText] = useState('SIGN UP');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);
    setBtnText("you can't go there yet");
    
    setTimeout(() => {
      setBtnText('SIGN UP');
      setIsAnimating(false);
    }, 2500);
  };

  return (
    <footer className="main-footer">
      <div className="footer-left">
        <span>Soffware Boyz | Processed Vibes | &copy; 2026</span>
      </div>
      
      <div className="footer-socials">
        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FacebookIcon size={20} /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer"><TwitterIcon size={20} /></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><InstagramIcon size={20} /></a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer"><YoutubeIcon size={20} /></a>
      </div>
      
      <div className="footer-newsletter">
        <span>Newsletter</span>
        <form onSubmit={handleSignUp} className="newsletter-form">
          <input type="email" placeholder="Enter e-mail" required />
          <button type="submit" className="signup-btn">
            <AnimatePresence mode="wait">
              <motion.span
                key={btnText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'inline-block' }}
              >
                {btnText}
              </motion.span>
            </AnimatePresence>
          </button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
