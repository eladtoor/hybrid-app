import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import '../styles/CartPage.css';
import { increaseQuantity, decreaseQuantity, removeFromCart, setCartItems } from '../redux/slices/cartSlice';
import { loadCartFromFirestore, saveCartToFirestore } from '../utils/cartUtils';
import { auth, db } from '../firebase';
import { collection, addDoc, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const user = useSelector((state) => state.user.user);
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
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                // Fetch user's address from Firestore
                const userRef = doc(db, "users", currentUser.uid);
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

        fetchUserData();
        fetchCart();
    }, [dispatch, navigate]);

    const handleCheckout = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.warn("No user is logged in. Cannot proceed to checkout.");
            return;
        }

        const cartItemsForPurchase = cartItems.map(item => ({
            _id: item._id,
            name: item.שם,
            price: item.unitPrice || 0,
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
            status: "pending",
            shippingAddress: temporaryAddress
        };

        try {
            const purchasesRef = collection(db, "users", currentUser.uid, "purchases");
            await addDoc(purchasesRef, purchaseData);
            dispatch(setCartItems([]));
            saveCartToFirestore([]);
        } catch (error) {
            console.error("Error saving purchase:", error);
        }
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

            console.log("Temporary address saved to Firestore under carts.");
            setIsEditingAddress(false);
        } catch (error) {
            console.error("Error saving temporary address to Firestore:", error);
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
        const itemPrice = item.unitPrice || 0;
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
                <div className="cart-summary-container">
                    <div className="cart-summary">
                        <h2>סיכום הזמנה</h2>
                        <p>סה"כ לתשלום: ₪{totalPrice.toFixed(2)}</p>
                        <p>משלוח: חינם</p>
                        <p>סה"כ כולל משלוח: ₪{totalPrice.toFixed(2)}</p>
                        <button className="checkout-button" onClick={handleCheckout}>מעבר לתשלום</button>
                    </div>
                    <div className="address-card">
                        <h3>כתובת למשלוח</h3>
                        {isEditingAddress ? (
                            <div className="address-form">
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
                                <button onClick={saveTemporaryAddressToFirestore} className="save-address-button">
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
                                <button onClick={handleEditAddressToggle} className="edit-address-button">
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
