import { api } from '../api/client';

export const seedSampleData = async () => {
  try {
    let currentBrands = [];
    let currentCategories = [];

    try {
      const bRes = await api.getBrands();
      currentBrands = bRes.brands || [];
    } catch (e) {
      console.log('No existing brands found');
    }

    try {
      const cRes = await api.getCategories();
      currentCategories = cRes.categories || [];
    } catch (e) {
      console.log('No existing categories found');
    }

    const sampleBrands = [
      { name: 'SonicPulse', description: 'High-fidelity audio systems and wireless acoustics.' },
      { name: 'Apex Tech', description: 'Flagship smartphones, computing, and ecosystem devices.' },
      { name: 'Nova Tech', description: 'Cutting-edge displays, wearables, and mobile tech.' },
      { name: 'HyperByte', description: 'Pro-grade gaming peripherals and ergonomic gear.' },
      { name: 'AeroWear', description: 'Modern urban techwear and high-performance apparel.' }
    ];

    const sampleCategories = [
      { name: 'Audio & Headphones', description: 'Noise-canceling headphones, earbuds, and speakers.' },
      { name: 'Smartphones & Tech', description: 'Flagship smartphones, tablets, and accessories.' },
      { name: 'Smartwatches & Wearables', description: 'Biometric fitness trackers and luxury smartwatches.' },
      { name: 'Gaming & Laptops', description: 'High-performance gaming laptops and mechanical keyboards.' },
      { name: 'Apparel & Fashion', description: 'Technical jackets, sportswear, and footwear.' }
    ];

    const brandMap = {};
    for (const b of sampleBrands) {
      const existing = currentBrands.find((cb) => cb.name.toLowerCase() === b.name.toLowerCase());
      if (existing) {
        brandMap[b.name] = existing.id;
      } else {
        const formData = new FormData();
        formData.append('name', b.name);
        formData.append('description', b.description);
        formData.append('is_active', 'true');
        try {
          const created = await api.createBrand(formData);
          if (created.brand) {
            brandMap[b.name] = created.brand.id;
          }
        } catch (err) {
          console.warn('Failed to seed brand:', b.name, err);
        }
      }
    }

    const catMap = {};
    for (const c of sampleCategories) {
      const existing = currentCategories.find((cc) => cc.name.toLowerCase() === c.name.toLowerCase());
      if (existing) {
        catMap[c.name] = existing.id;
      } else {
        const formData = new FormData();
        formData.append('name', c.name);
        formData.append('description', c.description);
        formData.append('is_active', 'true');
        try {
          const created = await api.createCategory(formData);
          if (created.category) {
            catMap[c.name] = created.category.id;
          }
        } catch (err) {
          console.warn('Failed to seed category:', c.name, err);
        }
      }
    }

    const sampleProducts = [
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        brand: brandMap['SonicPulse'] || 1,
        category: catMap['Audio & Headphones'] || 1,
        price: '29990.00',
        stock: 25,
        sku: 'AUD-SONY-XM5',
        description: 'Industry-leading noise canceling with two processors, 8 microphones, and up to 30 hours of battery life.',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      },
      {
        name: 'Apple iPhone 15 Pro Max Titanium',
        brand: brandMap['Apex Tech'] || 2,
        category: catMap['Smartphones & Tech'] || 2,
        price: '134900.00',
        stock: 18,
        sku: 'MOB-AAPL-15PM',
        description: 'Forged in titanium with A17 Pro chip, customizable Action button, and 5x Telephoto camera.',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80'
      },
      {
        name: 'Ultra AMOLED Smart Watch Pro',
        brand: brandMap['Nova Tech'] || 3,
        category: catMap['Smartwatches & Wearables'] || 3,
        price: '19999.00',
        stock: 40,
        sku: 'WR-NOVA-WPRO',
        description: 'Sapphire crystal display, ECG monitoring, dual-frequency GPS, and 7-day battery life.',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'
      },
      {
        name: 'HyperByte Mechanical RGB Keyboard',
        brand: brandMap['HyperByte'] || 4,
        category: catMap['Gaming & Laptops'] || 4,
        price: '9999.00',
        stock: 30,
        sku: 'GAM-HYP-KB75',
        description: 'Hot-swappable gasket-mounted mechanical keyboard with PBT keycaps and per-key RGB backlighting.',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
      },
      {
        name: 'SonicPulse Noise-Isolating Earbuds',
        brand: brandMap['SonicPulse'] || 1,
        category: catMap['Audio & Headphones'] || 1,
        price: '7999.00',
        stock: 50,
        sku: 'AUD-SONY-BUDS',
        description: 'True wireless earbuds featuring 360 Reality Audio and IPX4 water resistance.',
        is_featured: false,
        image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
      },
      {
        name: 'Apex Book M3 Ultra Laptop 16 inch',
        brand: brandMap['Apex Tech'] || 2,
        category: catMap['Gaming & Laptops'] || 4,
        price: '249900.00',
        stock: 10,
        sku: 'LAP-APX-M3U',
        description: 'Liquid Retina XDR display with 16-core CPU, 40-core GPU, and up to 128GB unified memory.',
        is_featured: true,
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
      }
    ];

    for (const p of sampleProducts) {
      const formData = new FormData();
      formData.append('brand', p.brand);
      formData.append('category', p.category);
      formData.append('name', p.name);
      formData.append('price', p.price);
      formData.append('stock', p.stock);
      formData.append('sku', p.sku);
      formData.append('description', p.description);
      formData.append('is_featured', p.is_featured ? 'true' : 'false');
      formData.append('is_active', 'true');

      try {
        await api.createProduct(formData);
      } catch (err) {
        console.warn('Product seeding notice:', p.name, err);
      }
    }

    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};
