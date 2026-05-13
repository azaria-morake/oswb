import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../CartContext';
import { listenToActiveProducts, verifyRegistryCode } from '../firebase/api';
import ToggleNavbar from '../components/ToggleNavbar';
import ToggleProvisioningBay from '../components/ToggleProvisioningBay';
import ToggleCartManager from '../components/ToggleCartManager';
import ToggleSystemDeepDive from '../components/ToggleSystemDeepDive';
import ToggleBootSequence from '../components/ToggleBootSequence';
import ToggleShutdownSequence from '../components/ToggleShutdownSequence';
import ToggleCheckout from '../components/ToggleCheckout';
import './ToggleArchive.css';

const ToggleArchive = ({ onProductClick }) => {
  const { cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [registryInput, setRegistryInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isProvisioningOpen, setIsProvisioningOpen] = useState(false);
  const [isCartManagerOpen, setIsCartManagerOpen] = useState(false);
  const [activeDossier, setActiveDossier] = useState(null);
  const [verifiedData, setVerifiedData] = useState(null);
  const [registryError, setRegistryError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToActiveProducts((activeProducts) => {
      const toggleProducts = activeProducts.filter(p =>
        p.dropName === 'Toggle_Init' ||
        (p.name && p.name.toLowerCase().includes('toggle'))
      );
      setProducts(toggleProducts);
    });
    return () => unsubscribe();
  }, []);


  const handleRegistrySubmit = async (e) => {
    e.preventDefault();
    if (!registryInput.trim()) return;

    setIsVerifying(true);
    setRegistryError(false);

    try {
      const data = await verifyRegistryCode(registryInput);
      if (data) {
        setVerifiedData(data);
        setShowModal(true);
      } else {
        setRegistryError(true);
        // Reset error after 3 seconds
        setTimeout(() => setRegistryError(false), 3000);
      }
    } catch (err) {
      console.error("Registry error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="toggle-page-wrapper">

      {/* SYSTEM BOOT SEQUENCE */}
      <AnimatePresence>
        {isBooting && <ToggleBootSequence onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {/* SYSTEM SHUTDOWN SEQUENCE */}
      <AnimatePresence>
        {isShuttingDown && (
          <ToggleShutdownSequence onComplete={() => navigate('/')} />
        )}
      </AnimatePresence>

      {/* MOBILE NAVBAR — only shows on < 1024px */}
      <ToggleNavbar
        registryInput={registryInput}
        setRegistryInput={setRegistryInput}
        onRegistrySubmit={handleRegistrySubmit}
        onOpenCart={() => setIsCartManagerOpen(true)}
        onLogout={() => setIsShuttingDown(true)}
      />

      {/* BODY ROW: sidebar + main content */}
      <div className="toggle-body">

        {/* LEFT SIDEBAR */}
        <aside className="toggle-sidebar">

          {/* BRANDING */}
          <div className="ts-brand">
            <div className="ts-logo-text">TOGGLE</div>
            <p>PERPETUAL PASSION SYSTEMS<br /><span>Soffware Boyz</span></p>
          </div>

          {/* TECHNICAL DOSSIER */}
          <div className="ts-section">
            <div className="ts-section-header">
              <span>TECHNICAL DOSSIER</span>
              <div className="ts-dot active"></div>
            </div>

            <div className="ts-blueprint">
              {/* Robot outline graphic similar to mockup */}
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

            <div className="ts-status">
              STATUS<br />
              <span><span style={{ color: '#4CAF50', marginRight: '5px' }}>●</span>ACTIVE / DREAMING</span>
            </div>

            <div className="ts-section-header" style={{ marginBottom: '10px' }}>
              <span>TECHNICAL SPECIFICATIONS</span>
            </div>
            <ul className="ts-specs">
              <li>CORE: <span>High-Intensity Passion.</span></li>
              <li>CHASSIS: <span>Retro-Futurist Alloy.</span></li>
              <li>CURRENT MISSION: <span style={{ color: '#4CAF50' }}>LASER_BEAM_DREAMS.</span></li>
            </ul>
          </div>

          {/* TOGGLY SCALE */}
          <div className="ts-section">
            <div className="ts-scale-header">
              <span style={{ fontSize: '0.65rem', letterSpacing: '1px', color: '#888' }}>TOGGLY SCALE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.6rem' }}>
              <span style={{ color: '#888' }}>SINCERITY LEVELS</span>
              <span style={{ color: '#FFF', fontSize: '1rem', fontWeight: 'bold' }}>100%</span>
            </div>
            <div className="ts-scale-bars">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className={`ts-scale-bar ${i < 20 ? 'filled' : ''}`}></div>
              ))}
            </div>
          </div>

          {/* HARDWARE REGISTRY */}
          <div className="ts-section" style={{ borderBottom: '1px solid #1F1F1F' }}>
            <div className="ts-section-header">
              <span>HARDWARE REGISTRY</span>
              <div className="ts-dot"></div>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#FFF', marginBottom: '10px', fontWeight: 'bold' }}>REGISTER YOUR GEAR</p>
            <p className="ts-registry-desc">Enter your unique patch code to unlock your digital certificate and join the Toggle Network.</p>

            <form className="ts-registry-input" onSubmit={handleRegistrySubmit}>
              <input
                type="text"
                placeholder={registryError ? "INVALID CODE" : "ENTER PATCH CODE"}
                value={registryInput}
                onChange={(e) => setRegistryInput(e.target.value)}
                disabled={isVerifying}
                style={{ color: registryError ? '#da3333' : '#FFF' }}
                required
              />
              <button type="submit" disabled={isVerifying}>
                {isVerifying ? '...' : '→'}
              </button>
            </form>

            <p className="ts-registry-desc" style={{ marginTop: '20px' }}>Where authenticity meets belonging.</p>
            <a href="#" className="ts-learn-more">LEARN MORE →</a>
          </div>

          {/* NETWORK STATUS */}
          <div className="ts-section" style={{ borderTop: 'none' }}>
            <div style={{ border: '1px solid #333', padding: '15px', fontSize: '0.65rem', letterSpacing: '1px' }}>
              <span style={{ color: '#888', display: 'block', marginBottom: '12px' }}>SYSTEM TELEMETRY</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#AAA' }}>ACTIVE_UNITS:</span>
                  <span style={{ color: '#FFF' }}>{products.reduce((acc, p) => acc + (p.stock || 0), 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#AAA' }}>NETWORK_LOAD:</span>
                  <span style={{ color: '#FFF' }}>01.0.732</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#AAA' }}>STATUS:</span>
                  <span style={{ color: '#4CAF50' }}>● ONLINE</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '20px', fontSize: '0.6rem', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span>IG</span>
              <span>X</span>
              <span>YT</span>
            </div>
            <span>© 2025 Soffware Boyz.</span>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="toggle-main-content">

          {/* DESKTOP TOP BAR — cart icon + back to soffware boyz */}
          <div className="tm-desktop-back-bar">
            <button
              className="tm-desktop-cart-btn"
              onClick={() => setIsCartManagerOpen(true)}
              aria-label="Open cart"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && <span className="tm-desktop-cart-badge">{cartCount}</span>}
            </button>
            <button 
              onClick={() => setIsShuttingDown(true)} 
              className="tm-desktop-back-btn"
              style={{ background: '#111', cursor: 'pointer', border: '1px solid #333' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Soffware Boyz
            </button>
          </div>

          {/* HERO SECTION */}
          <section className="tm-hero">
            <div className="tm-hero-bg"></div>
            <div className="tm-hero-overlay"></div>
            <div className="tm-hero-content">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                TOGGLE:<br />ITERATION 01
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                The perpetual pulse of Soffware Boyz.<br />Built with heart. Calibrated for passion.
              </motion.p>
              <motion.div
                className="tm-hero-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <button className="tm-btn" onClick={() => document.getElementById('drop-timeline').scrollIntoView({ behavior: 'smooth' })}>
                  EXPLORE THE ARCHIVE →
                </button>
                <button className="tm-btn outline" onClick={() => setIsProvisioningOpen(true)}>
                  SHOP LATEST DROP
                </button>
              </motion.div>
            </div>
          </section>

          {/* DROP TIMELINE */}
          <section id="drop-timeline" className="tm-section">
            <div className="tm-section-header">
              <div className="dot"></div>
              <span>DROP TIMELINE</span>
            </div>

            <div className="tm-timeline-grid">

              {/* Left/Center: Timeline Items */}
              <div className="tm-timeline-main">
                <div className="tm-timeline-item">
                  <div className="tm-timeline-text">
                    <div className="tm-num">01</div>
                    <h3>LASER BEAM LOVE PACK</h3>
                    <p>The inaugural expression. Toggle manifests his internal drive through a focused, destructive, yet beautiful beam of energy. It's not just a weapon; it's a love letter to the craft.</p>

                    <div className="tm-pack-includes">
                      <h4>INCLUDED IN PACK</h4>
                      <ul className="tm-pack-list">
                        <li><span>01</span> 1x Heavyweight Tee</li>
                        <li><span>02</span> 1x Die-Cut Vinyl Decal</li>
                        <li><span>03</span> 1x Authentication Card</li>
                      </ul>
                      <button 
                        onClick={() => setActiveDossier({
                          title: 'LASER BEAM LOVE PACK',
                          image: products[0]?.images?.[0] || products[0]?.image || '/assets/toggle/media__1778452370104.png'
                        })}
                        style={{ 
                          display: 'inline-block', 
                          marginTop: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold', 
                          textDecoration: 'underline', 
                          color: '#111',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer'
                        }}
                      >
                        VIEW PACK DETAILS →
                      </button>
                    </div>
                  </div>
                  <div className="tm-timeline-images">
                    {products.length > 0 ? (
                      <>
                        <img src={products[0].images?.[0] || products[0].image} alt="Product Front" />
                        <img src={products[0].images?.[1] || products[0].image} alt="Product Back" />
                      </>
                    ) : (
                      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA' }}>No Images</div>
                    )}
                  </div>
                </div>

                <div className="tm-timeline-locked" onClick={() => setActiveDossier({ title: 'v2.0_ENCRYPTED', isLocked: true })} style={{ cursor: 'pointer' }}>
                  <div className="tm-locked-left">
                    <div className="tm-num" style={{ marginBottom: 0 }}>02</div>
                    <div>
                      <h4>LOCKED</h4>
                      <p>COMING SOON</p>
                    </div>
                  </div>
                  <span>+</span>
                </div>

                <div className="tm-timeline-locked" onClick={() => setActiveDossier({ title: 'v3.0_ENCRYPTED', isLocked: true })} style={{ cursor: 'pointer' }}>
                  <div className="tm-locked-left">
                    <div className="tm-num" style={{ marginBottom: 0 }}>03</div>
                    <div>
                      <h4>LOCKED</h4>
                      <p>COMING SOON</p>
                    </div>
                  </div>
                  <span>+</span>
                </div>
              </div>

              {/* Right: Registry Card */}
              <div>
                <div className="tm-registry-card">
                  <div className="tm-registry-status">
                    <span style={{ color: '#4CAF50' }}>●</span> REGISTERED ITEM
                  </div>

                  <div className="tm-registry-box">
                    <h3>TOGGLE®</h3>
                    <p>CERTIFICATE OF AUTHENTICITY</p>
                    <div className="tm-hologram">
                      <svg width="50" height="50" viewBox="0 0 100 100" fill="none" stroke="#FFF" strokeWidth="2">
                        <circle cx="50" cy="50" r="40" />
                        <path d="M30 40 C30 20 70 20 70 40 C70 60 50 80 50 80 C50 80 30 60 30 40 Z" />
                        <circle cx="40" cy="40" r="5" fill="#FFF" />
                        <circle cx="60" cy="40" r="5" fill="#FFF" />
                      </svg>
                    </div>
                  </div>

                  <div className="tm-registry-info">
                    SERIAL NUMBER
                    <span>TGGL-01-LBL-000732</span>
                  </div>
                  <div className="tm-registry-info">
                    PATCH VERSION
                    <span>01.0.732</span>
                  </div>
                  <div className="tm-registry-info">
                    REGISTERED TO
                    <span>@passionate.dev</span>
                  </div>
                  <div className="tm-registry-info" style={{ marginBottom: '30px' }}>
                    REGISTERED ON
                    <span>24 / 05 / 2025</span>
                  </div>

                  <div className="tm-network-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                    YOU ARE PART OF THE NETWORK.
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* MOODBOARD */}
          <section className="tm-section" style={{ paddingTop: 0 }}>
            <div className="tm-section-header">
              <div className="dot"></div>
              <span>THE MOOD-BOARD</span>
            </div>
            <div className="tm-moodboard-grid">
              <div className="tm-moodboard-item"><img src="/assets/toggle/media__1778452370104.png" alt="Moodboard 1" /></div>
              <div className="tm-moodboard-item"><img src="/assets/toggle/moodboard_pc_1778461183211.png" alt="Moodboard 2" /></div>
              <div className="tm-moodboard-item"><img src="/assets/toggle/moodboard_pele_1778461053483.png" alt="Moodboard 3" /></div>
              <div className="tm-moodboard-item"><img src="/assets/toggle/circuit_macro_1778458612050.png" alt="Moodboard 4" /></div>
            </div>
          </section>

          {/* COMMUNITY CAPTURES */}
          <section className="tm-section" style={{ paddingTop: 0 }}>
            <div className="tm-section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="dot"></div>
                <span>NETWORK SYNC: COMMUNITY CAPTURES</span>
              </div>
              <a href="#" style={{ fontSize: '0.75rem', fontWeight: 'bold', textDecoration: 'underline', color: '#111' }}>VIEW ALL CAPTURES →</a>
            </div>
            <div className="tm-ugc-scroll">
              <div className="tm-ugc-item">
                <img src="/assets/toggle/sofflife_ugc_1_1778458696956.png" alt="UGC" />
                <div className="tm-ugc-label">JOHANNESBURG, ZA<span>@kaybee.exe</span></div>
              </div>
              <div className="tm-ugc-item">
                <img src="/assets/toggle/sofflife_ugc_1_1778458696956.png" alt="UGC" />
                <div className="tm-ugc-label">CAPE TOWN, ZA<span>@brando.wav</span></div>
              </div>
              <div className="tm-ugc-item">
                <img src="/assets/toggle/sofflife_ugc_1_1778458696956.png" alt="UGC" />
                <div className="tm-ugc-label">DURBAN, ZA<span>@midfield.maik</span></div>
              </div>
              <div className="tm-ugc-item">
                <img src="/assets/toggle/sofflife_ugc_1_1778458696956.png" alt="UGC" />
                <div className="tm-ugc-label">PRETORIA, ZA<span>@kai.collects</span></div>
              </div>
            </div>
          </section>

        </main>

      </div> {/* end .toggle-body */}

      {/* SYSTEM DEEP-DIVE OVERLAY */}
      <AnimatePresence>
        {activeDossier && (
          <ToggleSystemDeepDive 
            pack={activeDossier}
            onClose={() => setActiveDossier(null)}
            onInitiateProvisioning={() => {
              setActiveDossier(null);
              setIsProvisioningOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* PROVISIONING BAY MODAL */}
      <ToggleProvisioningBay
        isOpen={isProvisioningOpen}
        onClose={() => setIsProvisioningOpen(false)}
        products={products}
        onOpenCart={() => setIsCartManagerOpen(true)}
      />

      {/* TOGGLE CART MANAGER */}
      <ToggleCartManager
        isOpen={isCartManagerOpen}
        onClose={() => setIsCartManagerOpen(false)}
        onCheckout={() => {
          setIsCartManagerOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* TOGGLE CHECKOUT */}
      <ToggleCheckout 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

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
              <h3 style={{ color: '#4CAF50', margin: '0 0 10px 0' }}>
                {verifiedData?.status === 'registered' ? 'Hardware Registry Found' : 'Hardware Verified'}
              </h3>
              <p style={{ color: '#AAA' }}>
                {verifiedData?.status === 'registered' 
                  ? 'This unit is already part of the active network.' 
                  : 'Your piece has been successfully authenticated.'}
              </p>
              <div className="cert-serial">{verifiedData?.code || registryInput.toUpperCase()}</div>
              
              {verifiedData && (
                <div style={{ margin: '20px 0', textAlign: 'left', fontSize: '0.7rem', fontFamily: 'monospace', border: '1px solid #333', padding: '15px' }}>
                  <div style={{ color: '#888', marginBottom: '5px' }}>SYSTEM_REPORT:</div>
                  <div>VERSION: {verifiedData.version || 'v1.0.0'}</div>
                  <div>STATUS: {verifiedData.status?.toUpperCase()}</div>
                  {verifiedData.registeredTo && (
                    <div style={{ color: '#4CAF50', marginTop: '5px' }}>OWNER: {verifiedData.registeredTo.toUpperCase()}</div>
                  )}
                </div>
              )}
              
              <button onClick={() => { setShowModal(false); setRegistryInput(''); setVerifiedData(null); }}>
                CLOSE TERMINAL
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ToggleArchive;
