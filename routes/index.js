const express = require("express");
const router = express.Router();

// all API routes
router.use("/sales", require("./salesRoutes"));
router.use("/customers", require("./customersRoutes"));

module.exports = router;
