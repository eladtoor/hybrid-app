import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderData;

    if (!orderData) {
        return <p>שגיאה: אין מידע על ההזמנה</p>;
    }

    return (
        <div className="max-w-lg mx-auto mt-32 mb-12 p-12 text-center bg-white shadow-md rounded-lg">
            <h1 className="text-green-600 text-2xl font-bold">תודה על ההזמנה שלך!</h1>
            <p className="mt-4 text-lg">מספר הזמנה: <strong>{orderData.purchaseId}</strong></p>
            <p className="text-lg">סכום כולל: <strong>₪{orderData.totalPrice.toFixed(2)}</strong></p>
            <h3 className="mt-6 text-xl font-semibold">פרטי הזמנה:</h3>
            <ul className="mt-4 text-lg list-none p-0">
                {orderData.cartItems.map((item, index) => (
                    <li key={index} className="py-2 text-gray-700">
                        {item.name} - {item.quantity} יחידות
                    </li>
                ))}
            </ul>
            <button
                className="mt-6 bg-green-600 text-white py-2 px-6 rounded-md text-lg cursor-pointer hover:bg-green-700 transition"
                onClick={() => navigate("/")}
            >
                חזרה לעמוד הראשי
            </button>
        </div>
    );
};


export default OrderConfirmation;
