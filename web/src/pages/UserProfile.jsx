import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { fetchUserDataFromFirestore, updateUserDataInFirestore } from '../utils/userUtils';
import { User } from 'lucide-react';

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

    if (loading) return <p className="text-center mt-20 text-gray-700 text-lg">טוען נתונים...</p>;
    if (!formData) return <p className="text-center mt-20 text-gray-700 text-lg">אין נתונים להציג. אנא התחבר.</p>;

    return (
        <div className="profile-card mb-32 font-sans">
            <div className="profile-content text-center">
                <div className="flex justify-center items-center gap-4 mb-6">
                    <User className="w-10 h-10 text-primary animate-bounce" />
                    <h2 className="text-4xl font-extrabold text-gray-900 border-b-4 border-primary inline-block tracking-wide">הפרופיל שלי</h2>
                </div>
                <div className="bg-gradient-to-br from-gray-100 via-white to-gray-200 p-8 rounded-3xl shadow-2xl">
                    <p className="text-lg mb-2"><strong>שם:</strong> {isEditing ? <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="profile-input" /> : formData.name}</p>
                    <p className="text-lg mb-2"><strong>מייל:</strong> {formData.email}</p>
                    <p className="text-lg mb-2"><strong>פלאפון:</strong> {isEditing ? <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="profile-input" /> : formData.phone}</p>

                    <div className="mt-6">
                        <p className="text-xl font-semibold mb-4">כתובת</p>
                        <p className="text-lg mb-2"><strong>עיר:</strong> {isEditing ? <input type="text" name="city" value={formData.address?.city || ''} onChange={handleAddressChange} className="profile-input" /> : formData.address?.city}</p>
                        <p className="text-lg mb-2"><strong>רחוב:</strong> {isEditing ? <input type="text" name="street" value={formData.address?.street || ''} onChange={handleAddressChange} className="profile-input" /> : formData.address?.street}</p>
                        <p className="text-lg mb-2"><strong>דירה:</strong> {isEditing ? <input type="text" name="apartment" value={formData.address?.apartment || ''} onChange={handleAddressChange} className="profile-input" /> : formData.address?.apartment}</p>
                        <p className="text-lg mb-2"><strong>קומה:</strong> {isEditing ? <input type="text" name="floor" value={formData.address?.floor || ''} onChange={handleAddressChange} className="profile-input" /> : formData.address?.floor}</p>
                        <p className="text-lg mb-2"><strong>כניסה:</strong> {isEditing ? <input type="text" name="entrance" value={formData.address?.entrance || ''} onChange={handleAddressChange} className="profile-input" /> : formData.address?.entrance}</p>
                    </div>

                    {formData.userType === 'סוכן' && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 rounded-xl shadow-md">
                            <h3 className="text-lg font-semibold mb-2">קישור הזמנה שלך</h3>
                            <p className="text-gray-700">שתף קישור זה כדי להזמין משתמשים:</p>

                            {formData.uid && (
                                <div className="flex items-center justify-between mt-4">
                                    <a
                                        href={`${window.location.origin}/login?ref=agent-${formData.uid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline truncate text-sm"
                                    >
                                        {`${window.location.origin}/login?ref=agent-${formData.uid}`}
                                    </a>

                                    <button
                                        onClick={() => handleCopyToClipboard(`${window.location.origin}/login?ref=agent-${formData.uid}`)}
                                        className="btn-primary"
                                    >
                                        העתק קישור
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 profile-button mt-8">
                    <button onClick={handleEditToggle} className="btn-outline text-lg px-8">{isEditing ? "ביטול" : "ערוך"}</button>
                    {isEditing && <button onClick={handleSave} className="btn-primary text-lg px-8">שמור</button>}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
