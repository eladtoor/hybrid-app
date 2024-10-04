import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer'; // ייבוא setUser עבור שחזור הנתונים
import { fetchUserDataFromFirestore } from '../utils/userUtils';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const [loading, setLoading] = useState(true); // מצב לטעינה
    const dispatch = useDispatch();

    // נשלוף את המשתמש מ-Redux, או מ-localStorage אם קיים
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        // אם אין נתונים ב-Redux אבל יש ב-localStorage, נעדכן את ה-Redux
        if (!user && localStorage.getItem('user')) {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            dispatch(setUser(storedUser));
        }

        // שליפת נתונים מ-Firestore
        const fetchUserData = async () => {
            if (user && user.uid) {
                const userData = await fetchUserDataFromFirestore(user.uid);
                if (userData) {
                    // עדכון Redux
                    dispatch(setUser(userData));
                    // עדכון localStorage
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, [user, dispatch]);

    if (loading) {
        return <p>טוען נתונים...</p>;
    }

    if (!user) {
        return <p>אין נתונים להציג. אנא התחבר.</p>;
    }

    return (
        <div className="user-profile-container">
            <h2>הפרופיל שלי</h2>
            <div className="user-info">
                <p><strong>שם:</strong> {user.name}</p>
                <p><strong>מייל:</strong> {user.email}</p>
                <p><strong>פלאפון:</strong> {user.phone}</p>
            </div>
        </div>
    );
};

export default UserProfile;