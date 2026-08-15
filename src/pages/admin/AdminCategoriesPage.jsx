import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminCategories, createCategory, updateCategory, deleteCategory } from '../../redux/slices/categorySlice';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const { adminCategories: categories } = useSelector((state) => state.categories);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true, logo: null });

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', is_active: true, logo: null });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setFormData({ name: c.name, description: c.description || '', is_active: c.is_active, logo: null });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success('Category deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('is_active', formData.is_active);
    if (formData.logo) data.append('logo', formData.logo);

    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, formData: data })).unwrap();
        toast.success('Category updated');
      } else {
        await dispatch(createCategory(data)).unwrap();
        toast.success('Category created');
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage catalog product categories</p>
        </div>
        <button onClick={handleOpenAdd} className="btn-gradient">
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Category Name</th>
              <th style={{ padding: '1rem' }}>Description</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>#{c.id}</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{c.name}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{c.description || 'N/A'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className={`badge ${c.is_active ? 'badge-primary' : 'badge-danger'}`}>{c.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => handleOpenEdit(c)} className="btn-secondary" style={{ padding: '0.4rem 0.6rem', marginRight: '0.5rem' }}><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}><Trash2 size={14} /></button>
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
              <h3>{editingId ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
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
              <button type="submit" className="btn-gradient" style={{ width: '100%', padding: '0.85rem' }}>Save Category</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
