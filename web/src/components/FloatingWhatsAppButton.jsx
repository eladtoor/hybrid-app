import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // ייבוא ההגדרות של פיירבייס

const FloatingButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #25d366; /* צבע ירוק של וואטסאפ */
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 38px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.3);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }
`;

const FloatingWhatsAppButton = () => {
    const [phoneNumber, setPhoneNumber] = useState(""); // מספר וואטסאפ
    const [whatsappMessage, setWhatsappMessage] = useState(""); // הודעת וואטסאפ

    // פונקציה לשליפת נתוני הוואטסאפ מפיירבייס
    useEffect(() => {
        const fetchWhatsAppDetails = async () => {
            try {
                const docRef = doc(db, "whatsapp", "whatsapp-settings"); // מחליף "default" במפתח שלך
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPhoneNumber(data.whatsappNumber || ""); // שמירת המספר
                    setWhatsappMessage(data.whatsappMessage || ""); // שמירת ההודעה
                } else {
                    console.error("No such document in Firebase!");
                }
            } catch (error) {
                console.error("Error fetching WhatsApp details:", error);
            }
        };

        fetchWhatsAppDetails();
    }, []);

    return (
        <FloatingButton
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                whatsappMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <i className="fab fa-whatsapp"></i>
        </FloatingButton>
    );
};

export default FloatingWhatsAppButton;