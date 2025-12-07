// src/features/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ---- helpers for sessionStorage ----
const loadCartFromSessionStorage = () => {
  try {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load cart from sessionStorage", error);
    return [];
  }
};

const saveCartToSessionStorage = (items) => {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to sessionStorage", error);
  }
};

// ---- initial state ----
const initialState = {
  // each item will look like: { ...product, quantity: number }
  items: loadCartFromSessionStorage(),
};

// ---- slice ----
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        // already in cart → just increase quantity
        existing.quantity += 1;
      } else {
        // not in cart → add with quantity 1
        state.items.push({
          ...product,
          quantity: 1,
        });
      }

      saveCartToSessionStorage(state.items);
    },

    removeFromCart(state, action) {
      const idToRemove = action.payload; // product id
      state.items = state.items.filter((item) => item.id !== idToRemove);
      saveCartToSessionStorage(state.items);
    },

    incrementQuantity(state, action) {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += 1;
        saveCartToSessionStorage(state.items);
      }
    },

    decrementQuantity(state, action) {
      const id = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
          saveCartToSessionStorage(state.items);
        } else {
          // if quantity would hit 0, remove item entirely
          state.items = state.items.filter((item) => item.id !== id);
          saveCartToSessionStorage(state.items);
        }
      }
    },

    clearCart(state) {
      state.items = [];
      saveCartToSessionStorage(state.items);
    },
  },
});

// ---- exports ----
export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ---- selectors (for later cart page / navbar) ----
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotalQuantity = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
