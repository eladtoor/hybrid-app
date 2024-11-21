const mongoose = require("mongoose");

const materialGroupSettingsSchema = new mongoose.Schema({
  groupName: {
    type: String,
    enum: ["Colors and Accessories", "Powders", "Gypsum and Tracks"],
    required: true,
    unique: true,
  },
  minPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  transportationPrice: {
    // New Field
    type: Number,
    required: true,
    default: 0, // Default transportation price
  },
});

const MaterialGroupSettings = mongoose.model(
  "MaterialGroupSettings",
  materialGroupSettingsSchema,
  "MaterialGroupSettings"
);

module.exports = MaterialGroupSettings;
