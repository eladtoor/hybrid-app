import React from "react";

const ConfirmationModal = ({
    cartItems,
    finalTotalPrice,
    shippingCost,
    craneUnloadCost,
    onConfirm,
    onCancel
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            {/* תוכן המודאל */}
            <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-xl text-center transform scale-95 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800">אישור הזמנה</h2>
                <p className="text-gray-600 mt-2">האם אתה בטוח שאתה רוצה לסיים את ההזמנה?</p>

                {/* סיכום הזמנה */}
                <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700">סיכום הזמנה:</h3>
                    <div className="mt-2 space-y-2 text-right text-sm text-gray-700">
                        {cartItems.map((item) => (
                            <div key={item._id} className="border-b border-gray-300 pb-2">
                                <p className="font-bold">{item.baseName || item.name || "מוצר ללא שם"}</p>
                                {/* מאפיינים נבחרים */}
                                {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                                    <p className="text-xs text-gray-500">
                                        {Object.entries(item.selectedAttributes).map(([key, value]) => `${key}: ${value.value}`).join(" | ")}
                                    </p>
                                )}
                                <p>כמות: {item.quantity}</p>
                                <p>מחיר ליחידה: ₪{item.unitPrice?.toFixed(2) || item.price?.toFixed(2) || 0}</p>
                                <p>סה"כ: ₪{((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)}</p>
                                {item.comment && <p className="italic text-gray-500">הערה: {item.comment}</p>}
                            </div>
                        ))}

                        {/* משלוח */}
                        {cartItems.length > 0 && (
                            <>
                                <div className="border-t border-gray-400 pt-2">
                                    <p>משלוח: ₪{shippingCost?.toFixed(2) || 0}
                                    </p>
                                    {craneUnloadCost > 0 && (
                                        <p>פריקת מנוף: ₪{craneUnloadCost}</p>
                                    )}

                                </div>
                            </>
                        )}
                    </div>


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
