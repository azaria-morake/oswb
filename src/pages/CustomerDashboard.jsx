import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import DashboardLoginGate from '../components/dashboard/DashboardLoginGate';
import DashboardSkeletonLoader from '../components/dashboard/DashboardSkeletonLoader';
import DashboardTerminalRail from '../components/dashboard/DashboardTerminalRail';
import OrderVault from '../components/dashboard/OrderVault';
import RigGallery from '../components/dashboard/RigGallery';
import SystemConfig from '../components/dashboard/SystemConfig';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = useState('vault');
  const [orders, setOrders] = useState([]);

  if (loading) return <DashboardSkeletonLoader />;
  if (!user) return <DashboardLoginGate />;

  const totalSpend = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="cd-wrap">
      <DashboardTerminalRail
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        orders={orders}
      />
      <main className="cd-main">
        <div className="cd-breadcrumb">
          SYSTEM {'>'} PERSONAL_TERMINAL {'>'} <span>{activeModule.toUpperCase()}</span>
        </div>
        <AnimatePresence mode="wait">
          {activeModule === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <OrderVault onOrdersLoaded={setOrders} />
            </motion.div>
          )}
          {activeModule === 'rigs' && (
            <motion.div key="rigs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <RigGallery />
            </motion.div>
          )}
          {activeModule === 'config' && (
            <motion.div key="config" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SystemConfig totalSpend={totalSpend} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default CustomerDashboard;
