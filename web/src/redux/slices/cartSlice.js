import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            console.log('Adding product to cart:', action.payload);
            
            if (!action.payload || Object.keys(action.payload).length === 0) {
                console.error('Received an empty or undefined product:', action.payload);
                return;
            }
        
            const existingItem = state.cartItems.find(item => item.sku === action.payload.sku);
        
            if (existingItem) {
                existingItem.quantity += 1;
                console.log('Updated existing item:', existingItem);
            } else {
                state.cartItems.push({ 
                    ...action.payload, 
                    price: action.payload.price || 0,
                    quantity: action.payload.quantity > 0 ? action.payload.quantity : 1 
                });
                console.log('Added new item:', action.payload);
            }
        
            // הדפסת מצב העגלה לאחר הוספת מוצר
            console.log('Updated cart state (after push):', JSON.stringify(state.cartItems, null, 2)); // הדפס את כל המצב של העגלה בפירוט
        
        
        },
        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(item => item.sku === action.payload.sku);
            if (item) {
                item.quantity += 1;
                console.log('Increased quantity:', item);
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(item => item.sku === action.payload.sku);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                console.log('Decreased quantity:', item);
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item.sku !== action.payload.sku);
            console.log('Removed item:', action.payload.sku);
        },
    },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
