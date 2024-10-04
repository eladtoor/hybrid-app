import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';
import { increaseQuantity, decreaseQuantity, removeFromCart, setCartItems } from '../redux/slices/cartSlice';
import { loadCartFromFirestore } from '../utils/cartUtils'; // הפונקציה לשליפת העגלה מ-Firestore

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();

    useEffect(() => {
        // שליפת העגלה מ-Firestore עם הטעינה של העמוד
        const fetchCart = async () => {
            const cartFromFirestore = await loadCartFromFirestore();
            if (cartFromFirestore) {
                dispatch(setCartItems(cartFromFirestore)); // שמירת הנתונים ב-Redux
            }
        };

        fetchCart(); // קריאה לפונקציה שמבצעת את השליפה
    }, [dispatch]); // הפונקציה תפעל רק פעם אחת לאחר טעינת העמוד

    const handleIncrease = (sku) => {
        dispatch(increaseQuantity({ sku }));
    };

    const handleDecrease = (sku) => {
        dispatch(decreaseQuantity({ sku }));
    };

    const handleRemove = (sku) => {
        dispatch(removeFromCart({ sku }));
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);

    return (
        <div className="cart-page">
            <h1 className="cart-title">העגלה שלי</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem
                                key={item.sku}
                                item={item}
                                onIncrease={() => handleIncrease(item.sku)}
                                onDecrease={() => handleDecrease(item.sku)}
                                onRemove={() => handleRemove(item.sku)}
                            />
                        ))
                    ) : (
                        <p>העגלה ריקה</p>
                    )}
                </div>
                <div className="vertical-divider"></div>
                <div className="cart-summary">
                    <h2>סיכום הזמנה</h2>
                    <p>סה"כ לתשלום: ₪{totalPrice.toFixed(2)}</p>
                    <p>משלוח: חינם</p>
                    <p>סה"כ כולל משלוח: ₪{totalPrice.toFixed(2)}</p>
                    <button className="checkout-button">מעבר לתשלום</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;