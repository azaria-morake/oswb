import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../CartContext';
import './ToggleProvisioningBay.css';

/* ─────────────────────────────────────────────
   NETWORK STATUS TICKER
───────────────────────────────────────────── */
function NetworkTicker({ stock }) {
  if (stock === undefined || stock === null) {
    return <span className="tpb-ticker tpb-ticker--stable"><span className="tpb-blink" />STATUS: STABLE</span>;
  }
  if (stock <= 0) {
    return <span className="tpb-ticker tpb-ticker--offline"><span className="tpb-blink" />STATUS: OFFLINE</span>;
  }
  if (stock < 10) {
    return <span className="tpb-ticker tpb-ticker--low"><span className="tpb-blink" />STATUS: LOW_SIGNAL — {stock} LEFT</span>;
  }
  return <span className="tpb-ticker tpb-ticker--stable"><span className="tpb-blink" />STATUS: STABLE</span>;
}

/* ─────────────────────────────────────────────
   HARDWARE INSPECTION LENS
───────────────────────────────────────────── */
function InspectionLens({ src, visible, pos, containerRef }) {
  const LENS_SIZE = 130;
  const ZOOM = 2.8;

  const style = {
    left: pos.x - LENS_SIZE / 2,
    top: pos.y - LENS_SIZE / 2,
    backgroundImage: `url(${src})`,
    backgroundSize: containerRef.current
      ? `${containerRef.current.offsetWidth * ZOOM}px ${containerRef.current.offsetHeight * ZOOM}px`
      : `${ZOOM * 100}%`,
    backgroundPosition: `-${pos.x * ZOOM - LENS_SIZE / 2}px -${pos.y * ZOOM - LENS_SIZE / 2}px`,
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="tpb-lens"
          style={style}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.12 }}
        >
          <div className="tpb-lens-label">SCANNING_TEXTURE... <span>OK</span></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   PARTICLE BURST
───────────────────────────────────────────── */
function CartParticle({ id, onDone }) {
  return (
    <div className="tpb-particles">
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="tpb-particle"
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: (Math.random() - 0.5) * 80,
            y: -60 - Math.random() * 40,
            scale: 0,
          }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.04 }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROVISIONING CARD
