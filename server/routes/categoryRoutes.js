const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// ראוט לקבלת מבנה הקטגוריות
router.get("/categories", categoryController.buildCategoryStructure);

module.exports = router;
