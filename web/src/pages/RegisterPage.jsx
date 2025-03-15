import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/reducers/userReducer";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password) {
            setError("נא להזין אימייל וסיסמה");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const newUser = {
                uid: user.uid,
                email: user.email,
                name: "",
                phone: "",
                isAdmin: false,
            };

            await setDoc(doc(db, "users", user.uid), newUser);
            dispatch(setUser(newUser));
            localStorage.setItem("user", JSON.stringify(newUser));

            navigate("/user-info");
        } catch (error) {
            console.error("שגיאה בהרשמה:", error.code, error.message);

            switch (error.code) {
                case "auth/email-already-in-use":
                    setError("האימייל כבר רשום במערכת.");
                    break;
                case "auth/weak-password":
                    setError("הסיסמה חלשה מדי. יש להשתמש בלפחות 6 תווים.");
                    break;
                case "auth/invalid-email":
                    setError("האימייל שהוזן אינו תקין.");
                    break;
                case "auth/operation-not-allowed":
                    setError("הרשמה באמצעות אימייל וסיסמה אינה מופעלת ב-Firebase.");
                    break;
                case "auth/network-request-failed":
                    setError("בעיה בחיבור לרשת. בדוק את החיבור ונסה שוב.");
                    break;
                default:
                    setError(`שגיאה: ${error.message}`);
            }
        }
        setLoading(false);
    };



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">הרשמה</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="space-y-4">
                    <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400" />
                    <input type="password" placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-400" />

                    <button onClick={handleRegister} disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition">
                        הרשמה
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
