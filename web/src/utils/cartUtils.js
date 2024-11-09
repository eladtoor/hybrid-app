import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const saveCartToFirestore = async (cartItems) => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No user is logged in. Cannot save cart to Firestore.");
    return;
  }

  const cartRef = doc(db, "carts", user.uid);
  try {
    await setDoc(cartRef, { cartItems });
    console.log("Cart saved successfully to Firestore.");
  } catch (error) {
    console.error("Error saving cart to Firestore:", error);
  }
};

export const loadCartFromFirestore = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No user is logged in. Cannot load cart from Firestore.");
    return [];
  }

  const cartRef = doc(db, "carts", user.uid);
  try {
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      console.log("Cart loaded successfully from Firestore.");
      return cartSnap.data().cartItems || [];
    } else {
      console.log("No cart data found for the user in Firestore.");
      return [];
    }
  } catch (error) {
    console.error("Error loading cart from Firestore:", error);
    return [];
  }
};
