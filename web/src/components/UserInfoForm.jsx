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
        <div className="user-info-form">
            <div className="form-container">
                <h2>אנא הזן את פרטיך</h2>
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
                    <div className="form-group">
                        <label>עיר:</label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>רחוב:</label>
                        <input
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            required
                        />
                    </div>
                    <div className='address-row'>
                        <div className="form-group">
                            <label>דירה:</label>
                            <input
                                type="text"
                                value={apartment}
                                onChange={(e) => setApartment(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>קומה:</label>
                            <input
                                type="text"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>כניסה:</label>
                            <input
                                type="text"
                                value={entrance}
                                onChange={(e) => setEntrance(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">המשך</button>
                </form>
            </div>
        </div>
    );
};

export default UserInfoForm;