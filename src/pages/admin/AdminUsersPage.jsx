import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers, updateUserAdmin, deleteUserAdmin } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { Search, ShieldCheck, ShieldAlert, Trash2, UserCheck, UserX } from 'lucide-react';

export const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleToggleActive = async (u) => {
    try {
      await dispatch(updateUserAdmin({ id: u.id, userData: { is_active: !u.is_active } })).unwrap();
      toast.success(`User ${!u.is_active ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error(err || 'Failed to update user status');
    }
  };

  const handleToggleAdmin = async (u) => {
    if (u.id === currentUser?.id) {
      toast.error('You cannot modify your own admin privileges');
      return;
    }
    try {
      await dispatch(updateUserAdmin({ id: u.id, userData: { is_admin: !u.is_admin } })).unwrap();
      toast.success(`Admin status updated for ${u.email}`);
    } catch (err) {
      toast.error(err || 'Failed to update admin role');
    }
  };

  const handleDelete = async (u) => {
    if (u.id === currentUser?.id) {
      toast.error('You cannot delete your own admin account');
      return;
    }
    if (window.confirm(`Delete user ${u.email}?`)) {
      try {
        await dispatch(deleteUserAdmin(u.id)).unwrap();
        toast.success('User deleted');
      } catch (err) {
        toast.error(err || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin User Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View, activate, deactivate, or grant admin permissions</p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '380px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search user name or email..."
          className="input-field"
          style={{ paddingLeft: '2.5rem' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>User Info</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>#{u.id}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontWeight: 700, display: 'block' }}>{u.name || 'No Name'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button
                    onClick={() => handleToggleAdmin(u)}
                    className={`badge ${u.is_admin ? 'badge-primary' : 'badge-secondary'}`}
                    style={{ cursor: u.id === currentUser?.id ? 'not-allowed' : 'pointer' }}
                  >
                    {u.is_admin ? 'Admin' : 'Customer'}
                  </button>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <button onClick={() => handleToggleActive(u)} className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`} style={{ cursor: 'pointer' }}>
                    {u.is_active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  {u.id !== currentUser?.id && (
                    <button onClick={() => handleDelete(u)} style={{ padding: '0.4rem 0.6rem', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
