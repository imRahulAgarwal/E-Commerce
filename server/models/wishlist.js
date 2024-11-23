import { Schema, Types, model } from "mongoose";

const wishlistSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "users" },
    products: [{ type: Types.ObjectId, ref: "product_sizes" }],
});

const UserWishlist = model("wishlist", wishlistSchema);

export default UserWishlist;
