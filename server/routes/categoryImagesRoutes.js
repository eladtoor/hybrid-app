// routes/categoryImagesRoutes.js
const express = require("express");
const router = express.Router();
const CategoryImage = require("../models/categoryImageModel"); // הסכמה החדשה

// שליפה
router.get("/", async (req, res) => {
  const categories = await CategoryImage.find();
  res.json(categories);
});

// עדכון/הוספה
router.post("/", async (req, res) => {
  const { name, image } = req.body;
  const category = await CategoryImage.findOneAndUpdate(
    { name },
    { image },
    { upsert: true, new: true }
  );
  res.json(category);
});

module.exports = router;
