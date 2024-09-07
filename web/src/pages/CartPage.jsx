import React from 'react';
import CartItem from '../components/CartItem';

const CartPage = () => {
    const cartItems = [
        { id: 1, name: 'Product 1', price: 29.99, quantity: 2, image: '/images/product1.jpg' },
        { id: 2, name: 'Product 2', price: 39.99, quantity: 1, image: '/images/product2.jpg' },
    ];

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <div className="cart-items">
                {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default CartPage;