import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const AuthGuard = ({ children }) => {
  const { account, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0A0A0A', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#FF5C00', fontFamily: 'monospace' }}>
        {'>'} SYSTEM_AUTHENTICATION_PENDING...
      </div>
    );
  }

  if (!account || account.role !== 'admin') {
    // Redirect them to the home page, but save the current location they were trying to go to
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
