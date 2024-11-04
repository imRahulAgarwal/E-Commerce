import { Schema, Types, model } from "mongoose";

const wishlistSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "users" },
    products: [{ type: Types.ObjectId, ref: "product_colours" }],
});

const UserWishlist = model("wishlist", wishlistSchema);

export default UserWishlist;
