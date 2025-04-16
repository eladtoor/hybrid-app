import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserInfoForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [apartment, setApartment] = useState('');
    const [floor, setFloor] = useState('');
    const [entrance, setEntrance] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();
    const [currentUser, setCurrentUser] = useState(null);

    // ✅ טוען את המשתמש מ־Firebase Authentication לאחר שהדף נטען
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreeToTerms) {
            setError("יש לאשר את תנאי השימוש לפני ההמשך.");
            return;
        }

        if (!currentUser) {
            setError("שגיאה: המשתמש לא מחובר. נסה שוב.");
            return;
        }

        try {
            const updatedUser = {
                uid: currentUser.uid,
                email: currentUser.email,
                name: name || "",
                phone: phone || "",
                address: {
                    city: city,
                    street: street,
                    apartment: apartment,
                    floor: floor,
                    entrance: entrance
                },
                userType: "רגיל",
                termsAndConditions: true // ✅ הוספת השדה לפיירבייס
            };

            // ✅ שמירת המשתמש ברדוסר
            dispatch(setUser(updatedUser));
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // ✅ שמירת המשתמש ב־Firestore
            const userRef = doc(db, "users", updatedUser.uid);
            await setDoc(userRef, updatedUser, { merge: true });

            navigate('/');
        } catch (error) {
            console.error("Error saving user info: ", error);
            setError("שגיאה בלתי צפויה, נסה שוב.");
        }
    };


    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center mt-20">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">אנא הזן את פרטיך</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-gray-700">שם:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded-md" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">מספר פלאפון:</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="border p-2 rounded-md" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">עיר:</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="border p-2 rounded-md" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700">רחוב:</label>
                        <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required className="border p-2 rounded-md" />
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="text-gray-700">דירה:</label>
                            <input type="text" value={apartment} onChange={(e) => setApartment(e.target.value)} className="border p-2 rounded-md w-full" />
                        </div>
                        <div className="flex-1">
                            <label className="text-gray-700">קומה:</label>
                            <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} className="border p-2 rounded-md w-full" />
                        </div>
                        <div className="flex-1">
                            <label className="text-gray-700">כניסה:</label>
                            <input type="text" value={entrance} onChange={(e) => setEntrance(e.target.value)} className="border p-2 rounded-md w-full" />
                        </div>
                    </div>

                    {/* 🔹 Checkbox להסכמה לתנאים */}
                    <div className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="w-5 h-5 ml-3"
                        />
                        <label className="text-gray-700 mb-1">
                            אני מסכים ל
                            <a href="/terms-privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                תנאים והגבלות
                            </a>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button type="submit" className="bg-blue-600 text-white py-2 rounded-md w-full hover:bg-blue-700 transition">
                        המשך
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserInfoForm;
