import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be less than 0"],
    },
    cost: {
        type: Number,
        required: true,
        min: [0, "Cost cannot be less than 0"],
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        enum: ["men", "women", "kids"], // Add more categories if needed
        default: "men", // fallback default
    },
}, { timestamps: true });

const Product=mongoose.model("Product",productSchema);


export default Product;