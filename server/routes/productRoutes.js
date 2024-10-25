const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// ראוט ליצירת מוצר חדש
router.post("/create", productController.createProduct);
//ראוט לקבלת כל המוצרים

router.get("/getAll", productController.getAllProducts);

// ראוט לקבלת פרטי מוצר לפי מזהה
router.get("/:id", productController.getProduct);

// ראוט לעדכון מוצר לפי מזהה
router.put("/update/:id", productController.updateProduct);

// ראוט למחיקת מוצר לפי מזהה
router.delete("/delete/:id", productController.deleteProduct);

module.exports = router;
