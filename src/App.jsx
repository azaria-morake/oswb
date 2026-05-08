import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InteractionProvider } from './InteractionContext';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import Home from './pages/Home';
import Drops from './pages/Drops';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartManagerModal from './components/CartManagerModal';
import GlobalAlert from './components/GlobalAlert';

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
        <div className="app-container">
          <div className="sticky-header-wrapper">
            <TopBanner />
            <Header cartCount={cartCount} />
          </div>
          
          <div className="content-wrapper">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home onProductClick={handleProductClick} />} />
                <Route 
                  path="/drops" 
                  element={
                    <Drops 
                      onProductClick={handleProductClick} 
                      onQuickAdd={addToCart} 
                    />
                  } 
                />
              </Routes>
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
      </Router>
    </InteractionProvider>
  );
}

export default App;
