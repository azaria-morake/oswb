import React, { useState } from 'react';
import { InteractionProvider } from './InteractionContext';
import TopBanner from './components/TopBanner';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedCollectibles from './components/FeaturedCollectibles';
import DigitalFittingRoom from './components/DigitalFittingRoom';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import GlobalAlert from './components/GlobalAlert';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([
    { cartId: 1, id: 1, name: 'Silicon Melt Hoodie', price: '$18.80', image: '/assets/hoodie2.png' },
    { cartId: 2, id: 2, name: 'Silicon Melt Hoodie', price: '$78.00', image: '/assets/hoodie1.png' },
    { cartId: 3, id: 3, name: 'Refined Stock', price: '$15.80', image: '/assets/can.png' },
  ]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter(item => item.cartId !== cartId));
  };

  return (
    <InteractionProvider>
      <div className="app-container">
        <TopBanner />
        <Header cartCount={cart.length} />
        
        <div className="content-wrapper">
          <main className="main-content">
            <Hero />
            <div className="main-grid-container">
              <FeaturedCollectibles onProductClick={handleProductClick} />
              <DigitalFittingRoom />
            </div>
          </main>
          
          <CartSidebar cart={cart} onRemove={removeFromCart} />
        </div>
        
        <Footer />
        
        <ProductModal 
          isOpen={!!selectedProduct} 
          onClose={closeProductModal} 
          product={selectedProduct}
          onAddToCart={addToCart}
        />

        <GlobalAlert />
      </div>
    </InteractionProvider>
  );
}


export default App;
