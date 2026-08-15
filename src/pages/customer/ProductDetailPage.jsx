import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatINR } from '../../utils/formatters';
import { ProductCard } from '../../components/customer/ProductCard';
import { ShoppingBag, Tag, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentProduct: product, products, loading } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProducts());
  }, [dispatch, id]);

  if (loading || !product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass skeleton" style={{ height: '400px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    );
  }

  const getProductImage = () => {
    if (product.image) {
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) return product.image;
      return `https://django-ecommerce-backend-7jue.onrender.com${product.image.startsWith('/') ? '' : '/'}${product.image}`;
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
  };

  const isOutOfStock = product.stock <= 0;
  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity}x "${product.name}" to cart!`);
  };

  return (
    <section style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        {/* Product Details Grid */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Image Container */}
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-tertiary)', height: '380px' }}>
            <img
              src={getProductImage()}
              alt={product.name}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'; }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}`}>
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} Available`}
                </span>
                {product.is_featured && <span className="badge badge-primary">Featured Item</span>}
              </div>

              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.5rem' }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <Tag size={14} />
                <span>SKU: {product.sku || 'N/A'}</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Selling Price</span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatINR(product.price)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.4rem 0.8rem', fontSize: '1rem', fontWeight: 700 }}>-</button>
                  <span style={{ padding: '0 0.8rem', fontWeight: 700 }}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} style={{ padding: '0.4rem 0.8rem', fontSize: '1rem', fontWeight: 700 }}>+</button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="btn-gradient"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', opacity: isOutOfStock ? 0.5 : 1 }}
              >
                <ShoppingBag size={20} />
                <span>Add to Cart - {formatINR(parseFloat(product.price || 0) * quantity)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>Related Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
