import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;

                // Initializing the full user object
                let fullUser = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    name: "", // Default empty
                    phone: "", // Default empty
                    isAdmin: false,
                };

                // Check if the user is an admin
                const adminQuery = query(collection(db, "admins"), where("email", "==", user.email));
                const adminSnapshot = await getDocs(adminQuery);
                if (!adminSnapshot.empty) {
                    fullUser.isAdmin = true;
                }

                // Fetch additional details from Firestore if they exist
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const firestoreData = userSnap.data();
                    fullUser = {
                        ...fullUser,
                        ...firestoreData, // Merge existing Firestore data into fullUser
                    };
                }

                // Save full user data in Redux
                dispatch(setUser(fullUser));

                // Save full user data in localStorage
                localStorage.setItem('user', JSON.stringify(fullUser));

                // Navigate to the appropriate page
                if (fullUser.name && fullUser.phone) {
                    navigate('/');
                } else {
                    navigate('/user-info');
                }
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
