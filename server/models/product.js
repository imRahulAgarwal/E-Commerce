import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    name: String,
    description: String,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    price: Number,
    category: { type: Types.ObjectId, ref: "categories" },
});

const Product = model("products", productSchema);

export default Product;
