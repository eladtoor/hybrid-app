const express = require("express");
const {
  getMaterialGroupSettings,
  updateMaterialGroupSetting,
} = require("../controllers/materialGroupController");

const router = express.Router();

// Get all material group settings
router.get("/", getMaterialGroupSettings);

// Update a material group's minimum price
router.put("/", updateMaterialGroupSetting);

module.exports = router;
