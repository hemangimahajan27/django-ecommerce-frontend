import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { formatINR } from '../../utils/formatters';
import { Package, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { myOrders: orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <section style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Orders</h1>

        {loading ? (
          <div className="glass skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="glass"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Order #{order.id}</span>
                    <span className={`badge ${order.order_status === 'Delivered' ? 'badge-success' : 'badge-primary'}`}>
                      {order.order_status}
                    </span>
                    <span className="badge badge-success">{order.payment_status}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Ship to: <strong>{order.full_name}</strong> ({order.city}, {order.state})
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatINR(order.total_amount)}</span>
                  </div>

                  <Link to={`/orders/${order.id}`} className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}>
                    <span>Details</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3>No Orders Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn-gradient">Start Shopping</Link>
          </div>
        )}
      </div>
    </section>
  );
};
