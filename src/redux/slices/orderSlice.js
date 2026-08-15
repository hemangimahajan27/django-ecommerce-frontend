import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/orders/create/', orderData);
      return res.order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/orders/my-orders/');
      return res.orders || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/orders/${id}/`);
      return res.order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/orders/admin/all/');
      return res.orders || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOrderStatusAdmin = createAsyncThunk(
  'orders/updateOrderStatusAdmin',
  async ({ id, order_status, payment_status }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/orders/admin/${id}/update-status/`, {
        order_status,
        payment_status,
      });
      return res.order;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  myOrders: [],
  adminOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderSuccess: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.myOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Order Detail
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      // Admin Orders
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminOrders = action.payload;
      })
      // Admin Status Update
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        const idx = state.adminOrders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.adminOrders[idx] = action.payload;
      });
  },
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
