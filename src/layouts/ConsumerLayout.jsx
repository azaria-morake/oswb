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

const ConsumerLayout = ({ cartCount, selectedProduct, closeProductModal, addToCart }) => {
  return (
    <div className="app-container">
      <div className="sticky-header-wrapper">
        <TopBanner />
        <Header cartCount={cartCount} />
      </div>
      
      <div className="content-wrapper">
        <main className="main-content">
          <Outlet />
        </main>
        
        <CartSidebar />
      </div>
      
      <Footer />
      
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
