const express = require("express");
const {
  getSiteStats,
  updateSiteStats,
} = require("../controllers/siteStatsController");
const router = express.Router();

// GET site stats
router.get("/", getSiteStats);

// PUT update site stats (For Admin)
router.put("/", updateSiteStats);

module.exports = router;
