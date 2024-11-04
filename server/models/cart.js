import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "users" },
    products: [
        {
            productSizeId: { type: Types.ObjectId, ref: "product_sizes" },
            quantity: Number,
        },
    ],
});

const Cart = model("carts", cartSchema);

export default Cart;
