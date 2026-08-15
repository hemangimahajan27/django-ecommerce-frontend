const BASE_URL = 'https://django-ecommerce-backend-7jue.onrender.com/api';

export const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic request helper
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    ...getAuthHeader(),
  };

  // If payload is FormData (for media uploads like brand/category/product logos), don't set Content-Type JSON
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const errorMsg = data.message || data.error || (data.errors ? JSON.stringify(data.errors) : 'Request failed');
      throw new Error(errorMsg);
    }
    
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication & Users
  login: (credentials) => request('/users/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/users/register/', { method: 'POST', body: JSON.stringify(userData) }),
  getProfile: () => request('/users/profile/'),
  updateProfile: (data) => request('/users/profile/update/', { method: 'PATCH', body: JSON.stringify(data) }),
  getAllUsers: () => request('/users/all/'),

  // Brands
  getBrands: () => request('/brands/'),
  getBrandById: (id) => request(`/brands/${id}/`),
  createBrand: (formData) => request('/brands/create/', { method: 'POST', body: formData }),
  updateBrand: (id, formData) => request(`/brands/${id}/update/`, { method: 'PATCH', body: formData }),
  deleteBrand: (id) => request(`/brands/${id}/delete/`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories/'),
  getCategoryById: (id) => request(`/categories/${id}/`),
  createCategory: (formData) => request('/categories/create/', { method: 'POST', body: formData }),
  updateCategory: (id, formData) => request(`/categories/${id}/update/`, { method: 'PATCH', body: formData }),
  deleteCategory: (id) => request(`/categories/${id}/delete/`, { method: 'DELETE' }),

  // Products
  getProducts: () => request('/products/'),
  getProductById: (id) => request(`/products/${id}/`),
  createProduct: (formData) => request('/products/create/', { method: 'POST', body: formData }),
  updateProduct: (id, formData) => request(`/products/update/${id}/`, { method: 'PATCH', body: formData }),
  deleteProduct: (id) => request(`/products/delete/${id}/`, { method: 'DELETE' }),
};
