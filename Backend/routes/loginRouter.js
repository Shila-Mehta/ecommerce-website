import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { signToken, requireAuth } from "../utils/auth.js";


const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });


    const token = signToken(user);
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      redirectTo: user.role === "admin" ? "/admin" : "/"
    });

  }
  catch (error) {
    res.status(500).json({ message: "Login error", error });
  }

})


router.get("/me", requireAuth, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id).select("_id full_name email role");
    if (!userData) return res.status(404).json({ message: "User not found" });
    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

export default router;


