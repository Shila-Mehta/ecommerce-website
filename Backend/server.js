import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes  from "./routes/userRoutes.js";
import messageRoutes  from "./routes/messageRouter.js";
import productRoutes from "./routes/productsRouter.js";
import  orderRoutes from "./routes/orderRouter.js";
import  cartRoutes from "./routes/cartRouter.js";
import registerRoutes from "./routes/loginRouter.js";
import dashboardRoutes from "./routes/dashBoardRouter.js";
import testimonialRoutes from "./routes/testimonialRouter.js";
import paymentRoutes from "./routes/paymentRouter.js";
import pdfRoutes from "./routes/pdfRouter.js";



const app = express();
app.use(cors());
dotenv.config();

// Parse incoming JSON
app.use(express.json());
// Parse form data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// serve uploads folder as static
app.use("/uploads", express.static("uploads"));


// middlewares
app.use("/api/signup",userRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/login",registerRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/create-payment-intent",paymentRoutes);
app.use("/api/pdf", pdfRoutes);


console.log(process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI, {

  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));


app.listen(process.env.PORT || 5000, (error) => {
  if(error) console.log(error);
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});