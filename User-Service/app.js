const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// connect to DB
connectDB();

// Middleware
app.use(bodyParser.json());

app.use("/api", userRoutes);
app.use("/api", authRoutes);

module.exports = app;
