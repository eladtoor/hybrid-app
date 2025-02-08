const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const WebSocket = require("ws"); // Import WebSocket
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const materialGroupRoutes = require("./routes/materialGroupRoutes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

// Connect to MongoDB with retry mechanism
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    setupChangeStream(); // Start Change Stream
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    setTimeout(connectDB, 5000); // Retry connection in 5 seconds
  }
};

connectDB(); // Initial connection

const corsOptions = { origin: "*" };
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api/materialGroups", materialGroupRoutes);

app.use(express.static(path.join(__dirname, "../web/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../web/build", "index.html"));
});

app.get("/", (req, res) => {
  res.send("🟢 Server is running");
});

/** ==========================
 *  🔹 WEBSOCKET LOGIC BELOW
 *  ========================== */

// Broadcast product updates to all clients
const broadcastProductsUpdate = async () => {
  try {
    const updatedProducts = await mongoose.connection
      .collection("products")
      .find()
      .toArray();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Ensure connection is open
        client.send(
          JSON.stringify({ type: "PRODUCTS_UPDATED", payload: updatedProducts })
        );
      }
    });

    console.log("📡 Broadcasted product update to all clients.");
  } catch (error) {
    console.error("❌ Error broadcasting product updates:", error);
  }
};

// Setup MongoDB Change Stream
const setupChangeStream = () => {
  try {
    const productCollection = mongoose.connection.collection("products");
    const changeStream = productCollection.watch();

    changeStream.on("change", (change) => {
      console.log("🔄 Product Change Detected:", change);
      broadcastProductsUpdate();
    });

    changeStream.on("error", (error) => {
      console.error("❌ Change Stream error:", error);
      console.log("🟡 Restarting Change Stream in 5 seconds...");
      setTimeout(setupChangeStream, 5000);
    });

    console.log("🟢 Change Stream initialized.");
  } catch (error) {
    console.error("❌ Error setting up Change Stream:", error);
  }
};

// WebSocket Handling
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
