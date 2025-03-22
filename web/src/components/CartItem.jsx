import React from 'react';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    const unitPrice = item.unitPrice || 0;
    const totalQuantity = item.quantity || 1;

    const handleIncreaseByPackage = (packageSize) => {
        onIncrease(item.cartItemId, packageSize);
    };

    const handleDecreaseByPackage = (packageSize) => {
        onDecrease(item.cartItemId, packageSize);
    };

    return (
        <div className="relative flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-4 mb-4 transition hover:shadow-xl">
            {/* כפתור מחיקה */}
            <button
                className="absolute top-2 left-2 text-red-500 text-2xl hover:text-red-700 transition"
                onClick={() => onRemove(item.cartItemId)}
            >
                ×
            </button>

            {/* תמונת המוצר */}
            <img
                src={item.תמונות}
                alt={item.שם}
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 md:w-32 md:h-32"
            />

            {/* פרטי המוצר */}
            <div className="flex-1 text-right px-4">
                <h4 className="text-lg font-bold text-gray-800">{item.שם}</h4>
                <p className="text-gray-600 text-sm">מק"ט: {item['מק"ט']}</p>

                {/* ✅ הצגת מאפיינים נבחרים */}
                {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                    <div className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                        {Object.entries(item.selectedAttributes).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key}:</strong> {value}
                            </p>
                        ))}
                    </div>
                )}

                {/* ✅ הצגת פריקת מנוף אם קיים */}
                {item.craneUnload !== null && item.craneUnload !== undefined && (
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>פריקת מנוף:</strong> {item.craneUnload ? "כן" : "לא"}
                    </p>
                )}

                {/* הערות */}
                {item.comment && (
                    <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md mt-2">
                        <strong>הערה:</strong> {item.comment}
                    </p>
                )}

                {/* מחיר ליחידה */}
                <p className="text-gray-800 font-semibold mt-2">מחיר ליחידה: ₪{unitPrice.toFixed(2)}</p>

                {/* כמות כוללת */}
                <p className="text-gray-700 font-medium">סה"כ כמות: {totalQuantity}</p>
            </div>

            {/* כפתורי שינוי כמות */}
            <div className="flex flex-col items-center gap-2">
                {item.quantities && item.quantities.length > 0 ? (
                    item.quantities.map((packageSize) => (
                        <div key={packageSize} className="flex flex-col items-center bg-blue-100 px-4 py-2 rounded-md shadow-md">
                            <p className="text-sm font-medium">חבילה של {packageSize} יח'</p>
                            <div className="flex items-center gap-2 mt-1">
                                <button
                                    className="w-8 h-8 bg-gray-200 text-lg font-bold rounded-full hover:bg-blue-400 hover:text-white transition"
                                    onClick={() => handleIncreaseByPackage(packageSize)}
                                >
                                    +
                                </button>
                                <span className="text-lg font-bold">{packageSize}</span>
                                <button
                                    className="w-8 h-8 bg-gray-200 text-lg font-bold rounded-full hover:bg-red-400 hover:text-white transition"
                                    onClick={() => handleDecreaseByPackage(packageSize)}
                                >
                                    -
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center gap-3 bg-gray-200 px-4 py-2 rounded-md">
                        <button
                            className="w-8 h-8 bg-gray-300 text-lg font-bold rounded-full hover:bg-red-500 hover:text-white transition"
                            onClick={() => handleDecreaseByPackage(1)}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={totalQuantity}
                            readOnly
                            className="w-10 text-center bg-transparent font-semibold"
                        />
                        <button
                            className="w-8 h-8 bg-gray-300 text-lg font-bold rounded-full hover:bg-blue-500 hover:text-white transition"
                            onClick={() => handleIncreaseByPackage(1)}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>

            {/* מחיר כולל */}
            <p className="text-lg font-semibold text-gray-900 mt-2 md:mt-0">
                סה"כ מחיר: ₪{(unitPrice * totalQuantity).toFixed(2)}
            </p>
        </div>
    );
};

export default CartItem;
