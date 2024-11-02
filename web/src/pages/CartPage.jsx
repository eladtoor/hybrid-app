import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';
import { increaseQuantity, decreaseQuantity, removeFromCart, setCartItems } from '../redux/slices/cartSlice';
import { loadCartFromFirestore } from '../utils/cartUtils';

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCart = async () => {
            const cartFromFirestore = await loadCartFromFirestore();
            if (cartFromFirestore) {
                dispatch(setCartItems(cartFromFirestore));
            }
        };
        fetchCart();
    }, [dispatch]);

    const handleIncrease = (_id) => {
        dispatch(increaseQuantity({ _id }));
    };

    const handleDecrease = (_id) => {
        dispatch(decreaseQuantity({ _id }));
    };

    const handleRemove = (_id) => {
        dispatch(removeFromCart({ _id }));
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
                                key={item._id}
                                item={item}
                                onIncrease={() => handleIncrease(item._id)}
                                onDecrease={() => handleDecrease(item._id)}
                                onRemove={() => handleRemove(item._id)}
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