import { createSlice } from '@reduxjs/toolkit';

const savedCart = localStorage.getItem('ecom_cart_redux');
const initialCartItems = savedCart ? JSON.parse(savedCart) : [];

const calculateCartTotals = (items) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price || 0) * item.quantity,
    0
  );
  return { totalQuantity, subtotal };
};

const totals = calculateCartTotals(initialCartItems);

const initialState = {
  cartItems: initialCartItems,
  totalQuantity: totals.totalQuantity,
  subtotal: totals.subtotal,
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ ...product, quantity });
      }

      const updated = calculateCartTotals(state.cartItems);
      state.totalQuantity = updated.totalQuantity;
      state.subtotal = updated.subtotal;
      state.isCartOpen = true;
      localStorage.setItem('ecom_cart_redux', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== id);

      const updated = calculateCartTotals(state.cartItems);
      state.totalQuantity = updated.totalQuantity;
      state.subtotal = updated.subtotal;
      localStorage.setItem('ecom_cart_redux', JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.cartItems.find((i) => i.id === id);

      if (item) {
        const newQty = item.quantity + delta;
        if (newQty > 0) {
          item.quantity = newQty;
        } else {
          state.cartItems = state.cartItems.filter((i) => i.id !== id);
        }
      }

      const updated = calculateCartTotals(state.cartItems);
      state.totalQuantity = updated.totalQuantity;
      state.subtotal = updated.subtotal;
      localStorage.setItem('ecom_cart_redux', JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
      localStorage.removeItem('ecom_cart_redux');
    },

    toggleCartDrawer: (state, action) => {
      state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCartDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
