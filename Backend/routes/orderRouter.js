import express from "express";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import Order from "../models/OrderModel.js";
import { requireAuth } from "../utils/auth.js";
import Product from "../models/productsModel.js";
import User from "../models/userModel.js";

const router = express.Router();

// ✅ Setup Nodemailer transporter with .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true = 465, false = 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Verify SMTP once at server startup
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP server is ready to send emails");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err.message);
  }
})();

// ✅ Send Order Email
async function sendOrderEmail(toEmail, order) {
  console.log("➡️ Sending email to:", toEmail);

  const itemsListHtml = order.items
    .map((i) => `<li>${i.name} × ${i.quantity} — $${i.price}</li>`)
    .join("");

  const itemsListText = order.items
    .map((i) => `${i.name} × ${i.quantity} — $${i.price}`)
    .join("\n");

  try {
    const info = await transporter.sendMail({
      from: `"My Store" <${process.env.SMTP_USER}>`, // ✅ safer format
      to: toEmail,
      subject: "Your Order Confirmation",
      text: `Order ID: ${order._id}\nTotal: $${order.totalAmount}\nPayment: ${order.paymentStatus}\n\nItems:\n${itemsListText}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Thank you for your order!</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> $${order.totalAmount}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        <h3>Items:</h3>
        <ul>${itemsListHtml}</ul>
        <h3>Shipping Address:</h3>
        <p>${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
        <p>${order.shippingAddress.phoneNumber}</p>
      `,
    });

  } catch (error) {
    console.error("❌ Email sending failed:", error.message, error.stack);
  }
}

// ✅ Create new order (customer checkout)
router.post("/", requireAuth, async (req, res) => {
  try {
    let order = await Order.findOne({
      user: req.user.id,
      orderStatus: "pending",
    });

    if (order) {
      order.items = req.body.items;
      order.shippingAddress = req.body.shippingAddress;
      order.paymentMethod = req.body.paymentMethod;
      order.totalAmount = req.body.totalAmount;
      order.phoneNumber = req.body.phoneNumber;
      order.paymentStatus = req.body.paymentStatus;

      const updated = await order.save();
      return res.json(updated);
    }

    const newOrder = new Order({
      user: req.user.id,
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalAmount: req.body.totalAmount,
      phoneNumber: req.body.phoneNumber,
      paymentStatus: req.body.paymentStatus,
    });

    const savedOrder = await newOrder.save();

    // ✅ Fetch user email by ID
    const user = await User.findById(req.user.id).select("email");
    console.log("👤 User found:", user);

    if (user?.email) {
      await sendOrderEmail(user.email, savedOrder);
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Order creation failed:", err.message, err.stack);
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get all orders (admin view)
router.get("/", async (req, res) => {
  try {
    const query = {};
    if (req.query.status && req.query.status !== "all") {
      query.orderStatus = req.query.status;
    }

    const orders = await Order.find(query)
      .populate("user", "full_name email")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/test-email", async (req, res) => {
  try {
    await sendOrderEmail(process.env.SMTP_USER, {
      _id: "12345",
      totalAmount: 100,
      paymentStatus: "paid",
      items: [{ name: "Test Item", quantity: 1, price: 100 }],
      shippingAddress: { address: "Test Street", city: "Lahore", phoneNumber: "12345" },
    });
    res.send("✅ Test email sent (check your inbox/spam)");
  } catch (err) {
    res.status(500).send("❌ Test email failed: " + err.message);
  }
});


// ✅ Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "full_name email")
      .populate("items.product", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update order status (admin)
router.put("/:id/status", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const prevStatus = order.orderStatus;

    order.orderStatus = req.body.orderStatus || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

    if (
      (req.body.orderStatus === "shipped" ||
        req.body.orderStatus === "delivered") &&
      (prevStatus !== "shipped" && prevStatus !== "delivered")
    ) {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (product) {
          if (product.stock < item.quantity) {
            return res
              .status(400)
              .json({ message: `Not enough stock for ${product.name}` });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



export default router;
