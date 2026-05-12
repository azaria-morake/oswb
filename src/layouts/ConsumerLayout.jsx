import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBanner from '../components/TopBanner';
import Header from '../components/Header';
import CartSidebar from '../components/CartSidebar';
import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';
import CartManagerModal from '../components/CartManagerModal';
import GlobalAlert from '../components/GlobalAlert';
import { useCart } from '../CartContext';

import { useLocation } from 'react-router-dom';

const ConsumerLayout = ({ cartCount, selectedProduct, closeProductModal, addToCart }) => {
  const location = useLocation();
  const isToggleRoute = location.pathname === '/toggle';

  return (
    <div className={`app-container ${isToggleRoute ? 'toggle-mode' : ''}`}>
      {!isToggleRoute && (
        <div className="sticky-header-wrapper">
          <TopBanner />
          <Header cartCount={cartCount} isToggle={false} />
        </div>
      )}
      
      <div className="content-wrapper">
        <main className="main-content">
          <Outlet />
        </main>
        
        {!isToggleRoute && <CartSidebar />}
      </div>
      
      {!isToggleRoute && <Footer />}
      
      <ProductModal 
        isOpen={!!selectedProduct} 
        onClose={closeProductModal} 
        product={selectedProduct}
        onAddToCart={addToCart}
      />

      <CartManagerModal />

      <GlobalAlert />
    </div>
  );
};

export default ConsumerLayout;
