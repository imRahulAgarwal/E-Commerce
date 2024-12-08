import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";
import moment from "moment";
import Loader from "../../components/Loader/Loader";

const Audit = () => {
    const { auditId } = useParams();
    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminPanelService
            .getAudit(auditId)
            .then(({ data }) => {
                if (data) {
                    setAudit(data.audit);
                }
            })
            .finally(() => setLoading(false));
    }, [auditId]);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full p-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Audit Report</h1>

            {loading ? (
                <div className="mb-4">
                    <Loader />
                </div>
            ) : audit ? (
                <div className="pt-4 border-t border-blue-200">
                    {/* Audit Details */}
                    <div className="space-y-4">
                        <p className="text-lg">
                            <span className="font-medium text-blue-700">Action Type:</span> {audit.actionType}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-blue-700">Target Module:</span> {audit.targetModule}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-blue-700">Action By:</span> <br />
                            <span>Name: </span>
                            <span className="text-gray-600">
                                {audit.userId.fName} {audit.userId.lName}
                            </span>
                            <br />
                            <span>Email: </span>
                            <span className="text-gray-600">{audit.userId.email}</span>
                            <br />
                            <span>User Role: </span>
                            <span className="text-gray-500">{audit.userId.role.name}</span>
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-blue-700">Created At:</span>{" "}
                            {moment(audit.createdAt).format("DD MMMM YYYY, hh:mm A")}
                        </p>
                        <p className="text-lg">
                            <span className="font-medium text-blue-700">Changes:</span> {audit.changes.documentId}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mb-4">
                    <p className="text-gray-500">No audit log found.</p>
                </div>
            )}
        </div>
    );
};

export default Audit;
