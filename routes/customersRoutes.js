const express = require("express");
const {
  getNewCustomersOverTime,
  getRepeatCustomers,
  getGeographicalDistribution,
  getCLVByCohort,
} = require("../controllers/customersController");

const router = express.Router();

// customers related routes
router.get("/new-customers", getNewCustomersOverTime);
router.get("/repeat-customers", getRepeatCustomers);
router.get("/geography", getGeographicalDistribution);
router.get("/ltv-cohorts", getCLVByCohort);

module.exports = router;
