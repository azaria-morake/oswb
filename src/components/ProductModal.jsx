import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, CheckCircle } from 'lucide-react';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Simulated multiple images for the carousel
  const images = product ? [
    product.image,
    product.image, // Duplicate for demo
    product.image  // Duplicate for demo
  ] : [];

  if (!isOpen || !product) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      nextImage();
    } else if (swipe > swipeConfidenceThreshold) {
      prevImage();
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button className="modal-close-btn" onClick={onClose}>
              <X size={24} />
            </button>

            <div className="modal-body">
              <div className="carousel-container">
                <div className="tech-corner tl"></div>
                <div className="tech-corner tr"></div>
                <div className="tech-corner bl"></div>
                <div className="tech-corner br"></div>


                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={4}
                  centerZoomedOut={true}
                  wheel={{ wheelDisabled: true }} // Disable wheel to prevent conflict with scrolling
                >
                  {({ zoomIn, zoomOut, resetTransform, scale }) => (
                    <>
                      <div className="zoom-controls desktop-only">
                        <button onClick={() => zoomIn()} className="tech-ctrl"><ZoomIn size={20} /></button>
                        <button onClick={() => zoomOut()} className="tech-ctrl"><ZoomOut size={20} /></button>
                        <button onClick={() => resetTransform()} className="tech-ctrl"><Maximize size={20} /></button>
                      </div>
                      
                      <TransformComponent wrapperClass="zoom-wrapper">
                        <motion.div
                          key={currentIndex}
                          className="carousel-image-wrapper"
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={1}
                          onDragEnd={handleDragEnd}
                        >
                          <img 
                            src={images[currentIndex]} 
                            alt={`${product.name} - View ${currentIndex + 1}`} 
                            className="carousel-image"
                            draggable="false"
                          />
                        </motion.div>
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>

                <div className="carousel-nav desktop-only">
                  <button className="carousel-nav-btn prev" onClick={prevImage}><ChevronLeft size={30} /></button>
                  <button className="carousel-nav-btn next" onClick={nextImage}><ChevronRight size={30} /></button>
                </div>
                
                <div className="carousel-indicators">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`indicator ${idx === currentIndex ? 'active' : ''}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="modal-info">
                <div className="product-meta">
                  <span className="sku">SKU-00{product.id}</span>
                  <span className="stock-status">IN STOCK</span>
                </div>
                <h2>{product.name}</h2>
                <p className="price">{product.price}</p>
                {product.limited && <p className="limited-text">{product.limited}</p>}
                
                <div className="modal-desc">
                  <p>Premium quality streetwear. Swipe or use arrows to view more angles. Pinch or use controls to zoom.</p>
                </div>
                
                <div className="btn-orange-wrapper modal-btn-wrapper">
                  <div className="btn-orange-inner">
                    <button 
                      className="btn-orange modal-add-btn"
                      onClick={handleAddToCart}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showSnackbar && (
                  <motion.div 
                    className="modal-snackbar"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                  >
                    <CheckCircle size={16} />
                    <span>ITEM_ADDED_TO_SYSTEM</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
