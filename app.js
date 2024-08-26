const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Use the CORS middleware
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api", require("./routes/index"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
