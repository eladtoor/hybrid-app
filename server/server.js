const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ייבוא חבילת ה-CORS
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
require("dotenv").config(); // טוען את משתני הסביבה מה-.env

const app = express();

// הגדרת CORS
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api", categoryRoutes);

// ראוט בסיסי לבדיקה
app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
