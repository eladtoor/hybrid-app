import React, { useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/userReducer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();
    const [searchParams] = useSearchParams();

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;

                // Extract referral code and remove "agent-" and timestamp
                const referralCode = searchParams.get('ref')?.replace(/^agent-/, '').split('-')[0];

                let fullUser = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    name: "",
                    phone: "",
                    isAdmin: false,
                    referredBy: referralCode || null, // Save only the ID without timestamp
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
                } else {
                    // Save the new user to Firestore
                    await setDoc(userRef, fullUser);
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
        <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
            <h2 className="mb-6 text-2xl font-bold">המשך באמצעות</h2>
            <button onClick={handleGoogleSignIn} className="flex items-center justify-center bg-blue-600 text-white p-4 text-2xl rounded-full cursor-pointer transition hover:bg-blue-700">
                <FontAwesomeIcon icon={faGoogle} className="text-4xl" />
            </button>
        </div>
    );
};

export default LoginPage;
