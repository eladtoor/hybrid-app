import React, { useState } from "react";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userReducer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();
    const [searchParams] = useSearchParams();

    // State לניהול טופס התחברות
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 התחברות עם Google
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // בדיקה אם המשתמש קיים ב-Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const fullUser = userSnap.data();
                dispatch(setUser(fullUser));
                localStorage.setItem("user", JSON.stringify(fullUser));
                navigate("/");
            } else {
                navigate("/user-info");
            }
        } catch (error) {
            console.error("שגיאה בהתחברות עם Google:", error.message);
            setError("אירעה שגיאה בהתחברות עם Google.");
        }
    };

    // 🔹 התחברות עם אימייל וסיסמה
    const handleLogin = async () => {
        if (!email || !password) {
            setError("נא להזין אימייל וסיסמה");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const loggedInUser = userSnap.data();
                dispatch(setUser(loggedInUser));
                localStorage.setItem("user", JSON.stringify(loggedInUser));
                navigate("/");
            } else {
                setError("חשבון לא נמצא, נסה להירשם.");
            }
        } catch (error) {
            console.error("שגיאה בהתחברות:", error.message);
            setError("אימייל או סיסמה לא תקינים.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">התחברות</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                {/* 🔹 טופס התחברות */}
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="אימייל"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        התחברות
                    </button>

                    <p className="text-center text-gray-600">אין לך חשבון?</p>

                    <button
                        onClick={() => navigate("/register")}
                        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                        הרשמה
                    </button>
                </div>

                <hr className="my-6 border-gray-300" />

                {/* 🔹 Google Login */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-md font-semibold hover:bg-red-600 transition"
                >
                    <FontAwesomeIcon icon={faGoogle} className="text-lg mr-2" />
                    התחבר עם Google
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
