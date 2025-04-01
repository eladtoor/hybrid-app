import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';
import { increaseQuantity, decreaseQuantity, removeFromCart, setCartItems } from '../redux/slices/cartSlice';
import { loadCartFromFirestore, saveCartToFirestore } from '../utils/cartUtils';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import ConfirmationModal from "../components/ConfirmationModal";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const user = useSelector((state) => state.user.user);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [materialGroups, setMaterialGroups] = useState([]);
    const [transportationCosts, setTransportationCosts] = useState(0);
    const [progressData, setProgressData] = useState({});
    const [cartDiscount, setCartDiscount] = useState(0);
    const [errorMessage, setErrorMessage] = useState(""); // New state for errors
    const fullName = user?.name || "לקוח אנונימי";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "לקוח";
    const lastName = nameParts.length > 1
        ? nameParts.slice(1).join(" ")
        : " "; // 👈 שדה חובה – אבל נשלח רווח אם אין שם משפחה
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    const [temporaryAddress, setTemporaryAddress] = useState({
        city: '',
        street: '',
        apartment: '',
        floor: '',
        entrance: ''
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setIsAuthenticated(true);

                // Reset the cart when user logs in
                dispatch(setCartItems([]));

                // Load new user's cart
                const cartFromFirestore = await loadCartFromFirestore();
                dispatch(setCartItems(cartFromFirestore));
            } else {
                setIsAuthenticated(false);
                navigate('/login');

                // Clear the cart on logout
                dispatch(setCartItems([]));
            }
        });

        return () => unsubscribe();
    }, [navigate, dispatch]);


    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    if (userData.address) {
                        setTemporaryAddress({
                            city: userData.address.city || '',
                            street: userData.address.street || '',
                            apartment: userData.address.apartment || '',
                            floor: userData.address.floor || '',
                            entrance: userData.address.entrance || ''
                        });
                    }
                    if (userData.referredBy) {
                        const agentRef = doc(db, "users", userData.referredBy);
                        const agentSnap = await getDoc(agentRef);
                        if (agentSnap.exists()) {
                            const agentData = agentSnap.data();
                            setCartDiscount(agentData.cartDiscount || 0);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user data from Firestore:", error);
            }
        };

        const fetchCart = async () => {
            const cartFromFirestore = await loadCartFromFirestore();

            if (cartFromFirestore.length > 0) {
                dispatch(setCartItems(cartFromFirestore));
            }
        };

        const fetchMaterialGroups = async () => {
            try {
                const response = await fetch('/api/materialGroups');
                const data = await response.json();
                setMaterialGroups(data);
            } catch (error) {
                console.error('Error fetching material groups:', error);
            }
        };

        fetchUserData();
        fetchCart();
        fetchMaterialGroups();

    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (materialGroups.length > 0) {
            const groupTotals = {};
            let totalTransportationCosts = 0;

            materialGroups.forEach((group) => {
                groupTotals[group.groupName] = 0;
            });

            cartItems.forEach((item) => {
                if (groupTotals[item.materialGroup] !== undefined) {
                    groupTotals[item.materialGroup] += item.unitPrice * item.quantity;
                }
            });

            const progress = {};
            materialGroups.forEach((group) => {
                const totalInCart = groupTotals[group.groupName];
                const percentage = Math.min((totalInCart / group.minPrice) * 100, 100);

                if (totalInCart > 0 && percentage < 100) {
                    totalTransportationCosts += group.transportationPrice;
                }
                progress[group.groupName] = {
                    totalInCart,
                    minPrice: group.minPrice,
                    percentage,
                };
            });

            setProgressData(progress);
            setTransportationCosts(totalTransportationCosts);
        }
    }, [materialGroups, cartItems]);

    const handleCheckout = async () => {
        if (!isAuthenticated) return;

        // יצירת פרטי הזמנה – אבל לא נשמור אותם עדיין
        const purchaseData = {
            purchaseId: `${Date.now()}`,
            cartItems: cartItems.map(item => ({
                _id: item._id,
                sku: item['מק"ט'] || "לא זמין",
                name: item.שם || "לא זמין",
                quantity: item.quantity || 1,
                price: item.unitPrice || 0,
                comment: item.comment || "",
                selectedAttributes: item.selectedAttributes || {} // ✅ חשוב!

            })),
            totalPrice: finalTotalPrice,
            shippingCost: transportationCosts, // ✅ מחיר משלוח
            craneUnloadCost: craneUnloadFee,   // ✅ תוספת מנוף
            date: new Date().toISOString(),
            status: "pending",
            shippingAddress: temporaryAddress,
        };




        try {
            if (user?.isCreditLine) {
                // ✅ משתמש קו אשראי → דלג על התשלום והעבר ישירות לאישור
                navigate("/order-confirmation", { state: { orderData: purchaseData } });
            } else {
                // ✅ משתמש רגיל → שלח לתשלום ב-iCredit
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                localStorage.setItem("finalTotalPrice", finalTotalPrice.toString());
                localStorage.setItem("shippingCost", transportationCosts.toString());
                localStorage.setItem("craneUnloadCost", craneUnloadFee.toString());
                await handlePayment(purchaseData);
            }
        } catch (error) {
            console.error("Error initiating checkout:", error);
        }
    };




    const handlePayment = async (purchaseData) => {
        const groupPrivateToken = "f5bff741-1243-411e-9f7d-6b91d7624345";

        // ✅ יצירת רשימת פריטים להזמנה עם תיאור מאפיינים אם קיימים
        let items = purchaseData.cartItems.map(item => {
            const name = item.name || "מוצר ללא שם";
            const sku = item[`מק"ט`] || item.sku || "לא זמין";

            // ✨ בניית תיאור מאפיינים בצורה קריאה בשורה אחת
            let attributesDescription = '';
            if (item.selectedAttributes && typeof item.selectedAttributes === 'object') {
                const attributePairs = Object.entries(item.selectedAttributes).map(
                    ([key, value]) => `${key}: ${value}`
                );
                attributesDescription = attributePairs.join(' | ');
            }

            // 👑 תיאור סופי קריא ובלי ירידת שורה
            const fullDescription = attributesDescription
                ? `${name} : ${attributesDescription}`
                : `${name} `;

            return {
                CatalogNumber: sku,
                Quantity: item.quantity,
                UnitPrice: item.price,
                Description: fullDescription
            };
        });






        // ✅ הוספת מחיר משלוח אם קיים
        if (purchaseData.shippingCost && purchaseData.shippingCost > 0) {
            items.push({
                CatalogNumber: "SHIPPING",
                Quantity: 1,
                UnitPrice: purchaseData.shippingCost,
                Description: "משלוח"
            });
        }

        // ✅ הוספת עלות פריקת מנוף אם קיימת
        if (purchaseData.craneUnloadCost && purchaseData.craneUnloadCost > 0) {
            items.push({
                CatalogNumber: "CRANE_UNLOAD",
                Quantity: 1,
                UnitPrice: purchaseData.craneUnloadCost,
                Description: "פריקת מנוף"
            });
        }

        const requestData = {
            GroupPrivateToken: groupPrivateToken,
            Items: items,
            Currency: 1, // ש"ח
            SaleType: 1, // עסקה מיידית
            RedirectURL: `${window.location.origin}/order-success`,
            FailRedirectURL: `${window.location.origin}/cart`,
            IPNURL: `${window.location.origin}/api/payment-ipn`,
            CustomerFirstName: firstName,
            CustomerLastName: lastName,
            EmailAddress: user?.email || "guest@example.com"
        };

        console.log("📤 Sending payment request:", requestData);

        try {
            const response = await fetch("http://localhost:5000/api/payment/create-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("🔍 iCredit Response on Create Payment:", data);

            if (data.success && data.paymentUrl) {
                localStorage.setItem("SalePrivateToken", data.salePrivateToken); // ✅ שמור את זה!

                window.location.href = data.paymentUrl;

            } else {
                console.error("❌ שגיאה בקבלת URL לתשלום:", data);
                setErrorMessage("❌ שגיאה בהפנייתך לתשלום. נסה שוב.");
            }
        } catch (error) {
            console.error("❌ שגיאה בהתחברות לשרת:", error);
            setErrorMessage("❌ שגיאה בלתי צפויה. נסה שוב מאוחר יותר.");
        }
    };






    const handleCheckoutClick = () => {
        if (cartItems.length === 0) {
            setErrorMessage("❌ שים לב העגלה ריקה!");

            // Clear error message after 5 seconds
            setTimeout(() => setErrorMessage(""), 5000);
            return;
        }
        if (user?.isCreditLine) {
            setIsModalOpen(true); // Open confirmation modal for CreditLine users
        } else {
            handleCheckout(); // Proceed directly for regular users
        }
    };

    const handleConfirmOrder = () => {
        setIsModalOpen(false);
        handleCheckout(); // Complete order if user confirms
    };

    const handleCancelOrder = () => {
        setIsModalOpen(false); // Close modal
    };

    const handleEditAddressToggle = () => {
        setIsEditingAddress(!isEditingAddress);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setTemporaryAddress((prev) => ({ ...prev, [name]: value }));
    };

    const saveTemporaryAddressToFirestore = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const cartRef = doc(db, "carts", currentUser.uid);
            const existingCart = (await loadCartFromFirestore()) || [];

            await setDoc(cartRef, {
                cartItems: existingCart,
                cartAddress: temporaryAddress
            }, { merge: true });

            setIsEditingAddress(false);
        } catch (error) {
            console.error("Error saving temporary address to Firestore:", error);
        }
    };

    const handleIncrease = (cartItemId, amount = 1) => {
        dispatch(increaseQuantity({ cartItemId, amount }));
        saveCartToFirestore(
            cartItems.map((item) =>
                item.cartItemId === cartItemId
                    ? { ...item, quantity: item.quantity + amount }
                    : item
            )
        );
    };

    const handleDecrease = (cartItemId, amount = 1) => {
        const item = cartItems.find((item) => item.cartItemId === cartItemId);
        if (item && item.quantity > amount) {
            dispatch(decreaseQuantity({ cartItemId, amount }));
            saveCartToFirestore(
                cartItems.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity - amount }
                        : item
                )
            );
        } else {
            handleRemove(cartItemId);
        }
    };

    const handleRemove = (cartItemId) => {
        dispatch(removeFromCart({ cartItemId }));
        saveCartToFirestore(cartItems.filter((item) => item.cartItemId !== cartItemId));
    };

    const originalTotalPrice = cartItems.reduce((acc, item) => {
        const itemPrice = item.unitPrice || 0;
        const itemQuantity = item.quantity || 1;
        return acc + itemPrice * itemQuantity;
    }, 0);
    const craneUnloadFee = cartItems.some(item =>
        item.materialGroup === "Gypsum and Tracks" && item.craneUnload
    ) ? 250 : 0;


    const finalTotalPrice = originalTotalPrice - (originalTotalPrice * cartDiscount) / 100 + transportationCosts + craneUnloadFee;

    return (
        <div className="cart-page p-10">
            <h1 className="cart-title section-title-rtl mt-24">העגלה שלי</h1>
            <div className="cart-container">
                <div className="cart-items  ">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem
                                key={item.cartItemId}

                                item={item}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={() => handleRemove(item.cartItemId)}
                            />
                        ))
                    ) : (
                        <h2>העגלה ריקה</h2>
                    )}
                </div>
                <div className="vertical-divider"></div>
                <div className="cart-summary-container">
                    <div className="progress-ticket">
                        <h2>השג 100% בכל קבוצת חומרים לקבלת הובלה חינם!</h2>
                        {materialGroups.map((group) => {
                            const progress = progressData[group.groupName] || { totalInCart: 0, percentage: 0 };
                            const remainingAmount = Math.max(group.minPrice - progress.totalInCart, 0);
                            return (
                                <div key={group.groupName} className="progress-group">
                                    <h3>
                                        {group.groupName === 'Colors and Accessories' && 'צבעים ומוצרים נלווים'}
                                        {group.groupName === 'Powders' && 'אבקות (דבקים וטייח)'}
                                        {group.groupName === 'Gypsum and Tracks' && 'גבס ומסלולים'}
                                    </h3>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar bg-primary"
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                        <span className="progress-percentage">
                                            {Math.floor(progress.percentage)}%
                                        </span>
                                    </div>
                                    {progress.totalInCart > 0 ? (
                                        <p className="add-more-text">
                                            {progress.percentage < 100
                                                ? `הוסף ${remainingAmount}₪ להובלה חינם (משלוח: ${group.transportationPrice}₪)`
                                                : 'הובלה חינם!'}
                                        </p>
                                    ) : (
                                        <p className="add-more-text">אין מוצרים מקבוצה זו בעגלה</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h2 >סיכום הזמנה</h2>
                        <p>סה"כ מוצרים לפני הנחה: ₪{originalTotalPrice.toFixed(2)}</p>
                        {cartDiscount > 0 && (
                            <p>
                                <strong>הנחת עגלה (%{cartDiscount}):</strong> ₪{(originalTotalPrice * cartDiscount / 100).toFixed(2)}
                            </p>
                        )}
                        <p>מחיר משלוח: ₪{transportationCosts.toFixed(2)}</p>

                        {craneUnloadFee > 0 && (
                            <p style={{ color: "red", fontWeight: "bold" }}>תוספת פריקת מנוף: ₪250</p>
                        )}
                        <p>סה"כ כולל הנחה ומשלוח: ₪{finalTotalPrice.toFixed(2)}</p>
                        {/* MODAL FOR CREDIT USERS */}
                        {isModalOpen && (
                            <ConfirmationModal
                                cartItems={cartItems}
                                finalTotalPrice={finalTotalPrice}
                                onConfirm={handleConfirmOrder}
                                onCancel={handleCancelOrder}
                            />
                        )}
                        <button className="btn-outline text-lg m-2" onClick={handleCheckoutClick}>{user?.isCreditLine ? 'סיום הזמנה' : 'מעבר לתשלום'}</button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="address-card modal-form">
                        <h3>כתובת למשלוח</h3>
                        {isEditingAddress ? (
                            <div className="modal-form">
                                <input
                                    type="text"
                                    name="city"
                                    value={temporaryAddress.city}
                                    placeholder="עיר"
                                    onChange={handleAddressChange}
                                />
                                <input
                                    type="text"
                                    name="street"
                                    value={temporaryAddress.street}
                                    placeholder="רחוב"
                                    onChange={handleAddressChange}
                                />
                                <input
                                    type="text"
                                    name="apartment"
                                    value={temporaryAddress.apartment}
                                    placeholder="דירה"
                                    onChange={handleAddressChange}
                                />
                                <input
                                    type="text"
                                    name="floor"
                                    value={temporaryAddress.floor}
                                    placeholder="קומה"
                                    onChange={handleAddressChange}
                                />
                                <input
                                    type="text"
                                    name="entrance"
                                    value={temporaryAddress.entrance}
                                    placeholder="כניסה"
                                    onChange={handleAddressChange}
                                />
                                <button onClick={saveTemporaryAddressToFirestore} className="btn-primary text-lg m-2">
                                    שמור כתובת
                                </button>
                            </div>
                        ) : (
                            <div className="address-details">
                                <p>עיר: {temporaryAddress.city || 'לא זמין'}</p>
                                <p>רחוב: {temporaryAddress.street || 'לא זמין'}</p>
                                <p>דירה: {temporaryAddress.apartment || 'לא זמין'}</p>
                                <p>קומה: {temporaryAddress.floor || 'לא זמין'}</p>
                                <p>כניסה: {temporaryAddress.entrance || 'לא זמין'}</p>
                                <button onClick={handleEditAddressToggle} className="btn-outline text-lg m-2 ">
                                    ערוך כתובת
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
