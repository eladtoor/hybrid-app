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

      // ✅ Find an existing item with the same _id AND same comment
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id && item.comment === newItem.comment
      );

      if (existingItem) {
        // ✅ Merge quantity if it's the same product & same comment
        existingItem.quantity += newItem.quantity;
      } else {
        // ✅ Create a new cart item if comment is different or new item
        state.cartItems.push({
          ...newItem,
          cartItemId: newItem.comment
            ? `${newItem._id}-${Date.now()}`
            : newItem._id, // Unique ID for different comments
          price: newItem.price,
          unitPrice: newItem.unitPrice,
          quantity: newItem.quantity,
        });
      }

      saveCartToFirestore([...state.cartItems]); // ✅ Update Firestore after change
    },

    increaseQuantity: (state, action) => {
      const { cartItemId } = action.payload;

      // ✅ Find the exact cart item using cartItemId
      const item = state.cartItems.find(
        (item) => item.cartItemId === cartItemId
      );

      if (item) {
        item.quantity += 1; // ✅ Increase quantity
        saveCartToFirestore([...state.cartItems]);
      }
    },

    decreaseQuantity: (state, action) => {
      const { cartItemId } = action.payload;

      // ✅ Find the exact cart item using cartItemId
      const item = state.cartItems.find(
        (item) => item.cartItemId === cartItemId
      );

      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1; // ✅ Decrease quantity
        } else {
          // ✅ Remove item if quantity reaches zero
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
