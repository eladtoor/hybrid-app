const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // שם המוצר
  price: { type: Number, required: true }, // מחיר המוצר
  description: { type: String }, // תיאור המוצר
  quantity: { type: Number, default: 0 }, // כמות המוצרים במלאי
  category: { type: String }, // קטגוריה של המוצר (אופציונלי)
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
