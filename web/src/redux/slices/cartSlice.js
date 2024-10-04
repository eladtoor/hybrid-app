import { createSlice } from "@reduxjs/toolkit";
import { saveCartToFirestore } from "../../utils/cartUtils"; // יבוא של פונקציות Firestore

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.sku === action.payload.sku
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems = [
          ...state.cartItems,
          { ...action.payload, price: action.payload.price || 0, quantity: 1 },
        ];
      }

      saveCartToFirestore(state.cartItems); // שמירת העגלה ל-Firestore
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      console.log("in setcart", state.cartItems);
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.sku === action.payload.sku
      );
      if (item) {
        item.quantity += 1;
        saveCartToFirestore(state.cartItems); // שמירת השינויים ב-Firestore
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.sku === action.payload.sku
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCartToFirestore(state.cartItems); // שמירת השינויים ב-Firestore
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.sku !== action.payload.sku
      );
      saveCartToFirestore(state.cartItems); // שמירת השינויים ב-Firestore
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
