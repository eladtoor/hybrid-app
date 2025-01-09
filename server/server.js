const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // נדרש להגשת קבצים סטטיים
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const materialGroupRoutes = require("./routes/materialGroupRoutes");

const app = express();

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not defined in environment variables");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// CORS setup (for development, allowing all origins)
const corsOptions = {
  origin: "*", // Allow all origins for development
};

app.use(cors(corsOptions)); // Use the simplified CORS setup
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api/materialGroups", materialGroupRoutes);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "build")));

// Serve the React app for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Basic test route
app.get("/test", (req, res) => {
  res.send("Server is running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
