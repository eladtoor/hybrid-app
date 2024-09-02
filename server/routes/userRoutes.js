const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ראוט לרישום משתמש חדש
router.post("/signup", userController.signup);

// ראוט לכניסת משתמש
router.post("/login", userController.login);

module.exports = router;
