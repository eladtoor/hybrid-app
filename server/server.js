const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Required for serving frontend build files
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

// Serve frontend build folder in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "build"); // Adjust if your build folder is located elsewhere

  // Serve static files from the React app
  app.use(express.static(buildPath));

  // Handle React routing, return index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Basic test route (used only in development mode)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
