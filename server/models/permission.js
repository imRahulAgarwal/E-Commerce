import { Schema, model } from "mongoose";

const permissionSchema = new Schema({
    name: String,
    uniqueName: String,
});

const UserPermission = model("permissions", permissionSchema);

export default UserPermission;
