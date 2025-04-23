const express = require("express");
const router = express.Router();
const {
  sendOrderConfirmationEmail,
} = require("../controllers/emailController");

router.post("/send-confirmation", sendOrderConfirmationEmail);

module.exports = router;
