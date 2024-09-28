import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../redux/slices/cartSlice';

const CartPage = () => {
    // מושך את הפריטים מהעגלה מתוך Redux
    const cartItems = useSelector((state) => state.cart.cartItems); 
    const dispatch = useDispatch();

    const handleIncrease = (id) => {
        dispatch(increaseQuantity({ id }));
    };

    const handleDecrease = (id) => {
        dispatch(decreaseQuantity({ id }));
    };

    const handleRemove = (id) => {
        dispatch(removeFromCart({ id }));
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0); // וודא שיש מחיר

    return (
        <div className="cart-page">
            <h1 className="cart-title">העגלה שלי</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem
                                key={item.sku} // וודא שאתה משתמש במפתח ייחודי
                                item={item}
                                onIncrease={() => handleIncrease(item.sku)} // מזהה את המוצר לפי ה-SKU
                                onDecrease={() => handleDecrease(item.sku)}
                                onRemove={() => handleRemove(item.sku)}
                            />
                        ))
                    ) : (
                        <p>העגלה ריקה</p>
                    )}
                </div>
                <div className="vertical-divider"></div> {/* מפריד אנכי */}
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
