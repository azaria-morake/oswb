import React from 'react';

const STATUS_MAP = {
  processing: { code: '[PROC]', color: '#FF6B35' },
  shipped:    { code: '[SHPD]', color: '#FFD700' },
  delivered:  { code: '[DELV]', color: '#4CAF50' },
  cancelled:  { code: '[CNCL]', color: '#666' },
};

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
};

const OrderCard = ({ order, onClick }) => {
  const status = STATUS_MAP[order.status] || STATUS_MAP.processing;
  const itemCount = order.itemsSnapshot?.length || 0;
  const total = typeof order.total === 'number' ? order.total.toFixed(2) : '—';

  return (
    <button className="doc-row" onClick={onClick}>
      <span className="doc-serial">{order.serial || order.id?.slice(0, 12).toUpperCase()}</span>
      <span className="doc-date">{formatDate(order.createdAt)}</span>
      <span className="doc-items">{itemCount}_ITEMS</span>
      <span className="doc-total">R{total}</span>
      <span className="doc-status" style={{ color: status.color }}>{status.code}</span>
      <span className="doc-chevron">›</span>
    </button>
  );
};

export default OrderCard;
