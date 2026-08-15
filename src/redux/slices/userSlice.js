import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchAdminUsers = createAsyncThunk(
  'users/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/users/all/');
      return res.users || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/users/${id}/`);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserAdmin = createAsyncThunk(
  'users/updateUserAdmin',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch(`/users/${id}/update/`, userData);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUserAdmin = createAsyncThunk(
  'users/deleteUserAdmin',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/users/${id}/delete/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(deleteUserAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
