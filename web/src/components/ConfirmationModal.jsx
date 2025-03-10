import React from "react";

const ConfirmationModal = ({ cartItems, finalTotalPrice, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            {/* תוכן המודאל */}
            <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-xl text-center transform scale-95 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">אישור הזמנה</h2>
                <p className="text-gray-600 mt-2">האם אתה בטוח שאתה רוצה לסיים את ההזמנה?</p>

                {/* סיכום הזמנה */}
                <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">סיכום הזמנה:</h3>
                    <ul className="mt-2 space-y-1 text-gray-600">
                        {cartItems.map((item) => (
                            <li key={item._id} className="border-b border-gray-300 py-1">
                                {item.שם} - {item.quantity} יחידות
                            </li>
                        ))}
                    </ul>
                    <p className="text-xl font-bold text-red-500 mt-2">סה"כ לתשלום: ₪{finalTotalPrice.toFixed(2)}</p>
                </div>

                {/* כפתורי אישור וביטול */}
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition"
                        onClick={onConfirm}
                    >
                        כן, אני בטוח
                    </button>
                    <button
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition"
                        onClick={onCancel}
                    >
                        לא, חזור
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
