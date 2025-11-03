import express from "express";
import Message from "../models/messageModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Add new message
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Delete message
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Reply to a message (send email & save reply in DB)
router.post("/reply", async (req, res) => {
  try {
    const { messageId, email, message } = req.body; // subject will default

    // Default subject for all replies
    const replySubject = "Reply from Vendoz";

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: replySubject,
      text: message,
      html: `<p>${message}</p>`,
    });

    // Save reply to message in DB
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        $push: {
          replies: { subject: replySubject, message },
        },
      },
      { new: true }
    );

    res.json({ success: true, updatedMessage });
  } catch (err) {
    console.error("❌ Email/DB error:", err);
    res.status(500).json({ error: "Failed to send reply", details: err.message });
  }
});

export default router;
