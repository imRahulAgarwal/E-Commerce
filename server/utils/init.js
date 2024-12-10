import UserRole from "../models/role.js";
import User from "../models/user.js";
import UserPermission from "../models/permission.js";
import Init from "../models/init.js";
import permissions from "../data/permissions.js";
import { hashPassword } from "./password.js";
import moment from "moment";

async function initializeProject() {
    try {
        let result = await Init.findOneAndUpdate(
            { actionName: "app_init" },
            { $setOnInsert: { isCompleted: false, lastPerformedAt: new Date() } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (!result.isCompleted) {
            await dataInitialization();
            await Init.updateOne({ actionName: "app_init" }, { isCompleted: true, lastPerformedAt: new Date() });
            console.log("Initialization complete");
        } else {
            console.log("Already initialized on:", moment(result.lastPerformedAt).utc().format("DD-MM-YYYY, HH:mm"));
        }
    } catch (error) {
        process.exit(1);
    }
}

async function dataInitialization() {
    try {
        let email = process.env.ADMIN_EMAIL || "imagarwal05@gmail.com";
        let password = process.env.ADMIN_PASSWORD || "123456";
        let fName = process.env.ADMIN_FNAME || "Rahul";
        let lName = process.env.ADMIN_LNAME || "Agarwal";
        let permissionIds = [];
        for (const permission of permissions) {
            let newPermission = await UserPermission.create(permission);
            permission.uniqueName.includes("manage") && permissionIds.push(newPermission.id);
        }

        let adminRole = await UserRole.findOne({ name: "Admin", isDeleted: false, isDynamic: false });
        if (!adminRole) {
            adminRole = await UserRole.create({ name: "Admin", isDynamic: false, permissions: permissionIds });
        }

        let customerRole = await UserRole.findOne({ name: "Customer", isDeleted: false, isDynamic: false });
        if (!customerRole) {
            customerRole = await UserRole.create({ name: "Customer", isDynamic: false });
        }

        const adminExists = await User.findOne({ email });
        if (!adminExists) {
            const hashedPassword = hashPassword(password, 10);
            await User.create({ email, fName, lName, status: true, role: adminRole.id, password: hashedPassword });
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default initializeProject;
