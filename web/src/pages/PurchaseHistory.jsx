import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import '../styles/PurchaseHistory.css';

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
                const purchasesData = purchaseDocs.docs.map(doc => ({
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
            <h1 className='historyPurchase-title'>היסטוריית רכישות של {userName}</h1>
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
                    {purchases.map(purchase => (
                        <tr key={purchase.id}>
                            <td>{purchase.id}</td>
                            <td>{purchase.date}</td>
                            <td>{purchase.status}</td>
                            <td>₪{purchase.totalPrice}</td>
                            <td>
                                <button className='detail-button' onClick={() => handleViewDetails(purchase.cartItems)}>
                                    פירוט
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isDetailModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>פרטי המוצרים ברכישה</h2>
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th>מקט</th>
                                    <th>שם</th>
                                    <th>קטגוריה</th>
                                    <th>מחיר</th>
                                    <th>כמות</th>
                                    <th>תמונה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPurchaseItems.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.sku}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>₪{item.price}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            <img src={item.imageUrl} alt={item.name} className="item-image" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;