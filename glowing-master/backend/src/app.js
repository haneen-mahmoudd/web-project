const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { initDb, db, nextId } = require("./config/db");
const { seedProducts } = require("./utils/seedProducts");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Create backend/.env from backend/.env.example");
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Glowing backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initDb();
  await seedProducts(db, nextId);

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

startServer();
