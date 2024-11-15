import { Schema, Types, model } from "mongoose";

const productSizeSchema = new Schema({
    productColourId: { type: Types.ObjectId, ref: "product_colours" },
    quantity: Number,
    sold: { type: Number, default: 0 },
    size: String,
    description: String,
    isActive: { type: Boolean, default: true },
});

const ProductSize = model("product_sizes", productSizeSchema);

export default ProductSize;
