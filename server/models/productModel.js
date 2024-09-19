const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  מזהה: { type: Number, required: true }, // מזהה המוצר
  סוג: { type: String, enum: ["simple", "variable"], default: "simple" }, // סוג המוצר
  'מק"ט': { type: String }, // מק"ט
  שם: { type: String, required: true }, // שם המוצר
  פורסם: { type: Number, default: 1 }, // האם המוצר פורסם (1 = כן, 0 = לא)
  "האם מומלץ": { type: Number, default: 0 }, // האם המוצר מומלץ (1 = כן, 0 = לא)
  "נראות בקטלוג": {
    type: String,
    enum: ["visible", "hidden"],
    default: "visible",
  },
  "תיאור קצר": { type: String }, // תיאור קצר
  תיאור: { type: String }, // תיאור המוצר (כמו תיאור ארוך יותר)
  "סטטוס מס": { type: String, default: "taxable" }, // סטטוס מס
  במלאי: { type: Boolean, default: true }, // במלאי
  "לאפשר הזמנות מראש": { type: Boolean, default: false }, // האם אפשר להזמין מראש
  "נמכר בנפרד": { type: Boolean, default: false }, // נמכר בנפרד
  "לאפשר חוות דעת של לקוחות": { type: Boolean, default: false }, // האם אפשר חוות דעת של לקוחות
  קטגוריות: { type: String }, // קטגוריות המוצר (לדוגמה "צבעי תעשיה > אבקות אלקטרוסטטיות")
  תמונות: { type: String }, // כתובת התמונה של המוצר
  מיקום: { type: Number }, // מיקום המוצר
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
