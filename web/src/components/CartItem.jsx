import React from 'react';
import '../styles/CartItem.css';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="cart-item">
            <button className="remove-item" onClick={onRemove}>×</button> {/* כפתור מחיקה */}
            <img src={item.image} alt={item.name} className="cart-item-image" /> {/* תוודא שהתמונה מוצגת */}
            <div className="cart-item-details">
                <h4>{item.productName}</h4> {/* הצגת שם המוצר */}
                <p>{item.sku}</p> {/* הצגת ה-SKU */}
                <p>₪{item.price}</p> {/* הצגת המחיר */}
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
