require("dotenv").config();
const admin = require("../config/firebase");

const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    return res
      .status(201)
      .json({ message: `User signed up with UID: ${userRecord.uid}` });
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ message: "Email is already in use" });
    }
    console.error("Error signing up user:", error);
    return res.status(500).json({ message: "Error signing up user" });
  }
};

const login = async (req, res) => {
  const idToken = req.body.idToken;

  if (!idToken) {
    return res.status(400).json({ message: "ID token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return res
      .status(200)
      .json({ message: `User logged in with UID: ${decodedToken.uid}` });
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      return res
        .status(401)
        .json({ message: "ID token has expired. Please re-authenticate." });
    }

    console.error("Error verifying ID token:", error);
    return res.status(401).json({ message: "Invalid ID token" });
  }
};

module.exports = {
  signup,
  login,
};
