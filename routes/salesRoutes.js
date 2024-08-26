const express = require("express");
const {
  getTotalSalesOverTime,
  getSalesGrowthRateOverTime,
} = require("../controllers/salesController");

const router = express.Router();

// sales-related routes
router.get("/total-sales", getTotalSalesOverTime);
router.get("/sales-growth-rate", getSalesGrowthRateOverTime);

module.exports = router;
