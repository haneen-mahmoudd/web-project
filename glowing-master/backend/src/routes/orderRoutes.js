const express = require("express");
const { db, nextId } = require("../config/db");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  const { items, address, phone, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items are required" });
  }
  if (!address || !phone) {
    return res.status(400).json({ message: "address and phone are required" });
  }

  try {
    await db.read();

    let totalAmount = 0;
    const normalizedItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);
      const productId = Number(item.productId);
      if (!productId || Number.isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid order item format");
      }

      const product = db.data.products.find((savedProduct) => savedProduct.id === productId);
      if (!product) throw new Error(`Product #${productId} not found`);
      if (product.stock < quantity) throw new Error(`Insufficient stock for ${product.name}`);

      normalizedItems.push({
        productId: product.id,
        quantity,
        unitPrice: product.price
      });
      totalAmount += product.price * quantity;
    }

    for (const item of normalizedItems) {
      const product = db.data.products.find((savedProduct) => savedProduct.id === item.productId);
      product.stock -= item.quantity;
    }

    const order = {
      id: nextId("orders"),
      user_id: req.user.id,
      total_amount: totalAmount,
      status: "pending",
      payment_method: paymentMethod || "cash_on_delivery",
      address,
      phone,
      created_at: new Date().toISOString(),
      items: normalizedItems
    };

    db.data.orders.push(order);
    await db.write();
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Order creation failed" });
  }
});

router.get("/my", async (req, res) => {
  await db.read();
  const orders = db.data.orders
    .filter((order) => order.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map((order) => {
      const items = order.items.map((item) => {
        const product = db.data.products.find((savedProduct) => savedProduct.id === item.productId);
        return {
          product_id: item.productId,
          name: product ? product.name : "Deleted Product",
          quantity: item.quantity,
          unit_price: item.unitPrice
        };
      });
      return { ...order, items };
    });

  return res.json(orders);
});

module.exports = router;
