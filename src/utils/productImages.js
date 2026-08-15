const PRODUCT_IMAGE_MAP = {
  'MOB-AAPL-15PM': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', // iPhone 15 Pro Max
  'LAP-APX-M3U': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', // MacBook Pro 16
  'MOB-NOVA-FOLD': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', // Galaxy Z Fold 5
  'WR-NOVA-WPRO': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', // Galaxy Watch 6
  'AUD-SONY-XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', // Sony Headphones
  'AUD-SONY-BUDS': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', // Sony Earbuds
  'AUD-SONY-BAR': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', // Sony Soundbar
  'GAM-HYP-KB75': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', // Razer Keyboard
  'GAM-HYP-MS01': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', // Razer Mouse
  'WR-APX-VR01': 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?w=800&q=80', // Meta Quest 3 VR
  'CLO-AERO-SNK': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', // Nike Shoes
  'CLO-AERO-JKT': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', // Arc'teryx Jacket
};

export const getProductImage = (product) => {
  if (!product) return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';

  // 1. Direct SKU match
  if (product.sku && PRODUCT_IMAGE_MAP[product.sku]) {
    return PRODUCT_IMAGE_MAP[product.sku];
  }

  // 2. Direct full URL in DB image field
  if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
    return product.image;
  }

  // 3. Name-based match fallback
  const nameLower = (product.name || '').toLowerCase();
  if (nameLower.includes('iphone')) return PRODUCT_IMAGE_MAP['MOB-AAPL-15PM'];
  if (nameLower.includes('macbook')) return PRODUCT_IMAGE_MAP['LAP-APX-M3U'];
  if (nameLower.includes('fold')) return PRODUCT_IMAGE_MAP['MOB-NOVA-FOLD'];
  if (nameLower.includes('watch')) return PRODUCT_IMAGE_MAP['WR-NOVA-WPRO'];
  if (nameLower.includes('headphone') || nameLower.includes('wh-1000xm5')) return PRODUCT_IMAGE_MAP['AUD-SONY-XM5'];
  if (nameLower.includes('earbud') || nameLower.includes('buds')) return PRODUCT_IMAGE_MAP['AUD-SONY-BUDS'];
  if (nameLower.includes('soundbar') || nameLower.includes('cinema')) return PRODUCT_IMAGE_MAP['AUD-SONY-BAR'];
  if (nameLower.includes('keyboard')) return PRODUCT_IMAGE_MAP['GAM-HYP-KB75'];
  if (nameLower.includes('mouse')) return PRODUCT_IMAGE_MAP['GAM-HYP-MS01'];
  if (nameLower.includes('vr') || nameLower.includes('quest')) return PRODUCT_IMAGE_MAP['WR-APX-VR01'];
  if (nameLower.includes('shoe') || nameLower.includes('nike')) return PRODUCT_IMAGE_MAP['CLO-AERO-SNK'];
  if (nameLower.includes('jacket') || nameLower.includes('arc\'teryx')) return PRODUCT_IMAGE_MAP['CLO-AERO-JKT'];

  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
};
