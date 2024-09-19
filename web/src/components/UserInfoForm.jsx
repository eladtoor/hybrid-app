import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/UserInfoForm.css';

const UserInfoForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {



            if (!currentUser || !currentUser.uid) {
                throw new Error("user not authnticated or missing uid")
            }

            // שילוב המידע החדש עם המידע מהמשתמש הנוכחי
            const updatedUser = {
                ...currentUser,
                name: name || currentUser.name,  // אם הוזן שם חדש, עדכן, אחרת שמור את הקיים
                phone: phone || currentUser.phone // אם הוזן טלפון חדש, עדכן, אחרת שמור את הקיים
            };

            // שמירת המידע ב-Redux
            dispatch(setUser({ ...currentUser, name, phone }));

            //שמירת המידע בלוקל סוטרייג'

            localStorage.setItem('user', JSON.stringify(updatedUser));

            // עדכון המידע ב-localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // עדכון Firestore
            const userRef = doc(db, "users", updatedUser.uid);
            await setDoc(userRef, updatedUser);

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
