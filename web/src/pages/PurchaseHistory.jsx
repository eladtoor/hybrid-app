import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

const PurchaseHistory = () => {
    const { userId, userName } = useParams();
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchaseItems, setSelectedPurchaseItems] = useState([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const purchasesCollection = collection(db, `users/${userId}/purchases`);
                const purchaseDocs = await getDocs(purchasesCollection);
                const purchasesData = purchaseDocs.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPurchases(purchasesData);
            } catch (error) {
                console.error("Error fetching purchase history:", error);
            }
        };

        fetchPurchaseHistory();
    }, [userId]);

    const handleViewDetails = (cartItems) => {
        setSelectedPurchaseItems(cartItems);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPurchaseItems([]);
    };

    return (
        <div className="purchase-history p-40 text-center">
            <h1 className="text-2xl font-semibold mb-6">היסטוריית רכישות של {userName}</h1>
            <table className="w-full border-collapse shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3 text-center">מזהה רכישה</th>
                        <th className="p-3 text-center">תאריך</th>
                        <th className="p-3 text-center">סטטוס</th>
                        <th className="p-3 text-center">מחיר סופי</th>
                        <th className="p-3 text-center">פירוט</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases
                        .slice()
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((purchase) => (
                            <tr key={purchase.id} className="border-b">
                                <td className="p-3">{purchase.purchaseId}</td>
                                <td className="p-3">{new Date(purchase.date).toLocaleString("he-IL", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}</td>
                                <td className="p-3">{purchase.status}</td>
                                <td className="p-3">₪{purchase.totalPrice}</td>
                                <td className="p-3">
                                    <button className="btn-outline text-grayish"
                                        onClick={() => handleViewDetails(purchase.cartItems)}>
                                        פירוט
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {isDetailModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                        <span className="absolute top-4 right-4 text-gray-600 cursor-pointer text-2xl" onClick={closeModal}>
                            &times;
                        </span>
                        <h2 className="text-xl font-bold text-center mb-4">פרטי המוצרים ברכישה</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse shadow-md rounded-lg">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-3 text-center">מזהה מוצר</th>
                                        <th className="p-3 text-center">מקט</th>
                                        <th className="p-3 text-center">שם</th>
                                        <th className="p-3 text-center">הערות</th>
                                        <th className="p-3 text-center">מחיר</th>
                                        <th className="p-3 text-center">כמות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPurchaseItems.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td className="p-3 text-center">{item._id}</td>
                                            <td className="p-3 text-center">{item.sku}</td>
                                            <td className="p-3 text-center">{item.name}</td>
                                            <td className="p-3 text-center">{item.comment}</td>
                                            <td className="p-3 text-center">₪{item.price}</td>
                                            <td className="p-3 text-center">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
