import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// שליפת נתוני וואטסאפ
export const getWhatsAppDetails = async (userId) => {
  try {
    const whatsappRef = doc(db, "whatsapp", userId);
    const whatsappDoc = await getDoc(whatsappRef);

    if (whatsappDoc.exists()) {
      return whatsappDoc.data();
    } else {
      return null; // אם אין נתונים
    }
  } catch (error) {
    console.error("Error fetching WhatsApp details:", error);
    throw error;
  }
};

// שמירת נתוני וואטסאפ
export const saveWhatsAppDetails = async (
  userId,
  whatsappNumber,
  whatsappMessage
) => {
  try {
    const whatsappRef = doc(db, "whatsapp", userId);
    const data = {
      whatsappNumber: whatsappNumber || "",
      whatsappMessage: whatsappMessage || "",
    };

    await setDoc(whatsappRef, data);
  } catch (error) {
    console.error("Error saving WhatsApp details:", error);
    throw error;
  }
};
