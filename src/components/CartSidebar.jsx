import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  const handleClearCart = () => {
    clearCart();
    setShowConfirmClear(false);
  };

  return (
    <aside className="cart-sidebar">
      <div className="cart-header">
        <span>CART</span>
        {!showConfirmClear ? (
          <button 
            className="clear-cart-btn" 
            onClick={() => cart.length > 0 && setShowConfirmClear(true)}
            disabled={cart.length === 0}
            title="Clear Cart"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <div className="clear-confirm">
            <span className="confirm-text">CLEAR?</span>
            <div className="confirm-btns-vertical">
              <button className="confirm-btn yes" onClick={handleClearCart}>Y</button>
              <button className="confirm-btn no" onClick={() => setShowConfirmClear(false)}>N</button>
            </div>
          </div>
        )}
      </div>
      
      <div className="cart-items">
        {cart.length === 0 && (
          <div className="empty-cart-msg-vertical">
            <span>CART_EMPTY</span>
          </div>
        )}
        {cart.map((item, idx) => (
          <div key={item.cartId || idx} className="cart-item">
            <img src={item.image} alt={item.name} />
            <button 
              className="remove-item-btn" 
              onClick={() => removeFromCart(item.cartId)}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-footer">
        {cart.length} ITEMS
      </div>
    </aside>
  );
};

export default CartSidebar;
