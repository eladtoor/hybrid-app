const express = require("express");
const { createPayment } = require("../controllers/paymentController");
const { verifyPayment } = require("../controllers/paymentController");
const { getSaleDetails } = require("../controllers/paymentController");

const router = express.Router();

// נתיב לשליחת בקשה ליצירת תשלום
router.post("/create-payment", createPayment);
router.post("/verify-payment", verifyPayment);
router.post("/sale-details", getSaleDetails);

module.exports = router;
