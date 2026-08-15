import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/brands/');
      return res.brands || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/brands/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.brand;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/brands/${id}/update/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.brand;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/brands/${id}/delete/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.unshift(action.payload);
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const idx = state.brands.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.brands[idx] = action.payload;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((b) => b.id !== action.payload);
      });
  },
});

export default brandSlice.reducer;
