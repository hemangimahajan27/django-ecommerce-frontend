import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://django-ecommerce-backend-7jue.onrender.com';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attach JWT Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh JWT Token on 401
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and refresh token exists, attempt auto-refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post('https://django-ecommerce-backend-7jue.onrender.com/api/users/token/refresh/', {
            refresh: refreshToken,
          });

          if (res.data?.access) {
            localStorage.setItem('access_token', res.data.access);
            axiosClient.defaults.headers.common.Authorization = `Bearer ${res.data.access}`;
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshErr) {
          // Token refresh failed - clear stale tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null) ||
      (error.response?.status === 401 ? 'Session expired. Please sign in again.' : error.message) ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
