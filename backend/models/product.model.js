import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    },
    description: {
    type: String,
    required: true,
    },
    price: {
    type: Number,
    required: true,
    },
    category: {
    type: String,
    required: true,
    },
    stock: {
    type: Number,
    required: true,
    },
    imageUrl: {
    type: String,
    required: [ true, "Image URL is required"],
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product; 