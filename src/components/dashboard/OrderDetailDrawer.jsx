import React, { useState } from 'react';
import { motion } from 'framer-motion';

const STATUS_MAP = {
  processing: { code: '[PROC]', color: '#FF6B35', label: 'PROCESSING' },
  shipped:    { code: '[SHPD]', color: '#FFD700', label: 'SHIPPED' },
  delivered:  { code: '[DELV]', color: '#4CAF50', label: 'DELIVERED' },
  cancelled:  { code: '[CNCL]', color: '#666',    label: 'CANCELLED' },
};

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
};

const OrderDetailDrawer = ({ order, onClose, onReorder, onSupport }) => {
  const [ticketSent, setTicketSent] = useState(false);
  const status = STATUS_MAP[order.status] || STATUS_MAP.processing;
  const items = order.itemsSnapshot || [];

  const handleReturn = async () => {
    await onSupport(order.id, 'RETURN_REQUEST');
    setTicketSent(true);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="dodd-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.aside
        className="dodd-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        <div className="dodd-header">
          <div>
            <div className="dodd-label">ORDER_DETAIL</div>
            <div className="dodd-serial">{order.serial || order.id?.slice(0, 12).toUpperCase()}</div>
          </div>
          <button className="dodd-close" onClick={onClose}>✕</button>
        </div>

        <div className="dodd-meta">
          <div className="dodd-meta-row">
            <span>DATE:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="dodd-meta-row">
            <span>STATUS:</span>
            <span style={{ color: status.color }}>{status.code} {status.label}</span>
          </div>
          {order.trackingNumber && (
            <div className="dodd-meta-row">
              <span>TRACKING:</span>
              <span className="dodd-tracking">{order.trackingNumber}</span>
            </div>
          )}
          <div className="dodd-meta-row">
            <span>DROP_COORDINATES:</span>
            <span>
              {order.shippingAddress?.street}, {order.shippingAddress?.city}
            </span>
          </div>
        </div>

        <div className="dodd-divider" />

        <div className="dodd-items-header">ITEMS_SNAPSHOT</div>
        <div className="dodd-items">
          {items.length === 0 ? (
            <div className="dodd-no-items">NO_ITEM_DATA</div>
          ) : items.map((item, i) => (
            <div key={i} className="dodd-item">
              {item.image && <img src={item.image} alt={item.name} className="dodd-item-img" />}
              <div className="dodd-item-info">
                <div className="dodd-item-name">{item.name}</div>
                <div className="dodd-item-qty">QTY: {item.quantity}</div>
              </div>
              <div className="dodd-item-price">R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="dodd-divider" />

        <div className="dodd-total-row">
          <span>PAYLOAD_TOTAL</span>
          <span>R{(order.total || 0).toFixed(2)}</span>
        </div>

        <div className="dodd-actions">
          <button
            className="dodd-btn-reorder"
            onClick={() => { onReorder(items); onClose(); }}
            disabled={items.length === 0}
          >
            ↺ ONE-CLICK_REORDER
          </button>

          {ticketSent ? (
            <div className="dodd-ticket-sent">TICKET_SUBMITTED // WE'LL BE IN TOUCH</div>
          ) : (
            <button className="dodd-btn-return" onClick={handleReturn}>
              REQUEST_RETURN
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default OrderDetailDrawer;
