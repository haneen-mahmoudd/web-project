const express = require("express");
const { db } = require("../config/db");

const router = express.Router();

router.get("/", (req, res) => {
  const products = [...db.data.products].sort((a, b) => b.id - a.id);
  return res.json(products);
});

router.get("/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = db.data.products.find((item) => item.id === productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  return res.json(product);
});

module.exports = router;
