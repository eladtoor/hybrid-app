import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');        // עיר
    const [street, setStreet] = useState('');    // רחוב
    const [apartment, setApartment] = useState(''); // דירה
    const [floor, setFloor] = useState('');      // קומה
    const [entrance, setEntrance] = useState(''); // כניסה
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!currentUser || !currentUser.uid) {
                throw new Error("user not authenticated or missing uid");
            }

            const updatedUser = {
                ...currentUser,
                name: name || currentUser.name,
                phone: phone || currentUser.phone,
                address: {
                    city: city,
                    street: street,
                    apartment: apartment,
                    floor: floor,
                    entrance: entrance
                },
                userType: "רגיל"
            };

            // שמירת המידע ב-Redux
            dispatch(setUser(updatedUser));

            // שמירת המידע ב-Local Storage
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
                    <button type="submit" className="bg-blue-600 text-white py-2 rounded-md w-full hover:bg-blue-700 transition">המשך</button>
                </form>
            </div>
        </div>
    );

};

export default UserInfoForm;