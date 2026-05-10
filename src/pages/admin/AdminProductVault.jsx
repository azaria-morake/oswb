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
  deleteDropContainer
} from '../../firebase/api';
import { UploadCloud, Plus, X, Pencil, Trash2, Layers } from 'lucide-react';
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
  const [fittingRoomImage, setFittingRoomImage] = useState(null);
  
  // Image State (Existing URLs for editing)
  const [existingImages, setExistingImages] = useState([]);
  const [existingFittingRoom, setExistingFittingRoom] = useState(null);

  // Drop Manager Form State
  const [newDropName, setNewDropName] = useState('');

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
    setFittingRoomImage(null);
    setExistingImages([]);
    setExistingFittingRoom(null);
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
    setFittingRoomImage(null);
    setExistingImages(product.images || []);
    setExistingFittingRoom(product.fittingRoomData?.url || null);
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
         finalImages[0] = gridUrl; // replace primary
      }
      
      if (galleryImages) {
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

      let fittingUrl = existingFittingRoom;
      if (fittingRoomImage) {
        fittingUrl = await uploadAdminAsset(fittingRoomImage, `fitting_room/${Date.now()}_${fittingRoomImage.name}`);
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
        fittingRoomData: fittingUrl ? { url: fittingUrl, layer: category } : null
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

              <div className="admin-form-group" style={{ border: '1px dashed #1F1F1F', padding: '20px', textAlign: 'center', marginTop: '15px' }}>
                <UploadCloud size={24} color="#888" style={{ margin: '0 auto 10px' }} />
                <label style={{ color: '#FFF' }}>PRIMARY_GRID_ASSET (WEBP/PNG)</label>
                {existingImages.length > 0 && !gridImage && (
                  <p style={{ fontSize: '0.7rem', color: '#4CAF50', margin: '5px 0' }}>Current file: {existingImages[0].split('/').pop().substring(0,20)}...</p>
                )}
                <input type="file" onChange={e => setGridImage(e.target.files[0])} required={!editingId} style={{ marginTop: '10px', color: '#888', width: '100%' }} />
              </div>

              <div className="admin-form-group" style={{ border: '1px dashed #1F1F1F', padding: '20px', textAlign: 'center', marginTop: '10px' }}>
                <UploadCloud size={24} color="#888" style={{ margin: '0 auto 10px' }} />
                <label style={{ color: '#FFF' }}>GALLERY_ASSETS (UP TO 5)</label>
                {existingImages.length > 1 && !galleryImages && (
                  <p style={{ fontSize: '0.7rem', color: '#4CAF50', margin: '5px 0' }}>{existingImages.length - 1} gallery files attached.</p>
                )}
                <input type="file" multiple accept="image/*" onChange={e => setGalleryImages(e.target.files)} style={{ marginTop: '10px', color: '#888', width: '100%' }} />
                <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>Hold Shift/Cmd to select multiple files. (Will replace existing)</p>
              </div>

              <div className="admin-form-group" style={{ border: '1px dashed #1F1F1F', padding: '20px', textAlign: 'center' }}>
                <UploadCloud size={24} color="#888" style={{ margin: '0 auto 10px' }} />
                <label style={{ color: '#FFF' }}>FITTING_ROOM_ASSET (TRANSPARENT PNG)</label>
                {existingFittingRoom && !fittingRoomImage && (
                   <p style={{ fontSize: '0.7rem', color: '#4CAF50', margin: '5px 0' }}>Fitting room asset attached.</p>
                )}
                <input type="file" onChange={e => setFittingRoomImage(e.target.files[0])} style={{ marginTop: '10px', color: '#888', width: '100%' }} />
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
