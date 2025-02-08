import React from 'react';
import '../styles/CartItem.css';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    // הגדרת ערך ברירת מחדל ל- price ול- quantity אם הם לא קיימים
    const unitPrice = item.unitPrice || 0;
    const totalQuantity = item.quantity || 1;

    // פונקציות להוספת או הפחתת הכמות לפי גודל החבילה
    const handleIncreaseByPackage = (packageSize) => {
        onIncrease(item.cartItemId, packageSize);
    };

    const handleDecreaseByPackage = (packageSize) => {
        onDecrease(item.cartItemId, packageSize);
    };

    return (
        <div className="cart-item">
            <button className="remove-item" onClick={() => onRemove(item.cartItemId)}>×</button> {/* כפתור מחיקה */}
            <img src={item.תמונות} alt={item.שם} className="cart-item-image" /> {/* תמונה */}
            <div className="cart-item-details">
                <h4>{item.שם}</h4> {/* שם המוצר */}
                <p>{item['מק"ט']}</p> {/* SKU */}

                {/* ✅ Show comment if exists */}
                {item.comment && (
                    <p className="cart-item-comment">
                        <strong>הערה:</strong> {item.comment}
                    </p>
                )}

                {/* הצגת המחיר ליחידה */}
                <p>מחיר ליחידה: ₪{unitPrice.toFixed(2)}</p>

                {/* הצגת כמות כוללת */}
                <p className="total-quantity">סה"כ כמות: {totalQuantity}</p>

                {/* הצגת חבילות עם אפשרות הוספה והפחתה לפי כמות החבילה */}
                <div className="quantity-options">
                    <h3>חבילות:</h3>
                    {item.quantities && item.quantities.length > 0 ? (
                        item.quantities.map((packageSize) => (
                            <div key={packageSize} className="package-quantity">
                                <p>חבילה של {packageSize === 1 ? 'יחידה אחת' : `${packageSize} יחידות`}</p>
                                <div className="package-quantity-controls">
                                    <button
                                        className="quantity-button"
                                        onClick={() => handleIncreaseByPackage(packageSize)}
                                    >
                                        +
                                    </button>
                                    <span className="quantity-display">{packageSize}</span> {/* גודל החבילה */}
                                    <button
                                        className="quantity-button"
                                        onClick={() => handleDecreaseByPackage(packageSize)}
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="cart-item-quantity">
                            <button className="quantity-button" onClick={() => handleDecreaseByPackage(1)}>-</button>
                            <input type="number" value={totalQuantity} readOnly className="quantity-input" />
                            <button className="quantity-button" onClick={() => handleIncreaseByPackage(1)}>+</button>
                        </div>
                    )}
                </div>

                {/* הצגת המחיר הכולל */}
                <p className="total-price">סה"כ מחיר: ₪{(unitPrice * totalQuantity).toFixed(2)}</p>
            </div>
        </div>
    );
};

export default CartItem;
