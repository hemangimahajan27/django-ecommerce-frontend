import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/categories/');
      return res.categories || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminCategories = createAsyncThunk(
  'categories/fetchAdminCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/categories/admin/');
      return res.categories || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/categories/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.category;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/categories/${id}/update/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.category;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/categories/${id}/delete/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  categories: [],
  adminCategories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.adminCategories = action.payload;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
        state.adminCategories.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.categories[idx] = action.payload;
        const aIdx = state.adminCategories.findIndex((c) => c.id === action.payload.id);
        if (aIdx !== -1) state.adminCategories[aIdx] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
        state.adminCategories = state.adminCategories.filter((c) => c.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
