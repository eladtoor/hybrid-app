import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; // ✅ יבוא של פונקציית המעקב אחרי המשתמש
import { useDispatch } from "react-redux";
import { setCartItems } from "../redux/slices/cartSlice";
import { saveCartToFirestore } from '../utils/cartUtils';


const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [verificationStatus, setVerificationStatus] = useState("pending");
    const [currentUser, setCurrentUser] = useState(null); // ✅ נוסיף משתנה לשמירת המשתמש

    useEffect(() => {
        // ✅ מעקב אחרי התחברות המשתמש
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("✅ User is logged in:", user);
                setCurrentUser(user);
            } else {
                console.warn("⚠️ No user logged in");
                setCurrentUser(null);
            }
        });

        return () => unsubscribe(); // ✅ נבטל את המאזין כשהקומפוננטה תתפרק
    }, []);

    useEffect(() => {
        const isTestEnv = window.location.origin.includes("localhost") || window.location.href.includes("testicredit");

        if (isTestEnv) {
            console.warn("⚠️ Running in Test mode – skipping payment verification.");
            setVerificationStatus("success");

            const purchaseData = {
                purchaseId: "test-" + Date.now(),
                date: new Date().toISOString(),
                status: "completed"
            };

            if (currentUser) { // ✅ נבדוק אם המשתמש מחובר לפני שמירת ההזמנה
                const purchasesRef = collection(db, "users", currentUser.uid, "purchases");
                addDoc(purchasesRef, purchaseData);
            }

            dispatch(setCartItems([])); // ✅ ניקוי העגלה
            saveCartToFirestore([]);
            return;
        }

        const verifyPayment = async () => {
            const urlParams = new URLSearchParams(location.search);
            const publicSaleToken = urlParams.get("Token");

            console.log("🔍 Checking PublicSaleToken:", publicSaleToken);

            if (!publicSaleToken) {
                console.error("❌ PublicSaleToken is missing in URL.");
                setVerificationStatus("failed");
                return;
            }

            const saleDetailsData = { SalePrivateToken: publicSaleToken };

            try {
                const response = await fetch("http://localhost:5000/api/payment/sale-details", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(saleDetailsData)
                });

                const data = await response.json();
                console.log("🔍 Response from Server SaleDetails:", data);

                if (data.TransactionStatus === 0) { // 0 = עסקה מאושרת לפי ה-API
                    setVerificationStatus("success");

                    const purchaseData = {
                        purchaseId: publicSaleToken,
                        date: new Date().toISOString(),
                        status: "completed"
                    };

                    if (currentUser) { // ✅ נבדוק שוב אם המשתמש מחובר לפני שמירת ההזמנה
                        const purchasesRef = collection(db, "users", currentUser.uid, "purchases");
                        await addDoc(purchasesRef, purchaseData);
                    } else {
                        console.warn("⚠️ לא ניתן לשמור את הרכישה כי המשתמש לא מחובר.");
                    }

                    dispatch(setCartItems([])); // ✅ ניקוי העגלה

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
    }, [location, dispatch, currentUser]); // ✅ הוספת `currentUser` כתלות כדי לוודא שהוא נטען

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
//4580000000000001
export default OrderSuccess;
