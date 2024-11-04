import { Types } from "mongoose";

const ObjectId = Types.ObjectId;

const returnObjectId = (id) => new ObjectId(id);

export default returnObjectId;
