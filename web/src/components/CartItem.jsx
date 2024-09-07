import React from 'react';
import '../styles/CartItem.css'

const CartItem = ({ item }) => {
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>{item.color} - {item.size}</p>
                <p>${item.price}</p>
                <div className="cart-item-quantity">
                    <label>כמות:</label>
                    <input type="number" value={item.quantity} readOnly />
                </div>
            </div>
            <div className="cart-item-status">
                {item.inStock ? (
                    <p className="in-stock">במלאי</p>
                ) : (
                    <p className="out-of-stock">אזל מהמלאי</p>
                )}
            </div>
            <button className="remove-item">×</button>
        </div>
    );
};

export default CartItem;