import React from 'react';
import { X } from 'lucide-react';
import './CartSidebar.css';



const CartSidebar = ({ cart, onRemove }) => {
  return (
    <aside className="cart-sidebar">
      <div className="cart-header">
        <span>CART</span>
        <button className="close-btn"><X size={16} /></button>
      </div>
      
      <div className="cart-items">
        {cart.map((item, idx) => (
          <div key={item.cartId || idx} className="cart-item">
            <img src={item.image} alt={item.name} />
            <button 
              className="remove-item-btn" 
              onClick={() => onRemove(item.cartId)}
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
