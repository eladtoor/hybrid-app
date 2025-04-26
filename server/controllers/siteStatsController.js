const SiteStats = require("../models/siteStatsModel");

// Get site stats
exports.getSiteStats = async (req, res) => {
  try {
    const stats = await SiteStats.findOne(); // Assuming only one document
    if (!stats)
      return res.status(404).json({ message: "Site stats not found" });
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update site stats
exports.updateSiteStats = async (req, res) => {
  try {
    const { clients, supplyPoints, onlineUsers, lastOrderMinutes } = req.body;
    const stats = await SiteStats.findOneAndUpdate(
      {},
      { clients, supplyPoints, onlineUsers, lastOrderMinutes },
      { new: true, upsert: true }
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
