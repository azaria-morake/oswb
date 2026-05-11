import React, { useState, useEffect } from 'react';
import { 
  listenToAllProducts, 
  uploadAdminAsset, 
  createProduct, 
  updateProductStatus, 
  updateProduct,
  deleteProduct,
  listenToDropContainers,
  createDropContainer,
  deleteDropContainer,
  deleteAdminAsset,
  updateDropContainerStatus
} from '../../firebase/api';
import { UploadCloud, Plus, X, Pencil, Trash2, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminSnackbar from './AdminSnackbar';

const AdminProductVault = () => {
  const [products, setProducts] = useState([]);
  const [dropContainers, setDropContainers] = useState([]);
  
  // Modals state
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isDropManagerOpen, setIsDropManagerOpen] = useState(false);
  
  // UI State
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', type: '' });
  const [filterDrop, setFilterDrop] = useState('ALL');

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isLimited, setIsLimited] = useState(false);
  const [category, setCategory] = useState('HEAD');
  const [assignedDrop, setAssignedDrop] = useState('');
  
  // Image State (Files)
  const [gridImage, setGridImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(null);
  const [fittingRoomImages, setFittingRoomImages] = useState(null);
  
  // Image State (Existing URLs for editing)
  const [existingImages, setExistingImages] = useState([]);
  const [existingFittingRoomUrls, setExistingFittingRoomUrls] = useState([]);
  const [assetsToDelete, setAssetsToDelete] = useState([]);

  // Drop Manager Form State
  const [newDropName, setNewDropName] = useState('');

  const handleGallerySelect = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(prev => {
      const current = prev ? Array.from(prev) : [];
      const combined = [...current, ...files];
      return combined.slice(0, 5); // limit to 5
    });
    // Clear input so same file can be selected again if needed
    if (e.target) e.target.value = null;
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => {
      const current = prev ? Array.from(prev) : [];
      return current.filter((_, i) => i !== index);
    });
  };

    const moveGalleryImage = (index, direction) => {
    setGalleryImages(prev => {
      if (!prev) return prev;
      const current = Array.from(prev);
      if (direction === -1 && index > 0) {
        [current[index - 1], current[index]] = [current[index], current[index - 1]];
      } else if (direction === 1 && index < current.length - 1) {
        [current[index + 1], current[index]] = [current[index], current[index + 1]];
      }
      return current;
    });
  };

  const moveExistingGalleryImage = (index, direction) => {
    setExistingImages(prev => {
      const current = [...prev];
      if (direction === -1 && index > 1) {
        [current[index - 1], current[index]] = [current[index], current[index - 1]];
      } else if (direction === 1 && index < current.length - 1) {
        [current[index + 1], current[index]] = [current[index], current[index + 1]];
      }
      return current;
    });
  };

  const removeExistingGalleryImage = (index) => {
    setExistingImages(prev => {
      const current = [...prev];
      setAssetsToDelete(del => [...del, current[index]]);
      current.splice(index, 1);
      return current;
    });
  };

  const handleFittingRoomSelect = (e) => {
    const files = Array.from(e.target.files).map(file => ({ file, layer: category })); // default to global category
    setFittingRoomImages(prev => {
      const current = prev ? Array.from(prev) : [];
      const combined = [...current, ...files];
      return combined.slice(0, 5); // limit to 5
    });
    if (e.target) e.target.value = null;
  };

  const removeFittingRoomImage = (index) => {
    setFittingRoomImages(prev => {
      const current = prev ? Array.from(prev) : [];
      return current.filter((_, i) => i !== index);
    });
  };

  const updateFittingRoomImageLayer = (index, newLayer) => {
    setFittingRoomImages(prev => {
      if (!prev) return prev;
      const current = [...prev];
      current[index] = { ...current[index], layer: newLayer };
      return current;
    });
  };

  const updateExistingFittingRoomLayer = (index, newLayer) => {
    setExistingFittingRoomUrls(prev => {
      const current = [...prev];
      current[index] = { ...current[index], layer: newLayer };
      return current;
    });
  };

  const removeExistingFittingRoomUrl = (index) => {
    setExistingFittingRoomUrls(prev => {
      const current = [...prev];
      setAssetsToDelete(del => [...del, current[index].url]);
      return current.filter((_, i) => i !== index);
    });
  };

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (isCreatorOpen || isDropManagerOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isCreatorOpen, isDropManagerOpen]);

  useEffect(() => {
    const unsubscribeProducts = listenToAllProducts((data) => {
      setProducts(data);
    });
    const unsubscribeDrops = listenToDropContainers((data) => {
      setDropContainers(data);
    });
    return () => {
      unsubscribeProducts();
      unsubscribeDrops();
    };
  }, []);

  const showSnackbar = (message, type = 'success') => {
    setSnackbar({ message, type });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setPrice('');
    setStock('');
    setIsLimited(false);
    setCategory('HEAD');
    setAssignedDrop('');
    setGridImage(null);
    setGalleryImages(null);
    setFittingRoomImages(null);
    setExistingImages([]);
    setExistingFittingRoomUrls([]);
    setAssetsToDelete([]);
    setIsCreatorOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setIsLimited(product.isLimited || false);
    setCategory(product.category || 'HEAD');
    setAssignedDrop(product.dropName || '');
    setGridImage(null);
    setGalleryImages(null);
    setFittingRoomImages(null);
    setExistingImages(product.images || []);
    
    const fittingData = product.fittingRoomData;
    let fittingUrlsArray = [];
    if (fittingData) {
      if (Array.isArray(fittingData.urls)) {
        fittingUrlsArray = fittingData.urls.map(u => typeof u === 'string' ? { url: u, layer: fittingData.layer || product.category || 'HEAD' } : u);
      } else if (fittingData.url) {
        fittingUrlsArray = [{ url: fittingData.url, layer: fittingData.layer || product.category || 'HEAD' }];
      }
    }
    setExistingFittingRoomUrls(fittingUrlsArray);
    setAssetsToDelete([]);
    setIsCreatorOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      showSnackbar('Missing required fields', 'error');
      return;
    }
    if (!editingId && !gridImage) {
      showSnackbar('Primary image required for new product', 'error');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload assets if changed
      let gridUrl = existingImages[0] || null;
      if (gridImage) {
        gridUrl = await uploadAdminAsset(gridImage, `products/${Date.now()}_${gridImage.name}`);
      }
      
      let finalImages = [...existingImages];
      if (gridImage) {
         if (existingImages[0]) {
           setAssetsToDelete(prev => [...prev, existingImages[0]]);
         }
         finalImages[0] = gridUrl; // replace primary
      }
      
      if (galleryImages && galleryImages.length > 0) {
        // Simple approach: append new gallery images or replace? Let's append up to 5 total, or just replace for simplicity.
        // For robust admin, replacing is easier to manage without a full gallery manager UI.
        const newGalleryUrls = [];
        for (let i = 0; i < galleryImages.length; i++) {
          if (i >= 5) break;
          const file = galleryImages[i];
          const url = await uploadAdminAsset(file, `products/gallery/${Date.now()}_${file.name}`);
          newGalleryUrls.push(url);
        }
        finalImages = [finalImages[0], ...newGalleryUrls]; // keep primary, replace gallery
      }

      let finalFittingUrls = [...existingFittingRoomUrls];
      if (fittingRoomImages && fittingRoomImages.length > 0) {
        const newFittingUrls = [];
        for (let i = 0; i < fittingRoomImages.length; i++) {
          if (i >= 5) break;
          const { file, layer } = fittingRoomImages[i];
          const url = await uploadAdminAsset(file, `fitting_room/${Date.now()}_${file.name}`);
          newFittingUrls.push({ url, layer });
        }
        finalFittingUrls = newFittingUrls;
      }

      // 2. Prepare data
      const productData = {
        name,
        price: Number(price),
        stock: Number(stock) || 0,
        isLimited,
        images: finalImages,
        category,
        dropName: assignedDrop || null,
        fittingRoomData: finalFittingUrls.length > 0 ? { urls: finalFittingUrls } : null
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        showSnackbar(`Updated ${name} successfully`);
      } else {
        productData.status = 'draft'; // new products default to draft
        await createProduct(productData);
        showSnackbar(`Created ${name} successfully`);
      }

      setIsCreatorOpen(false);
      
      // Clean up deleted assets
      for (const url of assetsToDelete) {
        if (url) await deleteAdminAsset(url);
      }
      setAssetsToDelete([]);
    } catch (error) {
      console.error(error);
      showSnackbar(`Error saving product: ${error.message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      try {
        const product = products.find(p => p.id === productId);
        if (product) {
          if (product.images) {
            for (const img of product.images) {
              if (img) await deleteAdminAsset(img);
            }
          }
          if (product.fittingRoomData && product.fittingRoomData.urls) {
             for (const item of product.fittingRoomData.urls) {
               if (item.url) await deleteAdminAsset(item.url);
             }
          }
        }
        await deleteProduct(productId);
        showSnackbar(`Deleted ${productName}`);
      } catch (error) {
        console.error(error);
        showSnackbar('Error deleting product', 'error');
      }
    }
  };

  const toggleStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    try {
      await updateProductStatus(product.id, newStatus);
      showSnackbar(`${product.name} is now ${newStatus}`);
    } catch (error) {
       showSnackbar('Error toggling status', 'error');
    }
  };

  // Drop Manager Functions
  const handleCreateDrop = async (e) => {
    e.preventDefault();
    if (!newDropName.trim()) return;
    try {
      await createDropContainer(newDropName.trim());
      setNewDropName('');
      showSnackbar(`Drop Container created`);
    } catch (error) {
      showSnackbar('Error creating Drop Container', 'error');
    }
  };

  
  const handleUpdateDropStatus = async (dropId, newStatus) => {
    try {
      await updateDropContainerStatus(dropId, newStatus);
      showSnackbar('Drop status updated');
    } catch (error) {
      showSnackbar('Error updating drop status', 'error');
    }
  };

  const handleDeleteDrop = async (dropId) => {
    if (window.confirm('Delete this drop container? Products will not be deleted.')) {
      try {
        await deleteDropContainer(dropId);
        showSnackbar('Drop Container deleted');
      } catch (error) {
        showSnackbar('Error deleting Drop Container', 'error');
      }
    }
  };

  const getStockPip = (stockCount) => {
    if (stockCount > 10) return 'green';
    if (stockCount > 0) return 'orange';
    return 'red';
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (filterDrop === 'ALL') return true;
    if (filterDrop === 'UNASSIGNED') return !p.dropName;
    return p.dropName === filterDrop;
  });

  return (
    <div className="admin-view relative">
      <AdminSnackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar({message:'', type:''})} />

      <div className="workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>[ PRODUCT_VAULT ]</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="admin-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: '1px solid #FF5C00', color: '#FF5C00' }} onClick={() => setIsDropManagerOpen(true)}>
            <Layers size={16} /> MANAGE_DROPS
          </button>
          <button className="admin-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={openCreateModal}>
            <Plus size={16} /> NEW_ASSET
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>FILTER_BY_DROP:</label>
          <select className="admin-input" style={{ width: 'auto', padding: '8px', fontSize: '0.8rem' }} value={filterDrop} onChange={e => setFilterDrop(e.target.value)}>
            <option value="ALL">ALL_ITEMS</option>
            <option value="UNASSIGNED">UNASSIGNED</option>
            {dropContainers.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
        <div style={{ color: '#888', fontSize: '0.8rem' }}>
          SHOWING: {filteredProducts.length} ITEMS
        </div>
      </div>

      <div className="vault-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>STATUS</th>
              <th>STOCK</th>
              <th>NAME</th>
              <th>PRICE (ZAR)</th>
              <th>DROP</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td style={{ width: '60px' }}>
                  <img src={p.images?.[0] || '/assets/placeholder.png'} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #1F1F1F' }} />
                </td>
                <td>
                  <span style={{ 
                    color: p.status === 'active' ? '#4CAF50' : '#888',
                    border: `1px solid ${p.status === 'active' ? '#4CAF50' : '#1F1F1F'}`,
                    padding: '2px 6px',
                    fontSize: '0.65rem'
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={`pip ${getStockPip(p.stock)}`}></span>
                    {p.stock}
                  </div>
                </td>
                <td>{p.name} {p.isLimited && <span style={{ color: '#FF5C00', fontSize: '0.6rem', marginLeft: '5px' }}>[LTD]</span>}</td>
                <td>{p.price}</td>
                <td style={{ color: '#888', fontSize: '0.8rem' }}>{p.dropName || '---'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => toggleStatus(p)}
                    style={{ background: 'transparent', border: '1px solid #1F1F1F', color: '#FFF', padding: '5px 10px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.65rem', marginRight: '10px' }}>
                    TOGGLE
                  </button>
                  <button className="action-btn" onClick={() => openEditModal(p)} title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDeleteProduct(p.id, p.name)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: '#888', padding: '40px' }}>NO_ITEMS_FOUND</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Creator/Editor Modal Overlay */}
      {isCreatorOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(5,5,5,0.9)', zIndex: 2000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="admin-modal-content" style={{
            backgroundColor: '#0A0A0A', border: '1px solid #FF5C00', padding: '30px', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FF5C00' }}>{editingId ? 'ASSET_PIPELINE // UPDATE' : 'ASSET_PIPELINE // UPLOAD'}</h3>
              <button onClick={() => setIsCreatorOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="admin-form-group">
                <label>PRODUCT_NAME</label>
                <input className="admin-input" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. SILICON_MELT_HOODIE" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label>PRICE (ZAR)</label>
                  <input type="number" className="admin-input" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="admin-form-group">
                  <label>STOCK_LEVEL</label>
                  <input type="number" className="admin-input" value={stock} onChange={e => setStock(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group">
                  <label>LAYER_CATEGORY</label>
                  <select className="admin-input" value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="HEAD">HEAD</option>
                    <option value="OUTERWEAR">OUTERWEAR</option>
                    <option value="TORSO">TORSO</option>
                    <option value="LEGS">LEGS</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>ASSIGN_TO_DROP</label>
                  <select className="admin-input" value={assignedDrop} onChange={e => setAssignedDrop(e.target.value)}>
                    <option value="">-- UNASSIGNED --</option>
                    {dropContainers.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                <input type="checkbox" id="ltd" checked={isLimited} onChange={e => setIsLimited(e.target.checked)} style={{ marginRight: '10px' }} />
                <label htmlFor="ltd" style={{ margin: 0, color: '#FF5C00' }}>LIMITED_EDITION</label>
              </div>

              <div className="admin-form-group" style={{ marginTop: '15px' }}>
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px dashed #333', padding: '30px 20px', textAlign: 'center',
                  backgroundColor: '#050505', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative',
                  color: '#888'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C00'; e.currentTarget.style.color = '#FF5C00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
                >
                  <UploadCloud size={28} style={{ marginBottom: '10px', color: 'inherit' }} />
                  <span style={{ color: '#FFF', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>PRIMARY_GRID_ASSET (WEBP/PNG)</span>
                  <span style={{ fontSize: '0.7rem' }}>{gridImage ? `SELECTED: ${gridImage.name}` : 'CLICK TO BROWSE FILES'}</span>
                  
                  {existingImages.length > 0 && !gridImage && (
                    <span style={{ fontSize: '0.7rem', color: '#4CAF50', marginTop: '8px' }}>Current file: {existingImages[0].split('/').pop().substring(0,20)}...</span>
                  )}
                  
                  <input type="file" onChange={e => setGridImage(e.target.files[0])} required={!editingId} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                </label>
              </div>

              <div className="admin-form-group" style={{ marginTop: '15px' }}>
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px dashed #333', padding: '30px 20px', textAlign: 'center',
                  backgroundColor: '#050505', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative',
                  color: '#888'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C00'; e.currentTarget.style.color = '#FF5C00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
                >
                  <UploadCloud size={28} style={{ marginBottom: '10px', color: 'inherit' }} />
                  <span style={{ color: '#FFF', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>GALLERY_ASSETS (UP TO 5)</span>
                  <span style={{ fontSize: '0.7rem' }}>CLICK TO BROWSE OR HOLD SHIFT/CMD FOR MULTIPLE</span>
                  
                                  {existingImages.length > 1 && (!galleryImages || galleryImages.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', textAlign: 'left' }}>
                    {existingImages.slice(1).map((url, idx) => {
                      const actualIndex = idx + 1;
                      return (
                        <div key={`exist-gal-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px', color: '#4CAF50' }}>{url.split('/').pop().split('?')[0].substring(0,20)}...</span>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button type="button" onClick={() => moveExistingGalleryImage(actualIndex, -1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronLeft size={14}/></button>
                            <button type="button" onClick={() => moveExistingGalleryImage(actualIndex, 1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronRight size={14}/></button>
                            <button type="button" onClick={() => removeExistingGalleryImage(actualIndex)} style={{ background: 'none', border: 'none', color: '#FF5C00', cursor: 'pointer', marginLeft: '5px' }}><X size={14}/></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                  
                  <input type="file" multiple accept="image/*" onChange={handleGallerySelect} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                </label>

                                {galleryImages && galleryImages.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', textAlign: 'left' }}>
                    {Array.from(galleryImages).map((file, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px', color: '#AAA' }}>{file.name}</span>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button type="button" onClick={() => moveGalleryImage(index, -1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronLeft size={14}/></button>
                          <button type="button" onClick={() => moveGalleryImage(index, 1)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}><ChevronRight size={14}/></button>
                          <button type="button" onClick={() => removeGalleryImage(index)} style={{ background: 'none', border: 'none', color: '#FF5C00', cursor: 'pointer', marginLeft: '5px' }}><X size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-form-group" style={{ marginTop: '15px' }}>
                <label style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  border: '1px dashed #333', padding: '30px 20px', textAlign: 'center',
                  backgroundColor: '#050505', cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative',
                  color: '#888'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5C00'; e.currentTarget.style.color = '#FF5C00'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#888'; }}
                >
                  <UploadCloud size={28} style={{ marginBottom: '10px', color: 'inherit' }} />
                  <span style={{ color: '#FFF', fontSize: '0.85rem', marginBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>FITTING_ROOM_ASSETS (UP TO 5)</span>
                  <span style={{ fontSize: '0.7rem' }}>CLICK TO BROWSE OR HOLD SHIFT/CMD FOR MULTIPLE</span>
                  
                  {existingFittingRoomUrls.length > 0 && (!fittingRoomImages || fittingRoomImages.length === 0) && (
                    <span style={{ fontSize: '0.7rem', color: '#4CAF50', marginTop: '8px' }}>{existingFittingRoomUrls.length} existing fitting room files attached.</span>
                  )}
                  
                  <input type="file" multiple accept="image/*" onChange={handleFittingRoomSelect} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                </label>

                {/* Existing assets list */}
                {existingFittingRoomUrls.length > 0 && (!fittingRoomImages || fittingRoomImages.length === 0) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', textAlign: 'left' }}>
                    {existingFittingRoomUrls.map((item, index) => (
                      <div key={`exist-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px', color: '#4CAF50' }} title={item.url}>{item.url.split('/').pop().split('?')[0].substring(0,20)}...</span>
                        
                        <select className="admin-input" value={item.layer} onChange={e => updateExistingFittingRoomLayer(index, e.target.value)} style={{ width: '100px', padding: '4px', fontSize: '0.7rem', border: '1px solid #333', marginLeft: 'auto' }}>
                          <option value="HEAD">HEAD</option>
                          <option value="OUTERWEAR">OUTERWEAR</option>
                          <option value="TORSO">TORSO</option>
                          <option value="LEGS">LEGS</option>
                        </select>
                        
                        <button type="button" onClick={() => removeExistingFittingRoomUrl(index)} style={{ background: 'none', border: 'none', color: '#FF5C00', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s', marginLeft: '10px' }} onMouseEnter={e=>e.currentTarget.style.color='#FFF'} onMouseLeave={e=>e.currentTarget.style.color='#FF5C00'} title="Remove asset">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New uploaded assets list */}
                {fittingRoomImages && fittingRoomImages.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', textAlign: 'left' }}>
                    {Array.from(fittingRoomImages).map((item, index) => (
                      <div key={`new-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem', color: '#FFF' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px', color: '#AAA' }}>{item.file.name}</span>
                        
                        <select className="admin-input" value={item.layer} onChange={e => updateFittingRoomImageLayer(index, e.target.value)} style={{ width: '100px', padding: '4px', fontSize: '0.7rem', border: '1px solid #333', marginLeft: 'auto' }}>
                          <option value="HEAD">HEAD</option>
                          <option value="OUTERWEAR">OUTERWEAR</option>
                          <option value="TORSO">TORSO</option>
                          <option value="LEGS">LEGS</option>
                        </select>

                        <button type="button" onClick={() => removeFittingRoomImage(index)} style={{ background: 'none', border: 'none', color: '#FF5C00', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s', marginLeft: '10px' }} onMouseEnter={e=>e.currentTarget.style.color='#FFF'} onMouseLeave={e=>e.currentTarget.style.color='#FF5C00'} title="Remove asset">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="admin-btn" style={{ width: '100%', marginTop: '20px' }} disabled={uploading}>
                {uploading ? 'PROCESSING...' : (editingId ? 'SAVE_CHANGES' : 'DEPLOY_TO_VAULT')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Drops Management Modal */}
      {isDropManagerOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(5,5,5,0.9)', zIndex: 2000, 
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div className="admin-modal-content drop-manager-modal" style={{
            backgroundColor: '#0A0A0A', border: '1px solid #1F1F1F', padding: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1F1F1F', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#FFF' }}>MANAGE_DROP_CONTAINERS</h3>
              <button onClick={() => setIsDropManagerOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateDrop} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input 
                className="admin-input" 
                value={newDropName} 
                onChange={e => setNewDropName(e.target.value)} 
                placeholder="New Drop Name (e.g. Drop_002)" 
                required 
              />
              <button type="submit" className="admin-btn" style={{ whiteSpace: 'nowrap' }}>CREATE</button>
            </form>

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #1F1F1F' }}>
              {dropContainers.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>NO_DROPS_CONFIGURED</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {dropContainers.map(d => (
                      <tr key={d.id} style={{ borderBottom: '1px solid #1F1F1F' }}>
                        <td style={{ padding: '12px 15px', color: '#FFF', fontSize: '0.85rem' }}>{d.name}</td>
                        <td style={{ padding: '12px 15px' }}>
                          <select 
                            className="admin-input" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem', margin: 0, width: 'auto' }}
                            value={d.status || 'draft'}
                            onChange={e => handleUpdateDropStatus(d.id, e.target.value)}
                          >
                            <option value="draft">DRAFT</option>
                            <option value="upcoming">UPCOMING</option>
                            <option value="active">ACTIVE</option>
                            <option value="archived">ARCHIVED</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                           <button className="action-btn delete" onClick={() => handleDeleteDrop(d.id)} title="Delete Drop">
                              <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductVault;
