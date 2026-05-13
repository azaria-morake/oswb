import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../CartContext';
import './ToggleCartManager.css';

const ToggleCartManager = ({ isOpen, onClose, onCheckout }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) setShowClearConfirm(false);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Group duplicate items for display
  const grouped = Object.values(
    cart.reduce((acc, item) => {
      if (!acc[item.id]) acc[item.id] = { ...item, quantity: 0, cartIds: [] };
      acc[item.id].quantity += (item.quantity || 1);
      acc[item.id].cartIds.push(item.cartId);
      return acc;
    }, {})
  );

  const itemCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tcm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="tcm-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div className="tcm-header">
              <div className="tcm-header-left">
                <div className="tcm-header-label">PAYLOAD BAY</div>
                <div className="tcm-header-title">
                  CART_MANIFEST
                  {itemCount > 0 && <span className="tcm-item-count">_{itemCount}_ITEMS</span>}
                </div>
              </div>
              <button className="tcm-close-btn" onClick={onClose} aria-label="Close cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* System bar */}
            <div className="tcm-sys-bar">
              <span>SYS: GLOBAL_CART_SYNC</span>
              <span className={itemCount > 0 ? 'tcm-sys-green' : 'tcm-sys-dim'}>
                {itemCount > 0 ? '● PAYLOAD_LOADED' : '○ PAYLOAD_EMPTY'}
              </span>
            </div>

            {/* Item list */}
            <div className="tcm-items-wrap">
              <AnimatePresence initial={false}>
                {grouped.length === 0 ? (
                  <motion.div
                    className="tcm-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="tcm-empty-icon">⊘</div>
                    <div className="tcm-empty-label">NO ITEMS LOADED</div>
                    <div className="tcm-empty-sub">ADD ITEMS VIA PROVISIONING BAY</div>
                  </motion.div>
                ) : (
                  grouped.map((group) => {
                    const imageSrc = group.images?.[0] || group.image || '';
                    const price = typeof group.price === 'string'
                      ? parseFloat(group.price.replace(/[^0-9.]/g, ''))
                      : (group.price || 0);
                    return (
                      <motion.div
                        key={group.id}
                        className="tcm-item"
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {/* Thumbnail */}
                        <div className="tcm-item-thumb">
                          {imageSrc
                            ? <img src={imageSrc} alt={group.name} />
                            : <div className="tcm-thumb-placeholder">NO_IMG</div>
                          }
                        </div>

                        {/* Info */}
                        <div className="tcm-item-info">
                          <div className="tcm-item-name">{group.name}</div>
                          <div className="tcm-item-sku">SKU: {group.id?.slice(0, 8).toUpperCase()}</div>
                          <div className="tcm-item-price">R{(price * group.quantity).toFixed(2)}</div>
                        </div>

                        {/* Qty controls */}
                        <div className="tcm-qty-controls">
                          <button className="tcm-qty-btn" onClick={() => updateQuantity(group.cartIds[0], -1)} aria-label="Remove one">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                          <span className="tcm-qty-val">{group.quantity}</span>
                          <button className="tcm-qty-btn" onClick={() => updateQuantity(group.cartIds[0], 1)} aria-label="Add one">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          </button>
                        </div>

                        {/* Remove */}
                        <button className="tcm-remove-btn" onClick={() => removeFromCart(group.cartIds[0])} aria-label="Remove item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="tcm-footer">
              <div className="tcm-total-row">
                <span className="tcm-total-label">PAYLOAD TOTAL</span>
                <span className="tcm-total-value">R{cartTotal.toFixed(2)}</span>
              </div>

              <AnimatePresence mode="wait">
                {showClearConfirm ? (
                  <motion.div
                    key="confirm"
                    className="tcm-confirm-wrap"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <div className="tcm-confirm-label">PURGE ALL ITEMS?</div>
                    <div className="tcm-confirm-btns">
                      <button className="tcm-btn-confirm" onClick={() => { clearCart(); setShowClearConfirm(false); }}>CONFIRM</button>
                      <button className="tcm-btn-cancel" onClick={() => setShowClearConfirm(false)}>CANCEL</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="actions"
                    className="tcm-actions"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <button
                      className="tcm-checkout-btn"
                      disabled={grouped.length === 0}
                      onClick={onCheckout}
                    >
                      DEPLOY ORDER →
                    </button>
                    <button
                      className="tcm-clear-btn"
                      disabled={grouped.length === 0}
                      onClick={() => setShowClearConfirm(true)}
                    >
                      PURGE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ToggleCartManager;
