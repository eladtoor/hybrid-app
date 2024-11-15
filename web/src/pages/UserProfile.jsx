import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { fetchUserDataFromFirestore, updateUserDataInFirestore } from '../utils/userUtils';
import '../styles/UserProfile.css';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = user || JSON.parse(localStorage.getItem('user'));

                if (storedUser && storedUser.uid) {
                    setFormData(storedUser);
                } else if (user?.uid || storedUser?.uid) {
                    // נוודא שיש UID זמין
                    const userId = user?.uid || storedUser.uid;
                    const userData = await fetchUserDataFromFirestore(userId);
                    if (userData) {
                        dispatch(setUser(userData));
                        localStorage.setItem('user', JSON.stringify(userData));
                        setFormData(userData);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, dispatch]); // נוודא שהקריאה מתבצעת רק אם המשתמש ב-Redux מתעדכן

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing && formData) {
            setFormData({ ...formData });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            address: {
                ...prevData?.address,
                [name]: value
            }
        }));
    };

    const handleSave = async () => {
        const currentUser = user || JSON.parse(localStorage.getItem('user'));

        if (!currentUser || !currentUser.uid) {
            alert("שגיאה: לא ניתן לשמור נתונים ללא חיבור משתמש.");
            return;
        }

        try {
            await updateUserDataInFirestore(currentUser.uid, formData);
            dispatch(setUser(formData));
            localStorage.setItem('user', JSON.stringify(formData));
            setIsEditing(false);
            alert("הנתונים נשמרו בהצלחה");
        } catch (error) {
            console.error("Error saving user data: ", error);
        }
    };

    if (loading) return <p>טוען נתונים...</p>;
    if (!formData) return <p>אין נתונים להציג. אנא התחבר.</p>;

    return (
        <div className="user-profile-container">
            <h2>הפרופיל שלי</h2>
            <div className="user-info">
                <p><strong>שם:</strong> {isEditing ? <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /> : formData.name}</p>
                <p><strong>מייל:</strong> {formData.email}</p>
                <p><strong>פלאפון:</strong> {isEditing ? <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} /> : formData.phone}</p>

                <div>
                    <p><strong>כתובת:</strong></p>
                    <p><strong>עיר:</strong> {isEditing ? <input type="text" name="city" value={formData.address?.city || ''} onChange={handleAddressChange} /> : formData.address?.city}</p>
                    <p><strong>רחוב:</strong> {isEditing ? <input type="text" name="street" value={formData.address?.street || ''} onChange={handleAddressChange} /> : formData.address?.street}</p>
                    <p><strong>דירה:</strong> {isEditing ? <input type="text" name="apartment" value={formData.address?.apartment || ''} onChange={handleAddressChange} /> : formData.address?.apartment}</p>
                    <p><strong>קומה:</strong> {isEditing ? <input type="text" name="floor" value={formData.address?.floor || ''} onChange={handleAddressChange} /> : formData.address?.floor}</p>
                    <p><strong>כניסה:</strong> {isEditing ? <input type="text" name="entrance" value={formData.address?.entrance || ''} onChange={handleAddressChange} /> : formData.address?.entrance}</p>
                </div>
            </div>

            <button onClick={handleEditToggle}>{isEditing ? "ביטול" : "ערוך"}</button>
            {isEditing && <button onClick={handleSave}>שמור</button>}
        </div>
    );
};

export default UserProfile;