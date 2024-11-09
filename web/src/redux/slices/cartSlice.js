import { createSlice } from "@reduxjs/toolkit";
import { saveCartToFirestore } from "../../utils/cartUtils";

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          price: action.payload.price, // המחיר ליחידה
          quantity: action.payload.quantity, // כמות ראשונית
        });
      }
      saveCartToFirestore(state.cartItems); // עדכן לאחר השינוי
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity += action.payload.quantity;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload._id
      );
      if (item && item.quantity > action.payload.quantity) {
        item.quantity -= action.payload.quantity;
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
