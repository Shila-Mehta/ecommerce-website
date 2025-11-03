import express from "express";
import Product from "../models/productsModel.js";
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
    // Always generate unique file name to prevent duplicates/overwrite
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/\s+/g, "_"); // remove spaces
    cb(null, safeName + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// ------------------- ROUTES -------------------

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});



router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, stock, cost, category } = req.body;

    const newProduct = new Product({
      name,
      price,
      stock: stock || 0,
      cost,
      image: req.file.filename,
      category: category || "men" // default if not provided
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product" });
  }
});


// Update product with image
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, stock, cost, category } = req.body;
    const updatedData = { name, price, cost };

    if (stock !== undefined) updatedData.stock = stock;
    if (req.file) updatedData.image = req.file.filename;
    if (category) updatedData.category = category;

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Delete product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
