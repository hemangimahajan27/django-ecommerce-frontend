import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Search, Sun, Moon, ShieldCheck, LogOut, PlusCircle, ShoppingCart, User, Package } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { setFilter } from '../../redux/slices/productSlice';
import { toggleCartDrawer as openCart } from '../../redux/slices/cartSlice';

export const Navbar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const [keyword, setKeyword] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      dispatch(setFilter({ search: keyword }));
      navigate('/products');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      backgroundColor: 'var(--bg-glass)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '1.5rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000080',
            boxShadow: '0 4px 14px rgba(255, 153, 51, 0.3)'
          }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)'
            }}>
              BHARAT<span style={{ color: '#ff9933' }}>MART</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}>
              India's Tech & Lifestyle Hub
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} style={{
          flex: 1,
          maxWidth: '480px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }} />
          <input
            type="text"
            placeholder="Search iPhone, MacBook, Sony, Nike, Razer..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
          />
        </form>

        {/* Navigation & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/products" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Products
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
          </button>

          {/* Admin Panel Link if Admin */}
          {isAdmin && (
            <Link to="/admin" className="btn-gradient" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
              <PlusCircle size={17} />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => dispatch(openCart(true))}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <ShoppingBag size={20} />
            {totalQuantity > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ff9933',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255, 153, 51, 0.5)',
                border: '2px solid var(--bg-secondary)'
              }}>
                {totalQuantity}
              </span>
            )}
          </button>

          {/* Auth Controls */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#ff9933',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user?.name || 'Account'}</span>
                {isAdmin && <ShieldCheck size={16} color="var(--success)" />}
              </button>

              {showUserDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '210px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--modal-shadow)',
                  padding: '0.5rem',
                  zIndex: 110
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <Package size={16} />
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--danger)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-gradient" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
