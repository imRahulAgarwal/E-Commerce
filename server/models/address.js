import { Schema, Types, model } from "mongoose";

const addressSchema = new Schema({
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    pincode: Number,
    userId: { type: Types.ObjectId, ref: "users" },
    isDeleted: { type: Boolean, default: false },
});

const Address = model("addresses", addressSchema);

export default Address;
