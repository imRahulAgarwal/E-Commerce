import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
    {
        fName: String,
        lName: String,
        email: String,
        number: String,
        password: String,
        isDeleted: { type: Boolean, default: false },
        role: { type: Types.ObjectId, ref: "roles" },
        resetPasswordToken: String,
        loginTokens: [String],
        isCustomer: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = model("users", userSchema);

export default User;
