import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/OrderConfirmation.css"; // Create this CSS file

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    if (!orderData) {
        return <p>שגיאה: אין מידע על ההזמנה</p>;
    }

    return (
        <div className="order-confirmation-container">
            <h1>תודה על ההזמנה שלך!</h1>
            <p>מספר הזמנה: <strong>{orderData.purchaseId}</strong></p>
            <p>סכום כולל: <strong>₪{orderData.totalPrice.toFixed(2)}</strong></p>
            <h3>פרטי הזמנה:</h3>
            <ul>
                {orderData.cartItems.map((item, index) => (
                    <li key={index}>
                        <span>{item.name} - {item.quantity} יחידות</span>
                    </li>
                ))}
            </ul>
            <button className="orderConfirm-button" onClick={() => navigate("/")}>חזרה לעמוד הראשי</button>
        </div>
    );
};

export default OrderConfirmation;
