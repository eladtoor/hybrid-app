import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../reducers/userReducer'; // הפעולה של Redux לשמירת נתונים
import { doc, setDoc } from "firebase/firestore"; // פונקציה לשמירת המידע בפיירבייס
import { db } from '../firebase'; // יצוא Firestore מ- firebase.js
import { useNavigate } from 'react-router-dom';
import '../styles/UserInfoForm.css'; // ייבוא ה-CSS

const UserInfoForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // קבלת המשתמש הנוכחי מ-Redux
    const currentUser = useSelector((state) => state.user.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('current user:', currentUser);


            if (!currentUser || !currentUser.uid) {
                throw new Error("user not authnticated or missing uid")
            }

            // שילוב המידע החדש עם המידע מהמשתמש הנוכחי
            const updatedUser = {
                ...currentUser,  // פרטי המשתמש מ-Google
                name,            // השם שהוכנס בטופס
                phone            // מספר הפלאפון שהוכנס בטופס
            };

            // שמירת המידע ב-Redux
            dispatch(setUser(updatedUser));

            // שמירת המידע בפיירבייס (Firestore)
            const userRef = doc(db, "users", updatedUser.uid); // שימוש ב-UID לשמירה
            await setDoc(userRef, updatedUser);


            console.log("Saved going home");

            // ניתוב לדף הבית לאחר השלמת המידע
            navigate('/');
        } catch (error) {
            console.error("Error saving user info: ", error);
        }
    };

    return (
        <div className="user-info-form">
            <div className="form-container">
                <h2>אנא הזן את שמך ומספר הפלאפון</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>שם:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>מספר פלאפון:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">המשך</button>
                </form>
            </div>
        </div>
    );
};

export default UserInfoForm;