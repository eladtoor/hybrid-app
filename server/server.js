const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { WebSocketServer } = require("ws"); // WebSocket Server
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const materialGroupRoutes = require("./routes/materialGroupRoutes");

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket
const wss = new WebSocketServer({ server }); // Initialize WebSocket Server

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

// Connect to MongoDB with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    setupChangeStream(); // Start watching products after successful connection
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

connectDB(); // Initial connection attempt

// CORS setup (for development, allowing all origins)
const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api/materialGroups", materialGroupRoutes);

// Serve frontend build files
app.use(express.static(path.join(__dirname, "../web/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/build", "index.html"));
});

// Basic test route
app.get("/", (req, res) => {
  res.send("🟢 Server is running");
});

/** ==========================
 *  🔹 WEBSOCKET LOGIC BELOW
 *  ========================== */

// Function to broadcast product updates to all clients
const broadcastProductsUpdate = async () => {
  try {
    const updatedProducts = await mongoose.connection
      .collection("products")
      .find()
      .toArray();

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({ type: "PRODUCTS_UPDATED", payload: updatedProducts })
        );
      }
    });
  } catch (error) {
    console.error("❌ Error broadcasting product updates:", error);
  }
};

// Set up MongoDB Change Stream to detect product updates
const setupChangeStream = () => {
  try {
    const productCollection = mongoose.connection.collection("products");
    const changeStream = productCollection.watch();

    changeStream.on("change", (change) => {
      console.log("🔄 Product Change Detected:", change);
      broadcastProductsUpdate();
    });

    console.log("🟢 Change Stream initialized.");
  } catch (error) {
    console.error("❌ Error setting up Change Stream:", error);
  }
};

// WebSocket Connection Handling
wss.on("connection", (ws) => {
  console.log("🟢 New WebSocket client connected");

  ws.on("message", (message) => {
    console.log("📩 Received Message:", message);
  });

  ws.on("close", () => {
    console.log("🔴 WebSocket client disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
