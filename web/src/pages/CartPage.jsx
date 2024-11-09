import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ייבוא useNavigate
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';
import { increaseQuantity, decreaseQuantity, removeFromCart, setCartItems } from '../redux/slices/cartSlice';
import { loadCartFromFirestore, saveCartToFirestore } from '../utils/cartUtils';
import { auth, db } from '../firebase';
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            navigate('/login'); // אם המשתמש לא מחובר, נעבור לעמוד התחברות
            return;
        }

        const fetchCart = async () => {
            const cartFromFirestore = await loadCartFromFirestore();
            if (cartFromFirestore.length > 0) {
                dispatch(setCartItems(cartFromFirestore));
            }
        };
        fetchCart();
    }, [dispatch, navigate]);

    const handleCheckout = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.warn("No user is logged in. Cannot proceed to checkout.");
            return;
        }

        // הכנת רשימת מוצרים עם המידע הרלוונטי בלבד
        const cartItemsForPurchase = cartItems.map(item => ({
            _id: item._id,
            name: item.שם,
            price: item["מחיר רגיל"] || 0,
            quantity: item.quantity,
            imageUrl: item.תמונות,
            sku: item['מק"ט'],
            category: item.קטגוריות || "לא מוגדר",
        }));

        const purchaseData = {
            purchaseId: `purchase_${Date.now()}`,
            cartItems: cartItemsForPurchase,
            totalPrice: cartItemsForPurchase.reduce((acc, item) => acc + item.price * item.quantity, 0),
            date: new Date().toISOString(),
            status: "pending", // אפשר לעדכן ל"completed" לאחר הצלחת התשלום
        };

        try {
            const purchasesRef = collection(db, "users", user.uid, "purchases");
            await addDoc(purchasesRef, purchaseData);
            console.log("Purchase saved successfully!");

            // איפוס העגלה ב-Redux וב-Firestore
            dispatch(setCartItems([]));
            saveCartToFirestore([]);
        } catch (error) {
            console.error("Error saving purchase:", error);
        }
    };

    const handleIncrease = (_id, quantity) => {
        dispatch(increaseQuantity({ _id, quantity }));
        saveCartToFirestore(cartItems.map(item =>
            item._id === _id ? { ...item, quantity: item.quantity + quantity } : item
        ));
    };

    const handleDecrease = (_id, quantity) => {
        const item = cartItems.find((item) => item._id === _id);
        if (item && item.quantity > quantity) {
            dispatch(decreaseQuantity({ _id, quantity }));
            saveCartToFirestore(cartItems.map(item =>
                item._id === _id ? { ...item, quantity: item.quantity - quantity } : item
            ));
        }
    };

    const handleRemove = (_id) => {
        dispatch(removeFromCart({ _id }));
        saveCartToFirestore(cartItems.filter(item => item._id !== _id));
    };

    const totalPrice = cartItems.reduce((acc, item) => {
        const itemPrice = item["מחיר רגיל"] || 0;
        const itemQuantity = item.quantity || 1;
        return acc + itemPrice * itemQuantity;
    }, 0);

    return (
        <div className="cart-page">
            <h1 className="cart-title">העגלה שלי</h1>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <CartItem
                                key={item._id}
                                item={item}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onRemove={() => handleRemove(item._id)}
                            />
                        ))
                    ) : (
                        <p>העגלה ריקה</p>
                    )}
                </div>
                <div className="vertical-divider"></div>
                <div className="cart-summary">
                    <h2>סיכום הזמנה</h2>
                    <p>סה"כ לתשלום: ₪{totalPrice.toFixed(2)}</p>
                    <p>משלוח: חינם</p>
                    <p>סה"כ כולל משלוח: ₪{totalPrice.toFixed(2)}</p>
                    <button className="checkout-button" onClick={handleCheckout}>מעבר לתשלום</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;