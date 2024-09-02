require("dotenv").config();
const admin = require("../config/firebase"); // ייבוא המודול של Firebase Admin

const signup = (req, res) => {
  const clientId = process.env.FIREBASE_CLIENT_ID;
  const clientSecret = process.env.FIREBASE_CLIENT_SECRET;

  // השתמש במפתחות כאן לפי הצורך
  res.status(201).send("User signed up");
};

const login = async (req, res) => {
  const idToken = req.body.idToken;

  // בדיקה אם ה-ID Token קיים בבקשה
  if (!idToken) {
    return res.status(400).send("ID token is required");
  }

  try {
    // אימות ה-ID Token מול Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // ה-ID Token תקין והמשתמש מאומת
    return res.status(200).send(`User logged in with UID: ${decodedToken.uid}`);
  } catch (error) {
    // ה-ID Token אינו תקין
    console.log(error);

    return res.status(401).send("Invalid ID token");
  }
};

module.exports = {
  signup,
  login,
};
