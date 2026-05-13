import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../AuthContext';
import { listenToUserOrders, submitSupportTicket } from '../../firebase/api';
import { useCart } from '../../CartContext';
import OrderCard from './OrderCard';
import OrderDetailDrawer from './OrderDetailDrawer';

const STATUS_EMPTY = () => (
  <div className="dov-empty">
    <div className="dov-empty-icon">⊘</div>
    <div className="dov-empty-title">VAULT_EMPTY</div>
    <div className="dov-empty-sub">NO_ORDERS_FOUND // INITIATE_A_DROP_TO_BEGIN</div>
  </div>
);

const OrderVault = ({ onOrdersLoaded }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserOrders(user.uid, (data) => {
      setOrders(data);
      onOrdersLoaded?.(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleReorder = (items) => {
    items.forEach(item => addToCart({ ...item, cartId: Date.now() + Math.random() }));
  };

  return (
    <div className="dov-wrap">
      <div className="dov-header">
        <div>
          <h2 className="dov-title">THE VAULT</h2>
          <p className="dov-sub">ORDER_HISTORY // {orders.length}_TRANSACTIONS</p>
        </div>
        <div className="dov-live-pip">
          <span className="dov-pip-dot" /> LIVE_SYNC
        </div>
      </div>

      {loading ? (
        <div className="dov-loading">SCANNING_VAULT...</div>
      ) : orders.length === 0 ? (
        <STATUS_EMPTY />
      ) : (
        <>
          <div className="dov-manifest-header">
            <span>ORDER_SERIAL</span>
            <span>DATE</span>
            <span>ITEMS</span>
            <span>TOTAL</span>
            <span>STATUS</span>
            <span />
          </div>
          <div className="dov-list">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onReorder={handleReorder}
            onSupport={(orderId, reason) => submitSupportTicket(user.uid, orderId, reason)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderVault;
