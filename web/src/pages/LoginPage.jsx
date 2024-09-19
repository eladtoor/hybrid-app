import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // ייבוא של אייקון גוגל

import '../styles/LoginPage.css';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;

                // יצירת אובייקט מלא עם המידע מגוגל
                const fullUser = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,  // המייל מגוגל
                    name: "",  // שם ריק עד שהמשתמש יזין
                    phone: ""  // טלפון ריק עד שהמשתמש יזין
                };

                // שמירת המידע המלא ב-Redux
                dispatch(setUser(fullUser));

                // שמירת המידע ב-localStorage
                localStorage.setItem('user', JSON.stringify(fullUser));

                navigate('/user-info');
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error.message);
            });
    };

    return (
        <div className="login-page">
            <h2>המשך באמצעות</h2>
            <button onClick={handleGoogleSignIn} className="google-signin-btn">
                <FontAwesomeIcon icon={faGoogle} className="google-icon" />
            </button>
        </div>
    );
};

export default LoginPage;
