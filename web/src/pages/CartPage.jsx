import React, { useState } from 'react';
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'בלוקים', price: 50.00, quantity: 2, image: '/product1.png', color: 'אפור', size: '20x20x40cm' },
        { id: 2, name: 'מלט', price: 30.00, quantity: 3, image: '/product2.png', color: 'אפור', size: '50 ק"ג' },
        { id: 3, name: 'טיח', price: 25.00, quantity: 4, image: '/product3.png', color: 'לבן', size: '25 ק"ג' }
    ]);

    const handleIncrease = (id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-page">
            <h1 className="cart-title">העגלה שלי</h1> {/* כותרת העגלה */}
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={() => handleIncrease(item.id)}
                            onDecrease={() => handleDecrease(item.id)}
                        />
                    ))}
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
