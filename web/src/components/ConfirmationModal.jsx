import React from "react";
import "../styles/ConfirmationModal.css"; // CSS styles

const ConfirmationModal = ({ cartItems, finalTotalPrice, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>אישור הזמנה</h2>
                <p>האם אתה בטוח שאתה רוצה לסיים את ההזמנה?</p>

                <div className="cart-summary-modal">
                    <h3>סיכום הזמנה:</h3>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item._id}>
                                {item.שם} - {item.quantity} יחידות
                            </li>
                        ))}
                    </ul>
                    <p className="total-price">סה"כ לתשלום: ₪{finalTotalPrice.toFixed(2)}</p>
                </div>

                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>כן, אני בטוח</button>
                    <button className="cancel-button" onClick={onCancel}>לא, חזור</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
