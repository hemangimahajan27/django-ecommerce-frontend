import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminOrders, updateOrderStatusAdmin } from '../../redux/slices/orderSlice';
import { formatINR } from '../../utils/formatters';
import { toast } from 'react-toastify';
import { Search, ShoppingBag, Eye } from 'lucide-react';

export const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { adminOrders: orders, loading } = useSelector((state) => state.orders);

  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, order_status, payment_status) => {
    try {
      await dispatch(updateOrderStatusAdmin({ id: orderId, order_status, payment_status })).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toString().includes(search) ||
      o.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.user_email && o.user_email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Order Management</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fulfill orders, track shipping, and manage payments</p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1.5rem', maxWidth: '380px', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search order #, customer or email..."
          className="input-field"
          style={{ paddingLeft: '2.5rem' }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>Order ID</th>
              <th style={{ padding: '1rem' }}>Customer Details</th>
              <th style={{ padding: '1rem' }}>Total Amount</th>
              <th style={{ padding: '1rem' }}>Payment Status</th>
              <th style={{ padding: '1rem' }}>Order Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Items</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>#{o.id}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontWeight: 700, display: 'block' }}>{o.full_name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.city}, {o.state} • {o.phone}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>{formatINR(o.total_amount)}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <select
                    value={o.payment_status}
                    onChange={(e) => handleStatusChange(o.id, o.order_status, e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <select
                    value={o.order_status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value, o.payment_status)}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <button onClick={() => setSelectedOrder(o)} className="btn-secondary" style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}>
                    <Eye size={14} />
                    View ({o.items?.length || 0})
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Order Details View */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '550px', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Order #{selectedOrder.id} Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {selectedOrder.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.product_details?.name || 'Product'}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} x {formatINR(item.price)}</span>
                  </div>
                  <span style={{ fontWeight: 800 }}>{formatINR(parseFloat(item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedOrder(null)} className="btn-gradient" style={{ width: '100%', padding: '0.75rem' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
