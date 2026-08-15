import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../../redux/slices/brandSlice';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminBrandsPage = () => {
  const dispatch = useDispatch();
  const { brands } = useSelector((state) => state.brands);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true });

  useEffect(() => {
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', is_active: true });
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b.id);
    setFormData({ name: b.name, description: b.description || '', is_active: b.is_active });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete brand?')) {
      try {
        await dispatch(deleteBrand(id)).unwrap();
        toast.success('Brand deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete brand');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('is_active', formData.is_active);

    try {
      if (editingId) {
        await dispatch(updateBrand({ id: editingId, formData: data })).unwrap();
        toast.success('Brand updated');
      } else {
        await dispatch(createBrand(data)).unwrap();
        toast.success('Brand created');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err || 'Operation failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Brands</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage manufacturer and product brand partners</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-gradient">
          <Plus size={18} />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Brand Name</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>#{b.id}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{b.name}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{b.description || 'N/A'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className={`badge ${b.is_active ? 'badge-primary' : 'badge-danger'}`}>{b.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenEdit(b)} className="btn-secondary" style={{ padding: '0.4rem 0.6rem', marginRight: '0.5rem' }}><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(b.id)} style={{ padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '450px', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>{editingId ? 'Edit Brand' : 'Add Brand'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Brand Name</label>
                <input type="text" required className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                <span>Active Status</span>
              </label>
              <button type="submit" className="btn-gradient" style={{ width: '100%', padding: '0.85rem' }}>Save Brand</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
