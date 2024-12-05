import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "users" },
        address: { type: Types.ObjectId, ref: "addresses" },
        products: [
            {
                productSizeId: { type: Types.ObjectId, ref: "product_sizes" },
                quantity: Number,
                price: Number,
            },
        ],
        totalAmount: Number,
        taxableAmount: Number,
        taxAmount: Number,
        roundOffAmount: Number,
        paymentStatus: String,
        paymentDateTime: Date,
        isBuyNow: { type: Boolean },
        razorpay_payment_id: String,
        razorpay_order_id: String,
        razorpay_signature: String,
    },
    { timestamps: true }
);

const Order = model("orders", orderSchema);

export default Order;
