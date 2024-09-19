import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer'; // ייבוא נכון של setUser
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'; // ייבוא של אייקון גוגל
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // ייבוא CSS

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                dispatch(setUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email
                }));
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