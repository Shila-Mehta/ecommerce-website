import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  subject: { type: String, default: "Reply from Vendoz" },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  name: { type: String, default: "Unknown" },
  email: { type: String, default: "No Email" },
  message: { type: String, default: "No Message" },
  date: { type: Date, default: Date.now },
  replies: [replySchema], // ✅ Embed replies array
});

export default mongoose.model("Message", messageSchema);
