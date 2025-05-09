// userUtils.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; // ייבוא החיבור ל-Firebase Firestore

// פונקציה לשליפת נתוני המשתמש מה-Firestore
export const fetchUserDataFromFirestore = async (uid) => {
  if (!uid) {
    console.error("UID is missing. Cannot fetch user data.");
    return null;
  }

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data(); // החזרת נתוני המשתמש
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
    return null;
  }
};

// פונקציה לעדכון נתוני המשתמש ב-Firestore
export const updateUserDataInFirestore = async (uid, updatedData) => {
  if (!uid || !updatedData) {
    console.error("UID or updated data is missing. Cannot update user data.");
    return;
  }

  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, updatedData, { merge: true }); // שמירה עם merge כדי לעדכן את הנתונים הקיימים
  } catch (error) {
    console.error("Error updating user data in Firestore:", error);
  }
};
