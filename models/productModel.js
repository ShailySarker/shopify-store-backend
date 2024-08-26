const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, require: true, unique: true },
  title: { type: String, require: true },
  price: { type: Number, require: true },
});

module.exports = mongoose.model("Product", productSchema, "shopifyProducts");
