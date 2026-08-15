import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react';

import { fetchProducts, setFilter } from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchBrands } from '../../redux/slices/brandSlice';
import { ProductCard } from '../../components/customer/ProductCard';

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { brands } = useSelector((state) => state.brands);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);
  const latestProducts = products.slice(0, 8);

  const handleCategorySelect = (catId) => {
    dispatch(setFilter({ category: catId.toString() }));
    navigate('/products');
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ position: 'relative', padding: '3.5rem 0 2.5rem', overflow: 'hidden' }}>
        <div className="container">
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.15) 100%)',
            border: '1px solid var(--border-color)',
            padding: '3.5rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
            boxShadow: 'var(--card-shadow)'
          }}>
            <div style={{ zIndex: 2 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'var(--accent-primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '1.25rem'
              }}>
                <Zap size={14} color="#f59e0b" />
                <span>BHARATMART TECH FESTIVAL 2026</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
                Next-Gen Tech & Premium <span className="gradient-text">Lifestyle Essentials.</span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '520px' }}>
                Explore authentic iPhones, MacBooks, Sony audio, and Nike techwear with real-world Indian prices (₹).
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn-gradient">
                  <span>Shop Catalog</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="#featured" className="btn-secondary">
                  Featured Items
                </a>
              </div>
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                maxHeight: '320px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                position: 'relative'
              }}>
                <img
                  src="https://django-ecommerce-backend-7jue.onrender.com/media/products/sony_wh1000xm5.jpg"
                  alt="Sony WH-1000XM5"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'; }}
                  style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>Spotlight Item</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0' }}>Sony Wireless Noise-Canceling Headphones</h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>₹29,990.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.25rem' }}>Top Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="glass"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Sparkles size={22} />
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cat.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Products</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Featured Products</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Handpicked flagship technology & apparel</p>
            </div>
            <Link to="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
