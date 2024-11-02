import React from 'react';
import '../styles/CartItem.css';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <div className="cart-item">
            <button className="remove-item" onClick={onRemove}>×</button> {/* כפתור מחיקה */}
            <img src={item.תמונות} alt={item.שם} className="cart-item-image" /> {/* תוודא שהתמונה מוצגת */}
            <div className="cart-item-details">
                <h4>{item.שם}</h4> {/* הצגת שם המוצר */}
                <p>{item['מק"ט']}</p> {/* הצגת ה-SKU */}

                {/* הצגת המחיר ליחידה */}
                <p>מחיר ליחידה: ₪{item.price.toFixed(2)}</p>

                {/* הצגת חבילה של X יחידות או יחידה אחת */}
                <p>חבילה של {item.packageSize === 1 ? 'יחידה אחת' : `${item.packageSize} יחידות`}</p>

                {/* הצגת הכמות */}
                <div className="cart-item-quantity">
                    <button className="quantity-button" onClick={onDecrease}>-</button>
                    <input type="number" value={item.quantity} readOnly className="quantity-input" />
                    <button className="quantity-button" onClick={onIncrease}>+</button>
                </div>

                {/* הצגת המחיר הכולל */}
                <p>סה"כ מחיר: ₪{(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    );
};

export default CartItem;