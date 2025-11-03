import express from "express";
import PDFDocument from "pdfkit";
import Order from "../models/OrderModel.js";

const router = express.Router();

// GET /api/pdf/receipt/:id
router.get("/receipt/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.product");

    if (!order) {
      // ❌ stop before streaming starts
      return res.status(404).json({ message: "Order not found" });
    }

    // --- Response headers ---
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${order._id}.pdf`
    );

    // --- Create PDF ---
    const doc = new PDFDocument();
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Order Receipt", { align: "center" });
    doc.moveDown();

    // Customer info
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.user.full_name} (${order.user.email})`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    // Items
    doc.fontSize(14).text("Items:");
    doc.moveDown(0.5);

    order.items.forEach((item, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${item.name} x ${item.quantity} = $${(
          item.quantity * item.product.price
        ).toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${order.totalAmount.toFixed(2)}`, {
      align: "right",
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });

    // ✅ End PDF (this also ends res)
    doc.end();
  } catch (err) {
    console.error("PDF error:", err);

    // ✅ Only send JSON if headers not already sent
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Error generating receipt", error: err.message });
    } else {
      // If headers already sent (stream started), just destroy the connection
      res.end();
    }
  }
});

export default router;
