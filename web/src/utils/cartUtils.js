import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // נוודא שהפיירבייס מוגדר

export const saveCartToFirestore = async (cartItems) => {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  try {
    await setDoc(cartRef, { cartItems });
  } catch (error) {
    console.error("Error saving cart to Firestore:", error);
  }
};

export const loadCartFromFirestore = async () => {
  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  const user = auth.currentUser || userFromStorage;
  console.log(auth);

  if (!user) return [];

  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    return cartSnap.data().cartItems || [];
  } else {
    return [];
  }
};
