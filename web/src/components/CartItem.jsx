import React from 'react';
import '../styles/CartItem.css';

const CartItem = ({ item, onIncrease, onDecrease }) => {
    return (
        <div className="cart-item">
            <button className="remove-item">×</button> {/* כפתור מחיקה */}
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>{item.color} - {item.size}</p>
                <p>₪{item.price}</p>
                <div className="cart-item-quantity">
                    <button className="quantity-button" onClick={onDecrease}>-</button>
                    <input type="number" value={item.quantity} readOnly className="quantity-input" />
                    <button className="quantity-button" onClick={onIncrease}>+</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
