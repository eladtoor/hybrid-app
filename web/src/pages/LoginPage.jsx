import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

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

import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const refParam = searchParams.get("ref");

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (user?.uid) {
            navigate("/");
        }
    }, [user, navigate]);


    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            const referredBy = refParam?.startsWith("agent-")
                ? refParam.replace("agent-", "")
                : null;

            if (userSnap.exists()) {
                const fullUser = userSnap.data();
                dispatch(setUser(fullUser));
                localStorage.setItem("user", JSON.stringify(fullUser));
                navigate("/");
            } else {
                const newUser = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || "",
                    userType: "user",
                    referredBy: referredBy || null,
                };

                await setDoc(userRef, newUser);
                dispatch(setUser(newUser));
                localStorage.setItem("user", JSON.stringify(newUser));
                navigate("/user-info");
            }
        } catch (error) {
            console.error("שגיאה בהתחברות עם Google:", error.message);
            setError("אירעה שגיאה בהתחברות עם Google.");
        }
    };

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

                    {/* ✅ כפתור עם שמירת פרמטר ref */}
                    <button
                        onClick={() => navigate(`/register${refParam ? `?ref=${refParam}` : ''}`)}
                        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                        הרשמה
                    </button>
                </div>

                <hr className="my-6 border-gray-300" />

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
