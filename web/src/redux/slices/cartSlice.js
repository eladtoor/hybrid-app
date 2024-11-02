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
      const { _id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === _id);

      if (existingItem) {
        existingItem.quantity += quantity; // הגדל את הכמות הקיימת במכפלת הכמות החדשה
      } else {
        state.cartItems = [...state.cartItems, { ...action.payload, quantity }];
      }

      saveCartToFirestore(state.cartItems);
    },
    increaseQuantity: (state, action) => {
      const { _id } = action.payload;
      const item = state.cartItems.find((item) => item._id === _id);
      if (item) {
        item.quantity += item.packageSize || 1; // הגדלת הכמות לפי גודל החבילה או 1 כברירת מחדל
        saveCartToFirestore(state.cartItems);
      }
    },
    decreaseQuantity: (state, action) => {
      const { _id } = action.payload;
      const item = state.cartItems.find((item) => item._id === _id);
      if (item && item.quantity > item.packageSize) {
        item.quantity -= item.packageSize || 1;
        saveCartToFirestore(state.cartItems);
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      saveCartToFirestore(state.cartItems);
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
