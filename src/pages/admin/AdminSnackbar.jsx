import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import './Admin.css';

const AdminSnackbar = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`admin-snackbar ${type}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span>{message}</span>
    </div>
  );
};

export default AdminSnackbar;
