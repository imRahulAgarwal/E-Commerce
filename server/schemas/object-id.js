import { Types } from "mongoose";

const validateObjectId = (id) => Types.ObjectId.isValid(id);

export default validateObjectId;
