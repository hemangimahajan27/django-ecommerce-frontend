import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { getProductImage } from '../../utils/productImages';
import {
  removeFromCart,
  updateQuantity,
  toggleCartDrawer,
} from '../../redux/slices/cartSlice';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, subtotal, isCartOpen } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isCartOpen) return null;

  const estimatedTax = subtotal * 0.18;
  const shippingFee = subtotal > 1499 || subtotal === 0 ? 0 : 149;
  const grandTotal = subtotal + estimatedTax + shippingFee;

  const handleProceedCheckout = () => {
    dispatch(toggleCartDrawer(false));
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
      {/* Backdrop */}
      <div
        onClick={() => dispatch(toggleCartDrawer(false))}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)'
        }}
      />

      {/* Slide-over Drawer */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '440px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.3)',
        zIndex: 151
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag color="var(--accent-primary)" size={22} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Your Shopping Cart</h3>
          </div>
          <button onClick={() => dispatch(toggleCartDrawer(false))} style={{ color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          {cartItems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.name}</h4>
                      <button onClick={() => dispatch(removeFromCart(item.id))} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', margin: '0.25rem 0' }}>
                      {formatINR(item.price)}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))} style={{ padding: '0.2rem 0.6rem', fontWeight: 700 }}>-</button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))} style={{ padding: '0.2rem 0.6rem', fontWeight: 700 }}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: 800 }}>Your cart is empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem' }}>Add tech & apparel products to get started.</p>
            </div>
          )}
        </div>

        {/* Footer & Checkout Trigger */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST (18%)</span>
                <span>{formatINR(estimatedTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : formatINR(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span>Grand Total</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button onClick={handleProceedCheckout} className="btn-gradient" style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