───────────────────────────────────────────── */
function ProvisionCard({ product, isSelected, onToggleSelect, onAddSingle, packMode }) {
  const imgRef = useRef(null);
  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  const handleMouseMove = useCallback((e) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLensPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleAddClick = (e) => {
    e.stopPropagation();
    setParticles(p => [...p, Date.now()]);
    onAddSingle(product);
  };

  const imageSrc = product.images?.[0] || product.image || '';
  const stock = product.stock;
  const isOffline = stock !== undefined && stock !== null && stock <= 0;

  const specs = [
    { label: 'SKU', value: product.id?.slice(0, 8).toUpperCase() || 'N/A' },
    { label: 'CAT', value: product.category || 'APPAREL' },
    { label: 'DROP', value: product.dropName || 'TOGGLE_INIT' },
    { label: 'STOCK', value: stock ?? '∞' },
  ];

  return (
    <motion.div
      className={`tpb-card${isSelected ? ' tpb-card--selected' : ''}${isOffline ? ' tpb-card--offline' : ''}`}
      layout
      data-product-id={product.id}
    >
      {packMode && (
        <div className="tpb-card-select-indicator" onClick={() => onToggleSelect(product.id)}>
          <motion.div
            className="tpb-card-checkbox"
            animate={{ borderColor: isSelected ? '#FFF' : '#333', backgroundColor: isSelected ? '#FFF' : 'transparent' }}
          >
            {isSelected && (
              <motion.svg width="10" height="10" viewBox="0 0 10 10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2 }}>
                <polyline points="1,5 4,8 9,2" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
              </motion.svg>
            )}
          </motion.div>
        </div>
      )}

      <div
        className="tpb-card-image-wrap"
        ref={imgRef}
        onMouseEnter={() => setLensVisible(true)}
        onMouseLeave={() => setLensVisible(false)}
        onMouseMove={handleMouseMove}
      >
        {imageSrc
          ? <img src={imageSrc} alt={product.name} className="tpb-card-img" />
          : <div className="tpb-card-img-placeholder">NO_IMG</div>
        }
        <div className="tpb-card-spec-overlay">
          {specs.map(s => (
            <div key={s.label} className="tpb-spec-row">
              <span className="tpb-spec-label">{s.label}</span>
              <span className="tpb-spec-value">{s.value}</span>
            </div>
          ))}
        </div>
        <InspectionLens src={imageSrc} visible={lensVisible && !!imageSrc} pos={lensPos} containerRef={imgRef} />
      </div>

      <div className="tpb-card-body">
        <div className="tpb-card-name">{product.name || 'UNKNOWN_ITEM'}</div>
        <NetworkTicker stock={stock} />
        <div className="tpb-card-footer">
          <div className="tpb-card-price">
            {product.price ? `R${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}` : '—'}
          </div>
          <div style={{ position: 'relative' }}>
            <button className="tpb-add-btn" onClick={handleAddClick} disabled={isOffline}>
              {isOffline ? 'OFFLINE' : 'PROVISION +'}
            </button>
            <AnimatePresence>
              {particles.map(id => (
                <CartParticle key={id} id={id} onDone={() => setParticles(p => p.filter(x => x !== id))} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PACK CONNECTOR SVG
───────────────────────────────────────────── */
function PackConnector({ selectedIds, containerRef }) {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    if (!containerRef.current || selectedIds.length < 2) { setPaths([]); return; }
    const containerRect = containerRef.current.getBoundingClientRect();
    const centers = [];
    selectedIds.forEach(id => {
      const el = containerRef.current.querySelector(`[data-product-id="${id}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        centers.push({ x: r.left - containerRect.left + r.width / 2, y: r.top - containerRect.top + r.height / 2 });
      }
    });
    const newPaths = [];
    for (let i = 0; i < centers.length - 1; i++) newPaths.push({ from: centers[i], to: centers[i + 1] });
    setPaths(newPaths);
  }, [selectedIds, containerRef]);

  if (!paths.length) return null;

  return (
    <svg className="tpb-connector-svg">
      {paths.map((p, i) => (
        <motion.line
          key={i}
          x1={p.from.x} y1={p.from.y} x2={p.to.x} y2={p.to.y}
          stroke="#FFF" strokeWidth="1" strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN — PROVISIONING BAY MODAL
───────────────────────────────────────────── */
const ToggleProvisioningBay = ({ isOpen, onClose, products, onOpenCart }) => {
  const { addToCart, cartCount } = useCart();
  const [packMode, setPackMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [connecting, setConnecting] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handlePackToggle = () => {
    const next = !packMode;
    setPackMode(next);
    if (next) {
      setConnecting(true);
      setTimeout(() => { setSelectedIds(products.map(p => p.id)); setConnecting(false); }, 600);
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleProvisionPack = () => {
    products.filter(p => selectedIds.includes(p.id)).forEach(p => addToCart(p));
    onClose();
  };

  const totalSelected = selectedIds.length;
  const packPrice = products
    .filter(p => selectedIds.includes(p.id))
    .reduce((acc, p) => {
      const price = typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, '')) : (p.price || 0);
      return acc + price;
    }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tpb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Positioner + Modal */}
          <div className="tpb-positioner">
            <motion.div
              className="tpb-modal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              onClick={e => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="tpb-header">
                <div className="tpb-header-left">
                  <div className="tpb-header-label">PROVISIONING BAY</div>
                  <div className="tpb-header-title">TOGGLE INIT — DROP 01</div>
                </div>

                <div className="tpb-pack-toggle-wrap">
                  <div className="tpb-pack-label">
                    {connecting
                      ? <span className="tpb-connecting">CONNECTING<span className="tpb-dots" /></span>
                      : <span>PROVISION FULL PACK</span>
                    }
                  </div>
                  <button className={`tpb-switch${packMode ? ' tpb-switch--on' : ''}`} onClick={handlePackToggle} aria-label="Toggle full pack">
                    <motion.div
                      className="tpb-switch-thumb"
                      animate={{ x: packMode ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Cart icon with live badge */}
                <button className="tpb-cart-icon-wrap" onClick={onOpenCart} aria-label="Open cart">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                  <AnimatePresence mode="wait">
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        className="tpb-cart-badge"
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                <button className="tpb-close-btn" onClick={onClose} aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* SYSTEM BAR */}
              <div className="tpb-system-bar">
                <span>SYS: TOGGLE_INIT_v1.0</span>
                <span>UNITS_TRACKED: {products.length}</span>
                <span className="tpb-sys-green">● FIREBASE_SYNC_LIVE</span>
              </div>

              {/* GRID */}
              <div className="tpb-grid-wrap" ref={gridRef}>
                {products.length === 0 ? (
                  <div className="tpb-empty">
                    <div className="tpb-empty-icon">⊘</div>
                    <div>NO INVENTORY DETECTED</div>
                    <div className="tpb-empty-sub">AWAITING PRODUCT MANIFEST...</div>
                  </div>
                ) : (
                  <div className="tpb-grid" style={{ position: 'relative' }}>
                    <PackConnector selectedIds={selectedIds} containerRef={gridRef} />
                    {products.map(product => (
                      <ProvisionCard
                        key={product.id}
                        product={product}
                        isSelected={selectedIds.includes(product.id)}
                        onToggleSelect={toggleSelectProduct}
                        onAddSingle={addToCart}
                        packMode={packMode}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <AnimatePresence>
                {packMode && selectedIds.length > 0 && (
                  <motion.div
                    className="tpb-footer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="tpb-footer-info">
                      <span className="tpb-footer-count">{totalSelected} ITEMS SELECTED</span>
                      <span className="tpb-footer-price">PAYLOAD TOTAL: R{packPrice.toFixed(2)}</span>
                    </div>
                    <button className="tpb-provision-btn" onClick={handleProvisionPack}>
                      DEPLOY PAYLOAD →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ToggleProvisioningBay;
