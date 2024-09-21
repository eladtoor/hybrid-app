import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/UserProfile.css';

const UserProfile = () => {
    // נשלוף את נתוני המשתמש מ-Redux
    const user = useSelector((state) => state.user.user);
    console.log("im here", user);

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
