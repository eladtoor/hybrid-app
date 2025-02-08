import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import "../styles/PurchaseHistory.css";

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
        <div className="purchase-history">
            <h1 className="historyPurchase-title">היסטוריית רכישות של {userName}</h1>
            <table className="purchase-table">
                <thead>
                    <tr>
                        <th>מזהה רכישה</th>
                        <th>תאריך</th>
                        <th>סטטוס</th>
                        <th>מחיר סופי</th>
                        <th>פירוט</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases
                        .slice()
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
                        .map((purchase) => (
                            <tr key={purchase.id}>
                                <td>{purchase.purchaseId}</td>
                                <td>
                                    {new Date(purchase.date).toLocaleString("he-IL", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </td>
                                <td>{purchase.status}</td>
                                <td>₪{purchase.totalPrice}</td>
                                <td>
                                    <button
                                        className="detail-button"
                                        onClick={() => handleViewDetails(purchase.cartItems)}
                                    >
                                        פירוט
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {isDetailModalOpen && (
                <div className="modal">

                    <div className="modal-content-purchase">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>פרטי המוצרים ברכישה</h2>

                        {/* Ensure table expands fully inside modal */}
                        <div className="table-container">

                            <table className="item-table">

                                <thead>
                                    <tr>
                                        <th>מזהה מוצר</th>
                                        <th>מקט</th>
                                        <th>שם</th>
                                        <th>הערות</th>
                                        <th>מחיר</th>
                                        <th>כמות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedPurchaseItems.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item._id}</td>
                                            <td>{item.sku}</td>
                                            <td>{item.name}</td>
                                            <td>{item.comment}</td>
                                            <td>₪{item.price}</td>
                                            <td>{item.quantity}</td>
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
