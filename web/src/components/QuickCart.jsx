import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, setCartItems } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { saveCartToFirestore } from "../utils/cartUtils";

const QuickCart = () => {
    const user = useSelector((state) => state.user?.user);
    const products = useSelector((state) => state.products?.products || []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [recentPurchases, setRecentPurchases] = useState([]);

    useEffect(() => {
        if (user?.uid) {
            fetchLastPurchase();
        }
    }, [user]);

    const fetchLastPurchase = async () => {
        try {
            const purchasesRef = collection(db, "users", user.uid, "purchases");
            const q = query(purchasesRef, orderBy("date", "desc"), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const lastPurchase = querySnapshot.docs[0].data();
                setRecentPurchases(lastPurchase.cartItems || []);
            }
        } catch (error) {
            console.error("Error fetching last purchase:", error);
        }
    };

    const mergeProductData = (product) => {
        const productDetails = products.find((p) => p._id === product._id) || {};
        console.log(product);

        return {
            ...product,
            image: productDetails.תמונות || "/default-image.jpg",
            unitPrice: product.price || productDetails.מחיר || 0,
            sku: product.sku || productDetails.sku || "לא זמין",
            name: product.name || productDetails.שם || "ללא שם",
            quantity: product.quantity || 1,
            packageSize: product.packageSize || product.quantities || 1, // ✅ פה הקסם

            cartItemId: `${product._id}-${Date.now()}`,
        };
    };


    const handleAddAllToCart = async () => {
        const mergedCartItems = recentPurchases.map((product) => mergeProductData(product));
        dispatch(setCartItems(mergedCartItems));
        await saveCartToFirestore(mergedCartItems);
        navigate("/cart");
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 my-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">עגלה מהירה</h2>
            {recentPurchases.length === 0 ? (
                <p className="text-gray-600">אין לך רכישות קודמות.</p>
            ) : (
                <div>
                    <ul className="divide-y divide-gray-200">
                        {recentPurchases.map((item) => {
                            const mergedItem = mergeProductData(item);
                            return (
                                <li key={mergedItem.cartItemId} className="flex items-center justify-between py-3">
                                    <div className="flex items-center">
                                        <img src={mergedItem.image} alt={mergedItem.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                        <div>
                                            <h3 className="text-sm font-semibold">{mergedItem.name}</h3>
                                            <p className="text-gray-500">מק"ט: {mergedItem.sku}</p>
                                            <p className="text-gray-500">כמות אחרונה: {mergedItem.quantity}</p>
                                            {mergedItem.comment && <p className="text-sm text-gray-600">הערות: {mergedItem.comment}</p>}
                                            <p className="text-sm text-gray-600">מחיר ליחידה: ₪{mergedItem.unitPrice}</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <button
                        className="mt-4 w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
                        onClick={handleAddAllToCart}
                    >
                        הוסף את כל המוצרים לעגלה ועבור לעגלה
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuickCart;
