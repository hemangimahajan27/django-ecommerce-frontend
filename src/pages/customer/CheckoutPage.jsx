import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatINR } from '../../utils/formatters';
import { createOrder } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { RazorpayCheckout } from '../../components/customer/RazorpayCheckout';
import { ShieldCheck, MapPin, ShoppingBag } from 'lucide-react';

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, subtotal } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const estimatedTax = subtotal * 0.18;
  const shippingFee = subtotal > 1499 || subtotal === 0 ? 0 : 149;
  const grandTotal = subtotal + estimatedTax + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Please add products to your cart before proceeding to checkout.</p>
        <button onClick={() => navigate('/products')} className="btn-gradient">Browse Products</button>
      </div>
    );
  }

  const handleOrderSubmission = async (paymentDetails = {}) => {
    if (!formData.full_name || !formData.phone || !formData.address || !formData.pincode) {
      toast.error('Please complete all shipping address fields.');
      return;
    }

    const orderPayload = {
      ...formData,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      payment_status: paymentDetails.payment_status || 'Paid',
      payment_id: paymentDetails.payment_id || `PAY-DIRECT-${Date.now()}`,
      razorpay_order_id: paymentDetails.razorpay_order_id || `RZP-DIRECT-${Date.now()}`,
    };

    try {
      const actionResult = await dispatch(createOrder(orderPayload)).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${actionResult.id}`);
    } catch (err) {
      toast.error(err || 'Failed to place order.');
    }
  };

  return (
    <section style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout & Payment</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Address Form */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <MapPin color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Shipping & Delivery Address</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleOrderSubmission(); }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Rahul Sharma"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <textarea
                  required
                  rows={3}
                  className="input-field"
                  placeholder="Flat 402, Sunshine Apartments, MG Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <RazorpayCheckout
                  totalAmount={grandTotal}
                  orderDetails={{ ...formData, email: user?.email }}
                  onPaymentSuccess={(details) => handleOrderSubmission(details)}
                />
              </div>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Order Summary ({cartItems.length} items)
            </h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{item.name}</span>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Qty: {item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 800 }}>{formatINR(parseFloat(item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
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
                <span>{shippingFee === 0 ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span> : formatINR(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span>Total Amount</span>
                <span>{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
