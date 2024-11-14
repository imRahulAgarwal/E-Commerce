import { Schema, Types, model } from "mongoose";

const auditSchema = new Schema(
    {
        userId: { type: Types.ObjectId, ref: "users" },
        actionType: String,
        targetModule: String,
        changes: Object,
    },
    { versionKey: false, timestamps: true }
);

const AuditLogs = model("audit_logs", auditSchema);

export default AuditLogs;
