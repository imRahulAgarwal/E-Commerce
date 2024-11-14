import AuditLogs from "../models/audit.js";

async function noteAudits(user, actionType, targetModule, changes) {
    try {
        await AuditLogs.create({ userId: user?._id, actionType, targetModule, changes });
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export default noteAudits;
