import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: String,
    description: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    price: Number,
});

const Product = model("products", productSchema);

export default Product;
