import { Schema, Types, model } from "mongoose";

const productSizeSchema = new Schema({
    productColourId: { type: Types.ObjectId, ref: "product_colours" },
    quantity: Number,
    sold: Number,
    size: String,
    description: String,
    isActive: { type: Boolean, default: true },
});

const ProductSize = model("product_sizes", productSizeSchema);

export default ProductSize;
