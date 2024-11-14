import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
});

const Category = model("categories", categorySchema);

export default Category;
