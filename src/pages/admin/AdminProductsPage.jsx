import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { fetchAdminCategories } from '../../redux/slices/categorySlice';
import { fetchBrands } from '../../redux/slices/brandSlice';
import { formatINR } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Search, Check, X, Star } from 'lucide-react';

export const AdminProductsPage = () => {
  const dispatch = useDispatch();
  const { adminProducts: products, loading } = useSelector((state) => state.products);
  const { adminCategories: categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
    is_featured: false,
    is_active: true,
    image: null,
  });

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: brands[0]?.id || '',
      category: categories[0]?.id || '',
      description: '',
      price: '',
      stock: '10',
      sku: `SKU-${Date.now().toString().slice(-6)}`,
      is_featured: false,
      is_active: true,
      image: null,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      brand: p.brand || p.brand_details?.id || '',
      category: p.category || p.category_details?.id || '',
      description: p.description,
      price: p.price,
      stock: p.stock,
      sku: p.sku,
      is_featured: p.is_featured,
      is_active: p.is_active,
      image: null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error(err || 'Failed to delete product');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('sku', formData.sku);
    data.append('is_featured', formData.is_featured);
    data.append('is_active', formData.is_active);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, formData: data })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created successfully!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err || 'Failed to save product.');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Product Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage products, prices, stock, and visibility</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-gradient">
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '380px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          className="input-field"
          style={{ paddingLeft: '2.5rem' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Image</th>
              <th style={{ padding: '1rem' }}>Name & SKU</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Stock</th>
              <th style={{ padding: '1rem' }}>Featured</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <img
                    src={p.image ? (p.image.startsWith('http') ? p.image : `https://django-ecommerce-backend-7jue.onrender.com${p.image}`) : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                    alt={p.name}
                    style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontWeight: 700, display: 'block' }}>{p.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {p.sku}</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>{formatINR(p.price)}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {p.stock} in stock
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  {p.is_featured ? <Star size={18} color="#f59e0b" fill="#f59e0b" /> : <Star size={18} color="var(--text-muted)" />}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className={`badge ${p.is_active ? 'badge-primary' : 'badge-danger'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenEdit(p)} className="btn-secondary" style={{ padding: '0.4rem 0.6rem', marginRight: '0.5rem' }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '600px', borderRadius: 'var(--radius-lg)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Brand</label>
                  <select required className="input-field" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })}>
                    <option value="">Select Brand</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select required className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} required className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" step="0.01" required className="input-field" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" required className="input-field" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" required className="input-field" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <input type="file" accept="image/*" className="input-field" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />
                  <span>Featured Item</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                  <span>Active Status</span>
                </label>
              </div>

              <button type="submit" className="btn-gradient" style={{ width: '100%', padding: '0.85rem' }}>Save Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
