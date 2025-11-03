// routes/cartRoutes.js
import express from "express";
import Cart from "../models/cartModel.js";

const router = express.Router();

// ✅ Get user cart
router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate("items.product");
  res.json(cart || { items: [] });
});

// ✅ Add item to cart
router.post("/:userId", async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.params.userId });

  if (!cart) {
    cart = new Cart({ user: req.params.userId, items: [] });
  }

  // check if product already in cart
  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// ✅ Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
  let cart = await Cart.findOne({ user: req.params.userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i.product.toString() !== req.params.productId
  );
  await cart.save();
  res.json(cart);
});

export default router;
