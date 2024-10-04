// userUtils.js
import { doc, getDoc } from "firebase/firestore";
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
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data from Firestore:", error);
    return null;
  }
};
