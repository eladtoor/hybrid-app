const mongoose = require("mongoose");

const siteStatsSchema = new mongoose.Schema(
  {
    clients: { type: Number, required: true },
    supplyPoints: { type: Number, required: true },
    onlineUsers: { type: Number, required: true },
    lastOrderMinutes: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteStats", siteStatsSchema);
