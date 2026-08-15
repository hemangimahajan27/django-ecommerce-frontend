import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../redux/slices/orderSlice';
import { formatINR } from '../../utils/formatters';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';

export const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return (
      <div className="container" style={{ padding: '4rem 0' }}>
        <div className="glass skeleton" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  return (
    <section style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          Back to My Orders
        </Link>

        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order #{order.id}</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Placed on {new Date(order.created_at).toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-primary">{order.order_status}</span>
              <span className="badge badge-success">{order.payment_status}</span>
            </div>
          </div>

          {/* Shipping & Payment Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <MapPin size={16} color="var(--accent-primary)" /> Shipping Address
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong>{order.full_name}</strong><br />
                {order.address}<br />
                {order.city}, {order.state} - {order.pincode}<br />
                Phone: {order.phone}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <CreditCard size={16} color="var(--success)" /> Payment Details
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Status: <strong>{order.payment_status}</strong><br />
                Payment ID: {order.payment_id || 'N/A'}<br />
                Razorpay ID: {order.razorpay_order_id || 'N/A'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Ordered Items</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Package size={20} color="var(--accent-primary)" />
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.product_details?.name || 'Product'}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} x {formatINR(item.price)}</span>
                  </div>
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{formatINR(parseFloat(item.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '1.25rem', fontWeight: 800 }}>
            <span>Total Paid</span>
            <span>{formatINR(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
