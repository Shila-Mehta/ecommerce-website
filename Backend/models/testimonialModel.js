import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);
