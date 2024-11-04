import { Schema, model, Types } from "mongoose";

const contactUsSchema = new Schema(
    {
        name: String,
        email: String,
        number: String,
        message: String,
        userId: { type: Types.ObjectId, ref: "users" },
    },
    { timestamps: true }
);

const ContactUs = model("contact_us", contactUsSchema, "contact_us");

export default ContactUs;
