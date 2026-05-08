import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartManagerOpen, setIsCartManagerOpen] = useState(false);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('soffware_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('soffware_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => [
      ...prevCart, 
      { ...product, cartId: Date.now() + Math.random(), quantity: 1 }
    ]);
    // Automatically open cart when adding item
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((cartId) => {
    setCart((prevCart) => prevCart.filter(item => item.cartId !== cartId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const updateQuantity = useCallback((cartId, delta) => {
    setCart((prevCart) => {
      const itemToUpdate = prevCart.find(i => i.cartId === cartId);
      if (!itemToUpdate) return prevCart;

      if (delta > 0) {
        // Add a new duplicate
        return [...prevCart, { ...itemToUpdate, cartId: Date.now() + Math.random(), quantity: 1 }];
      } else {
        // Remove this specific instance
        return prevCart.filter(i => i.cartId !== cartId);
      }
    });
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const openCartManager = useCallback(() => {
    setIsCartManagerOpen(true);
  }, []);

  const closeCartManager = useCallback(() => {
    setIsCartManagerOpen(false);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((acc, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
      : item.price;
    return acc + (price * (item.quantity || 1));
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      cartTotal,
      isCartOpen, 
      isCartManagerOpen,
      addToCart, 
      removeFromCart, 
      clearCart,
      updateQuantity,
      toggleCart, 
      closeCart,
      openCartManager,
      closeCartManager
    }}>
      {children}
    </CartContext.Provider>
  );
};
