import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { fetchUserDataFromFirestore, updateUserDataInFirestore } from '../utils/userUtils';

const UserProfile = () => {
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

    const getBaseUrl = () => {
        return process.env.REACT_APP_BASE_URL || 'http://localhost:3000/';
    };


    console.log(getBaseUrl());



    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = user || JSON.parse(localStorage.getItem('user'));

                if (storedUser && storedUser.uid) {
                    setFormData(storedUser);
                } else if (user?.uid || storedUser?.uid) {
                    const userId = user?.uid || storedUser.uid;
                    const userData = await fetchUserDataFromFirestore(userId);
                    if (userData) {
                        dispatch(setUser(userData));
                        localStorage.setItem('user', JSON.stringify(userData));
                        setFormData(userData);
                    }
                }
            } catch (error) {
                console.error("שגיאה בטעינת נתוני המשתמש:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, dispatch]);

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

    const handleCopyToClipboard = (link) => {
        navigator.clipboard.writeText(link).then(() => {
            alert("הקישור הועתק ללוח!");
        }).catch((error) => {
            console.error("שגיאה בהעתקת הקישור: ", error);
        });
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
            alert("הנתונים נשמרו בהצלחה.");
        } catch (error) {
            console.error("שגיאה בשמירת נתוני המשתמש: ", error);
        }
    };

    if (loading) return <p>טוען נתונים...</p>;
    if (!formData) return <p>אין נתונים להציג. אנא התחבר.</p>;
    return (
        <div className="max-w-lg mx-auto mt-28 p-6 bg-white shadow-md rounded-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">הפרופיל שלי</h2>
            <div className="bg-gray-100 p-6 rounded-md">
                <p><strong>שם:</strong> {isEditing ? <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="border p-2 rounded-md w-full" /> : formData.name}</p>
                <p><strong>מייל:</strong> {formData.email}</p>
                <p><strong>פלאפון:</strong> {isEditing ? <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="border p-2 rounded-md w-full" /> : formData.phone}</p>

                <div className="mt-4">
                    <p><strong>כתובת:</strong></p>
                    <p><strong>עיר:</strong> {isEditing ? <input type="text" name="city" value={formData.address?.city || ''} onChange={handleAddressChange} className="border p-2 rounded-md w-full" /> : formData.address?.city}</p>
                    <p><strong>רחוב:</strong> {isEditing ? <input type="text" name="street" value={formData.address?.street || ''} onChange={handleAddressChange} className="border p-2 rounded-md w-full" /> : formData.address?.street}</p>
                    <p><strong>דירה:</strong> {isEditing ? <input type="text" name="apartment" value={formData.address?.apartment || ''} onChange={handleAddressChange} className="border p-2 rounded-md w-full" /> : formData.address?.apartment}</p>
                    <p><strong>קומה:</strong> {isEditing ? <input type="text" name="floor" value={formData.address?.floor || ''} onChange={handleAddressChange} className="border p-2 rounded-md w-full" /> : formData.address?.floor}</p>
                    <p><strong>כניסה:</strong> {isEditing ? <input type="text" name="entrance" value={formData.address?.entrance || ''} onChange={handleAddressChange} className="border p-2 rounded-md w-full" /> : formData.address?.entrance}</p>
                </div>

                {/* Referral Link for Agents */}
                {formData.userType === 'סוכן' && (
                    <div className="mt-6 p-4 bg-gray-200 rounded-md">
                        <h3 className="text-lg font-semibold">קישור הזמנה שלך</h3>
                        <p className="text-gray-700">שתף קישור זה כדי להזמין משתמשים:</p>

                        {formData.uid && (
                            <div className="flex items-center justify-between mt-3">
                                <a
                                    href={`${getBaseUrl()}login?ref=agent-${formData.uid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline truncate"
                                >
                                    {`${getBaseUrl()}login?ref=agent-${formData.uid}`}
                                </a>

                                <button
                                    onClick={() => handleCopyToClipboard(`${getBaseUrl()}login?ref=agent-${formData.uid}`)}
                                    className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                                >
                                    העתק קישור
                                </button>
                            </div>
                        )}
                    </div>
                )}




            </div>

            <button onClick={handleEditToggle} className="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition">{isEditing ? "ביטול" : "ערוך"}</button>
            {isEditing && <button onClick={handleSave} className="ml-4 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition">שמור</button>}
        </div>
    );
};

export default UserProfile;
