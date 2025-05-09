import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setCartItems } from "../redux/slices/cartSlice";
import { saveCartToFirestore } from '../utils/cartUtils';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [verificationStatus, setVerificationStatus] = useState("pending");
    const [currentUser, setCurrentUser] = useState(null);
    const [saleDetails, setSaleDetails] = useState(null);

    const shouldSkipVerification = false;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                console.warn("⚠️ No user logged in");
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUser) return; // מחכה שהמשתמש יטען

        if (shouldSkipVerification) {
            console.warn("⚠️ Skipping verification manually (dev mode)");
            setVerificationStatus("success");
            dispatch(setCartItems([]));
            saveCartToFirestore([]);
            return;
        }

        const verifyPayment = async () => {
            const privateToken = localStorage.getItem("SalePrivateToken");

            if (!privateToken) {
                console.error("❌ SalePrivateToken is missing from localStorage.");
                setVerificationStatus("failed");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/payment/sale-details", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ SalePrivateToken: privateToken })
                });

                const data = await response.json();
                setSaleDetails(data); // שומר את הנתונים לתצוגה

                if (data.TransactionStatus === 0) {
                    setVerificationStatus("success");

                    const purchaseData = {
                        purchaseId: privateToken,
                        date: new Date().toISOString(),
                        status: "completed",
                        customer: {
                            firstName: data.CustomerFirstName || "",
                            lastName: data.CustomerLastName || "",
                            email: data.EmailAddress || ""
                        },
                        payments: data.NumOfPayment || 1
                    };

                    const purchasesRef = collection(db, "users", currentUser.uid, "purchases");
                    await addDoc(purchasesRef, purchaseData);

                    dispatch(setCartItems([]));
                    saveCartToFirestore([]);
                } else {
                    console.error("❌ Payment verification failed:", data);
                    setVerificationStatus("failed");
                }
            } catch (error) {
                console.error("❌ Error verifying payment with SaleDetails:", error);
                setVerificationStatus("failed");
            }
        };

        verifyPayment();
    }, [location, dispatch, currentUser]);

    return (
        <div className="text-center p-6">
            {verificationStatus === "pending" && <h1 className="text-2xl font-bold text-gray-700">🔄 מאמת תשלום...</h1>}
            {verificationStatus === "success" && (
                <>
                    <h1 className="text-3xl font-bold text-green-600">✅ התשלום הצליח!</h1>
                    <p className="text-lg text-gray-700 mt-4">ההזמנה שלך נשמרה בהצלחה.</p>

                    {/* הצגת פירוט ההזמנה */}
                    {saleDetails && (
                        <>
                            <h2 className="text-xl font-bold mt-6">פרטי ההזמנה:</h2>
                            <div className="mt-4 space-y-4 text-right">
                                {/* טבלת פירוט הזמנה */}
                                <div className="mt-6 text-right">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border border-gray-300 p-2">תיאור</th>
                                                <th className="border border-gray-300 p-2">כמות</th>
                                                <th className="border border-gray-300 p-2">מחיר ליחידה</th>
                                                <th className="border border-gray-300 p-2">סה"כ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {saleDetails.Items.filter(item => item.ItemCatalog !== "SUMMARY_VAT").map((item, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 p-2">{item.Description}</td>
                                                    <td className="border border-gray-300 p-2 text-center">{item.Quantity}</td>
                                                    <td className="border border-gray-300 p-2 text-center">₪{item.UnitPrice.toFixed(2)}</td>
                                                    <td className="border border-gray-300 p-2 text-center">₪{(item.UnitPrice * item.Quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* סיכום עלויות */}
                                    <div className="mt-4 text-lg space-y-1 w-full flex flex-col items-center">
                                        <div className="w-64 bg-gray-100 p-4 rounded-lg shadow">
                                            {/* סה"כ לפני מע"מ */}
                                            <p>סה"כ ללא מע"מ: ₪{(saleDetails.Amount - saleDetails.Items.find(item => item.ItemCatalog === "SUMMARY_VAT")?.UnitPrice || 0).toFixed(2)}</p>

                                            {/* שורת המע"מ */}
                                            {saleDetails.Items.find(item => item.ItemCatalog === "SUMMARY_VAT") && (
                                                <p>מע"מ (18%): ₪{saleDetails.Items.find(item => item.ItemCatalog === "SUMMARY_VAT").UnitPrice.toFixed(2)}</p>
                                            )}

                                            {/* סה"כ כולל */}
                                            <p className="font-bold text-red-600">סה"כ לתשלום: ₪{(saleDetails.Amount).toFixed(2)}</p>
                                        </div>
                                        {saleDetails.DocumentURL && (

                                            <a
                                                href={saleDetails.DocumentURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition"
                                            >
                                                הורד חשבונית PDF
                                            </a>
                                        )}
                                    </div>


                                </div>


                            </div>

                        </>
                    )}

                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
                    >
                        חזור לדף הבית
                    </button>
                </>
            )}
            {verificationStatus === "failed" && (
                <>
                    <h1 className="text-3xl font-bold text-red-600">❌ התשלום נכשל</h1>
                    <p className="text-lg text-gray-700 mt-4">אנא נסה שוב.</p>
                    <button
                        onClick={() => navigate("/cart")}
                        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition"
                    >
                        חזור לעגלה
                    </button>
                </>
            )}
        </div>
    );
};

export default OrderSuccess;
