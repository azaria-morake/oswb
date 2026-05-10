import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../CartContext';
import './CartManagerModal.css';

const CartManagerModal = () => {
  const { 
    isCartManagerOpen, 
    closeCartManager, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    cartTotal 
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  // Reset confirm state when modal closes
  React.useEffect(() => {
    if (!isCartManagerOpen) {
      setShowClearConfirm(false);
    }
  }, [isCartManagerOpen]);

  React.useEffect(() => {
    if (isCartManagerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartManagerOpen]);

  if (!isCartManagerOpen) return null;

  return (
    <AnimatePresence>
      {isCartManagerOpen && (
        <motion.div 
          className="cart-manager-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="cart-manager-content"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Tech Corners */}
            <div className="tech-corner tl"></div>
            <div className="tech-corner tr"></div>
            <div className="tech-corner bl"></div>
            <div className="tech-corner br"></div>

            <div className="cart-manager-header">
              <span className="cart-manager-title">CART_MANAGER // MODULE</span>
              <button className="modal-close-btn" onClick={closeCartManager}>
                <X size={24} />
              </button>
            </div>

            <div className="cart-manager-body">
              {/* Left Side: Matrix */}
              <div className="cart-manager-matrix">
                {cart.length > 0 ? (
                  <>
                    <div className="matrix-header">
                      <span>ITEM_DATA</span>
                      <span>QTY</span>
                      <span>UNIT_PRICE</span>
                      <span>ACTION</span>
                    </div>
                    
                    <div className="matrix-items">
                      {/* Group items by ID for the manager view */}
                      {Object.values(cart.reduce((acc, item) => {
                        if (!acc[item.id]) {
                          acc[item.id] = { ...item, quantity: 0, cartIds: [] };
                        }
                        acc[item.id].quantity += (item.quantity || 1);
                        acc[item.id].cartIds.push(item.cartId);
                        return acc;
                      }, {})).map((group, idx) => (
                        <div key={group.id} className="matrix-item">
                          <div className="item-details">
                            <div className="item-thumb">
                              <img src={group.image} alt={group.name} />
                            </div>
                            <div className="item-info">
                              <h4>{group.name}</h4>
                              <span className="item-sku">SKU: {group.id}-GRP</span>
                            </div>
                          </div>
                          
                          <div className="item-quantity-controls">
                            <button 
                              className="qty-control-btn" 
                              onClick={() => updateQuantity(group.cartIds[0], -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="qty-display">{group.quantity}</span>
                            <button 
                              className="qty-control-btn" 
                              onClick={() => updateQuantity(group.cartIds[0], 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="item-price">
                            {group.price}
                          </div>
                          
                          <button 
                            className="item-remove-btn" 
                            onClick={() => removeFromCart(group.cartIds[0])}
                            title="Remove Unit"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="manager-empty-state">
                    <ShoppingCart size={48} />
                    <span>SYSTEM_EMPTY</span>
                  </div>
                )}
              </div>

              {/* Right Side: Operations Console */}
              <div className="cart-manager-console">
                <div className="console-section">
                  <h3 className="console-title">ORDER_SUMMARY</h3>
                  <div className="console-row">
                    <span>SUBTOTAL</span>
                    <span>ZAR {cartTotal.toLocaleString()}</span>
                  </div>

                  
                  <div className="console-row total">
                    <span>TOTAL</span>
                    <span>ZAR {cartTotal.toLocaleString()}</span>
                  </div>
                </div>



                <div className="console-actions">
                  {showClearConfirm ? (
                    <motion.div 
                      className="clear-confirm-container"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <p className="clear-confirm-text">PURGE ALL DATA?</p>
                      <div className="clear-confirm-actions">
                        <button 
                          className="btn-confirm-clear"
                          onClick={() => {
                            clearCart();
                            setShowClearConfirm(false);
                          }}
                        >
                          CONFIRM
                        </button>
                        <button 
                          className="btn-cancel-clear"
                          onClick={() => setShowClearConfirm(false)}
                        >
                          CANCEL
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <button 
                        className="btn-checkout" 
                        onClick={() => alert("Checkout flow initializing...")}
                        disabled={cart.length === 0}
                        style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        CHECKOUT
                      </button>
                      
                      <button 
                        className="btn-clear-all" 
                        onClick={() => setShowClearConfirm(true)}
                        disabled={cart.length === 0}
                        style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        CLEAR
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartManagerModal;
