import AuditLogs from "../models/audit.js";

async function noteAudits(userId, actionType, targetModule, details) {
    try {
        await AuditLogs.create({ userId, actionType, targetModule, details });
        return true;
    } catch (error) {
        throw new Error(error);
    }
}

export default noteAudits;
