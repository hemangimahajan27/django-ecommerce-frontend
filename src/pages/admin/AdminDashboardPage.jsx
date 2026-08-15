import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts } from '../../redux/slices/productSlice';
import { fetchAdminCategories } from '../../redux/slices/categorySlice';
import { fetchBrands } from '../../redux/slices/brandSlice';
import { fetchAdminUsers } from '../../redux/slices/userSlice';
import { fetchAdminOrders } from '../../redux/slices/orderSlice';
import { formatINR } from '../../utils/formatters';

import {
  Package,
  Layers,
  Tag,
  Users,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  const { adminProducts } = useSelector((state) => state.products);
  const { adminCategories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);
  const { users } = useSelector((state) => state.users);
  const { adminOrders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminCategories());
    dispatch(fetchBrands());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const totalRevenue = adminOrders.reduce(
    (sum, o) => (o.payment_status === 'Paid' ? sum + parseFloat(o.total_amount || 0) : sum),
    0
  );

  const stats = [
    { label: 'Total Revenue', value: formatINR(totalRevenue), icon: TrendingUp, color: 'var(--success)', path: '/admin/orders' },
    { label: 'Total Orders', value: adminOrders.length, icon: ShoppingBag, color: 'var(--accent-primary)', path: '/admin/orders' },
    { label: 'Total Products', value: adminProducts.length, icon: Package, color: '#f59e0b', path: '/admin/products' },
    { label: 'Categories', value: adminCategories.length, icon: Layers, color: '#ec4899', path: '/admin/categories' },
    { label: 'Brands', value: brands.length, icon: Tag, color: '#10b981', path: '/admin/brands' },
    { label: 'Registered Users', value: users.length, icon: Users, color: '#6366f1', path: '/admin/users' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Dashboard Statistics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time metrics synced from Django REST Framework backend</p>
      </div>

      {/* Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} to={stat.path} className="glass hover-bg" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>{stat.label}</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--bg-tertiary)', color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} />
                </div>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</span>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Preview Table */}
      <div className="glass" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Customer Orders</h3>
          <Link to="/admin/orders" className="btn-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
            Manage Orders
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Order ID</th>
                <th style={{ padding: '0.75rem' }}>Customer</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Payment</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders.slice(0, 5).map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>#{order.id}</td>
                  <td style={{ padding: '0.75rem' }}>{order.full_name} ({order.user_email})</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{formatINR(order.total_amount)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${order.payment_status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-primary">{order.order_status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
