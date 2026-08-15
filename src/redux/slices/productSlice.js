import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const endpoint = query ? `/products/?${query}` : '/products/';
      const res = await axiosClient.get(endpoint);
      return res.products || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/products/admin/');
      return res.products || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/products/${id}/`);
      return res.product;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/products/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.product;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/products/update/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.product;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/products/delete/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  products: [],
  adminProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    brand: '',
    min_price: '',
    max_price: '',
    ordering: '-created_at',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Admin Products
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.adminProducts = action.payload;
      })
      // Fetch Detail
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.adminProducts.unshift(action.payload);
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
        const adminIndex = state.adminProducts.findIndex((p) => p.id === action.payload.id);
        if (adminIndex !== -1) state.adminProducts[adminIndex] = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        state.adminProducts = state.adminProducts.filter((p) => p.id !== action.payload);
      });
  },
});

export const { setFilter, resetFilters, clearProductError } = productSlice.actions;
export default productSlice.reducer;
