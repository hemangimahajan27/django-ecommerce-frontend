import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { getProductImage } from '../../utils/productImages';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`Added "${product.name}" to cart!`);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="glass hover-card"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
        <img
          src={getProductImage(product)}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'; }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />

        {/* Badges Overlay */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.4rem' }}>
          {isOutOfStock ? (
            <span className="badge badge-danger">Out of Stock</span>
          ) : (
            <span className="badge badge-success">In Stock</span>
          )}
          {product.is_featured && <span className="badge badge-primary">Featured</span>}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            SKU: {product.sku || 'N/A'}
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.35rem 0 0.5rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>
            <Link to={`/products/${product.id}`} style={{ color: 'inherit' }}>
              {product.name}
            </Link>
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.825rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            {product.description}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatINR(product.price)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn-gradient"
              style={{ padding: '0.6rem 0.85rem', fontSize: '0.85rem', opacity: isOutOfStock ? 0.5 : 1 }}
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </button>
            <Link
              to={`/products/${product.id}`}
              className="btn-secondary"
              style={{ padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="View Product Details"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
