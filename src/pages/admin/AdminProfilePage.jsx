import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, changeUserPassword } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { ShieldCheck, Lock, User } from 'lucide-react';

export const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      toast.success('Admin profile updated!');
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await dispatch(changeUserPassword(passwordData)).unwrap();
      toast.success('Admin password updated!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err || 'Failed to change password');
    }
  };

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Profile Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage administrator account credentials</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Edit */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--accent-primary)" /> Personal Details
          </h3>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="input-field" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="input-field" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
            </div>
            <button type="submit" className="btn-gradient" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>Save Profile</button>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={18} color="var(--warning)" /> Change Password
          </h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" required className="input-field" value={passwordData.old_password} onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" required className="input-field" value={passwordData.new_password} onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" required className="input-field" value={passwordData.confirm_password} onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })} />
            </div>
            <button type="submit" className="btn-gradient" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};
