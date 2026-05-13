import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InteractionProvider } from './InteractionContext';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import Home from './pages/Home';
import Drops from './pages/Drops';
import ToggleArchive from './pages/ToggleArchive';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartManagerModal from './components/CartManagerModal';
import GlobalAlert from './components/GlobalAlert';
import ConsumerLayout from './layouts/ConsumerLayout';
import AuthGuard from './components/admin/AuthGuard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminDropManager from './pages/admin/AdminDropManager';
import AdminProductVault from './pages/admin/AdminProductVault';
import AdminHomeManager from './pages/admin/AdminHomeManager';
import CustomerDashboard from './pages/CustomerDashboard';

import { useCart } from './CartContext';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cart, cartCount, addToCart, removeFromCart, isCartOpen, closeCart } = useCart();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <InteractionProvider>
      <Router>
          <Routes>
            {/* Consumer Routes */}
            <Route 
              path="/" 
              element={
                <ConsumerLayout 
                  cartCount={cartCount} 
                  selectedProduct={selectedProduct} 
                  closeProductModal={closeProductModal} 
                  addToCart={addToCart} 
                />
              }
            >
              <Route index element={<Home onProductClick={handleProductClick} />} />
              <Route 
                path="drops" 
                element={
                  <Drops 
                    onProductClick={handleProductClick} 
                    onQuickAdd={addToCart} 
                  />
                } 
              />
              <Route 
                path="toggle" 
                element={
                  <ToggleArchive 
                    onProductClick={handleProductClick} 
                  />
                } 
              />
              <Route path="dashboard" element={<CustomerDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AuthGuard>
                  <AdminLayout />
                </AuthGuard>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="home" element={<AdminHomeManager />} />
              <Route path="drops" element={<AdminDropManager />} />
              <Route path="vault" element={<AdminProductVault />} />
            </Route>
          </Routes>
      </Router>
    </InteractionProvider>
  );
}

export default App;
