const MaterialGroupSettings = require("../models/materialGroupSettingsModel");

// Get all material group settings
exports.getMaterialGroupSettings = async (req, res) => {
  try {
    const settings = await MaterialGroupSettings.find();
    res.status(200).json(settings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch material group settings", error });
  }
};

// Update a material group's minimum price
// Update a material group's settings
exports.updateMaterialGroupSetting = async (req, res) => {
  const { groupName, minPrice, transportationPrice } = req.body; // Include transportationPrice in the request body
  try {
    const updatedSetting = await MaterialGroupSettings.findOneAndUpdate(
      { groupName }, // Find the document by groupName
      { minPrice, transportationPrice }, // Update minPrice and transportationPrice
      { new: true, upsert: true } // Return the updated document and create it if not found
    );
    res.status(200).json(updatedSetting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update material group setting", error });
  }
};
