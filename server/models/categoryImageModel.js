const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: false }, // Cloudinary URL
});

module.exports = mongoose.model(
  "CategoryImage",
  categorySchema,
  "categoryimages"
);
