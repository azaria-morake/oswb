import React, { createContext, useContext, useState, useCallback } from 'react';

const InteractionContext = createContext();

export const useInteraction = () => useContext(InteractionContext);

export const InteractionProvider = ({ children }) => {
  const [shopDropText, setShopDropText] = useState('SHOP THE DROP');
  const [isShopDropAnimating, setIsShopDropAnimating] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const triggerNotYetAlert = useCallback(() => {
    // Open the premium modal
    setIsAlertOpen(true);
    
    // Maintain the button text animation as a secondary feedback
    if (isShopDropAnimating) return;
    setIsShopDropAnimating(true);
    setShopDropText("you can't go there yet");
    
    setTimeout(() => {
      setShopDropText('SHOP THE DROP');
      setIsShopDropAnimating(false);
    }, 2500);
  }, [isShopDropAnimating]);

  const closeAlert = useCallback(() => {
    setIsAlertOpen(false);
  }, []);

  return (
    <InteractionContext.Provider value={{ 
      shopDropText, 
      triggerNotYetAlert, 
      isShopDropAnimating, 
      isAlertOpen, 
      closeAlert 
    }}>
      {children}
    </InteractionContext.Provider>
  );
};

