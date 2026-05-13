import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { createOrder } from '../firebase/api';
import './ToggleCheckout.css';

const ToggleCheckout = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [orderSerial, setOrderSerial] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  // Block background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleFinalize = async () => {
    setStep(3);
    const serial = 'TGGL-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    // Write order to Firestore
    const orderPayload = {
      serial,
      customerName: formData.name,
      customerEmail: formData.email,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        zip: formData.zip
      },
      itemsSnapshot: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.images?.[0] || item.image || ''
      })),
      total: cartTotal,
      status: 'processing'
    };
    if (user) {
      await createOrder(user.uid, orderPayload);
    } else {
      // Guest order: still write but with guestEmail
      await createOrder('guest', { ...orderPayload, guestEmail: formData.email });
    }
    setOrderSerial(serial);
    setTimeout(() => {
      setStep(4);
      clearCart();
    }, 3000);
  };

  // Reset on close
  const handleClose = () => {
    setStep(1);
    setFormData({ name: '', email: '', address: '', city: '', zip: '' });
    setOrderSerial('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="tco-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="tco-container">
            {/* TECHNICAL HEADER */}
            <header className="tco-header">
              <div className="tco-nav">
                <div className="tco-breadcrumb">SYSTEM {'>'} CHECKOUT {'>'} <span>PHASE_0{step}</span></div>
                {step < 4 && <button className="tco-close-btn" onClick={handleClose}>ABORT_ORDER [×]</button>}
              </div>
              <div className="tco-stepper">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`tco-step-dot ${step >= s ? 'active' : ''}`} />
                ))}
              </div>
            </header>

            <div className="tco-body">
              
              {/* PHASE 1: MANIFEST VERIFICATION */}
              {step === 1 && (
                <motion.div 
                  className="tco-phase"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="tco-phase-title">MANIFEST_VERIFICATION</h2>
                  <p className="tco-phase-desc">Confirm the payload contents before initiating logistics protocols.</p>
                  
                  <div className="tco-manifest-list">
                    {cart.map((item, i) => (
                      <div key={i} className="tco-manifest-item">
                        <div className="tco-item-info">
                          <span className="tco-item-name">{item.name}</span>
                          <span className="tco-item-qty">QTY: {item.quantity || 1}</span>
                        </div>
                        <span className="tco-item-price">R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="tco-manifest-total">
                      <span>TOTAL_PAYLOAD_VALUE</span>
                      <span>R{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="tco-primary-btn" onClick={handleNext}>
                    PROCEED_TO_LOGISTICS →
                  </button>
                </motion.div>
              )}

              {/* PHASE 2: LOGISTICS */}
              {step === 2 && (
                <motion.div 
                  className="tco-phase"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="tco-phase-title">LOGISTICS_PROTOCOLS</h2>
                  <p className="tco-phase-desc">Specify the drop coordinates and operative identification.</p>
                  
                  <form className="tco-form" onSubmit={(e) => { e.preventDefault(); handleFinalize(); }}>
                    <div className="tco-form-grid">
                      <div className="tco-input-group">
                        <label>OPERATIVE_NAME</label>
                        <input 
                          type="text" 
                          placeholder="EX: JOHN_DOE" 
                          required 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="tco-input-group">
                        <label>COMMS_CHANNEL (EMAIL)</label>
                        <input 
                          type="email" 
                          placeholder="EX: OPERATIVE@TOGGLE.COM" 
                          required 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="tco-input-group full">
                        <label>DROP_COORDINATES (ADDRESS)</label>
                        <input 
                          type="text" 
                          placeholder="STREET_ADDRESS" 
                          required 
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                      <div className="tco-input-group">
                        <label>SECTOR (CITY)</label>
                        <input 
                          type="text" 
                          placeholder="CITY_NAME" 
                          required 
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                      </div>
                      <div className="tco-input-group">
                        <label>SECTOR_CODE (ZIP)</label>
                        <input 
                          type="text" 
                          placeholder="0000" 
                          required 
                          value={formData.zip}
                          onChange={e => setFormData({...formData, zip: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="tco-actions">
                      <button type="button" className="tco-secondary-btn" onClick={() => setStep(1)}>
                        ← REVISE_MANIFEST
                      </button>
                      <button type="submit" className="tco-primary-btn">
                        DEPLOY_PAYLOAD // CONFIRM ORDER
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* PHASE 3: TRANSMISSION */}
              {step === 3 && (
                <motion.div 
                  className="tco-phase tco-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="tco-loader">
                    <motion.div 
                      className="tco-loader-fill"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    />
                  </div>
                  <h2 className="tco-phase-title">TRANSMITTING_PAYLOAD...</h2>
                  <p className="tco-phase-desc">Establishing secure handshake with Passion Core. Do not disconnect.</p>
                  <div className="tco-status-logs">
                    <div className="tco-log">ENCRYPTING_ORDER_DATA... OK</div>
                    <div className="tco-log">VERIFYING_LOGISTICS... OK</div>
                    <div className="tco-log">INITIATING_DROP_SEQUENCE... OK</div>
                  </div>
                </motion.div>
              )}

              {/* PHASE 4: SUCCESS */}
              {step === 4 && (
                <motion.div 
                  className="tco-phase tco-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="tco-success-icon">✓</div>
                  <h2 className="tco-phase-title" style={{ color: '#4CAF50' }}>PAYLOAD_DEPLOYED</h2>
                  <p className="tco-phase-desc">Your order has been ingested into the system. Check your comms channel for confirmation.</p>
                  
                  <div className="tco-order-card">
                    <div className="tco-order-row">
                      <span>ORDER_SERIAL:</span>
                      <span className="tco-serial">{orderSerial}</span>
                    </div>
                    <div className="tco-order-row">
                      <span>STATUS:</span>
                      <span style={{ color: '#4CAF50' }}>AWAITING_PROVISIONING</span>
                    </div>
                  </div>

                  <button className="tco-primary-btn" onClick={handleClose}>
                    RETURN_TO_ARCHIVE
                  </button>
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToggleCheckout;
