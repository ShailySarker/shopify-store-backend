const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  email: { type: String, require: true },
});

const Order = mongoose.model("Customer", customerSchema, "shopifyCustomers");

module.exports = Order;
