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
      const newItem = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.cartItemId === newItem.cartItemId
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        state.cartItems.push({
          ...newItem,
          price: newItem.price,
          unitPrice: newItem.unitPrice,
          quantity: newItem.quantity,
        });
      }

      saveCartToFirestore([...state.cartItems]);
    },

    increaseQuantity: (state, action) => {
      const { cartItemId, amount = 1 } = action.payload;

      const item = state.cartItems.find(
        (item) => item.cartItemId === cartItemId
      );

      if (item) {
        item.quantity += amount; // ✅ העלאה לפי הכמות שנשלחה
        saveCartToFirestore([...state.cartItems]);
      }
    },

    decreaseQuantity: (state, action) => {
      const { cartItemId, amount = 1 } = action.payload;

      const item = state.cartItems.find(
        (item) => item.cartItemId === cartItemId
      );

      if (item) {
        if (item.quantity > amount) {
          item.quantity -= amount; // ✅ הפחתה לפי הכמות שנשלחה
        } else {
          // ✅ הסרה אם הכמות שווה או קטנה ממה שמנסים להוריד
          state.cartItems = state.cartItems.filter(
            (item) => item.cartItemId !== cartItemId
          );
        }

        saveCartToFirestore([...state.cartItems]);
      }
    },

    removeFromCart: (state, action) => {
      const { cartItemId } = action.payload;

      // ✅ Remove item by its unique cartItemId
      state.cartItems = state.cartItems.filter(
        (item) => item.cartItemId !== cartItemId
      );

      saveCartToFirestore([...state.cartItems]);
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
