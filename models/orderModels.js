const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  created_at: { type: Date, required: true },
  total_price: { type: Number, required: true },
  currency: { type: String, required: true },
  financial_status: { type: String, required: true },
  line_items: [{ title: String, quantity: Number, price: Number }],
});

const Order = mongoose.model("Order", OrderSchema, "shopifyOrders");

module.exports = Order;
