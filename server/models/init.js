import { Schema, model } from "mongoose";

const initSchema = new Schema({
    actionName: String,
    isCompleted: Boolean,
    lastPerformedAt: Date,
});

const Init = model("inits", initSchema);

export default Init;
