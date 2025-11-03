import express from "express";
import Testimonial from "../models/testimonialModel.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, safeName + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ------------------- ROUTES -------------------

// Get all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching testimonials" });
  }
});

// Add new testimonial with image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, comment } = req.body;

    const newTestimonial = new Testimonial({
      name,
      comment,
      image: req.file ? req.file.filename : null,
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding testimonial" });
  }
});

// Update testimonial with optional image
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, comment } = req.body;
    const updatedData = { name, comment };

    if (req.file) updatedData.image = req.file.filename;

    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete testimonial
router.delete("/:id", async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
