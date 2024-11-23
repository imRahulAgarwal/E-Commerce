import { Schema, Types, model } from "mongoose";

const productColourSchema = new Schema(
    {
        colour: String,
        productId: { type: Types.ObjectId, ref: "products" },
        images: [{ url: String, isDefault: { type: Boolean, default: false } }],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const ProductColour = model("product_colours", productColourSchema);

export default ProductColour;
