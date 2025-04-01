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

    const shouldSkipVerification = false;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("✅ User is logged in:", user);
                setCurrentUser(user);
            } else {
                console.warn("⚠️ No user logged in");
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (shouldSkipVerification) {
            console.warn("⚠️ Skipping verification manually (dev mode)");
            setVerificationStatus("success");

            const purchaseData = {
                purchaseId: "test-" + Date.now(),
                date: new Date().toISOString(),
                status: "completed"
            };

            if (currentUser) {
                const purchasesRef = collection(db, "users", currentUser.uid, "purchases");
                addDoc(purchasesRef, purchaseData);
            }

            dispatch(setCartItems([]));
            saveCartToFirestore([]);
            return;
        }

        const verifyPayment = async () => {
            const privateToken = localStorage.getItem("SalePrivateToken");

            const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
            const totalPrice = parseFloat(localStorage.getItem("finalTotalPrice") || "0");
            const shippingCost = parseFloat(localStorage.getItem("shippingCost") || "0");
            const craneUnloadCost = parseFloat(localStorage.getItem("craneUnloadCost") || "0");

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
                console.log("🔍 Response from SaleDetails:", data);

                if (data.TransactionStatus === 0) {
                    setVerificationStatus("success");

                    const purchaseData = {
                        purchaseId: privateToken,
                        date: new Date().toISOString(),
                        status: "completed",
                        cartItems: storedCart,
                        totalPrice: totalPrice,
                        shippingCost: shippingCost,
                        craneUnloadCost: craneUnloadCost,
                        customer: {
                            firstName: data.CustomerFirstName || "",
                            lastName: data.CustomerLastName || "",
                            email: data.EmailAddress || ""
                        },
                        payments: data.NumOfPayment || 1
                    };

                    if (currentUser) {
                        const purchasesRef = collection(db, "users", currentUser.uid, "purchases");
                        await addDoc(purchasesRef, purchaseData);
                    } else {
                        console.warn("⚠️ No user, purchase not saved.");
                    }

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
