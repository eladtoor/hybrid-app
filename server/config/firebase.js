require("dotenv").config();

const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://hybrid-app-users-default-rtdb.europe-west1.firebasedatabase.app",
});

module.exports = admin;
