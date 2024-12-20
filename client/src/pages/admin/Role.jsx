import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";
import moment from "moment-timezone";
import Loader from "../../components/Loader/Loader";

const Role = () => {
    const { roleId } = useParams();
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    useEffect(() => {
        adminPanelService
            .getRole(roleId)
            .then(({ data }) => setRoleData(data.role))
            .finally(() => setLoading(false));
    }, [roleId]);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full p-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Role Information</h1>

            {loading ? (
                <div className="mb-4">
                    <Loader />
                </div>
            ) : roleData ? (
                <div className="pt-4 border-t border-blue-200">
                    {/* Role Details Section */}
                    <div className="pb-4 border-b border-blue-200">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Role Details</h2>
                        <div className="flex flex-col gap-2 text-black">
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Role Name:</span> {roleData.name}
                            </p>
                            {roleData.description && (
                                <p className="text-lg">
                                    <span className="font-medium text-blue-700">Description:</span>{" "}
                                    {roleData.description}
                                </p>
                            )}
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Created At:</span>{" "}
                                {moment(roleData.createdAt).tz(timezone).format("DD.MM.YYYY, hh:mm A")}
                            </p>
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Dynamic Role:</span>{" "}
                                {roleData.isDynamic ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="pt-4">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Permissions</h2>
                        <div className="text-black text-lg space-y-4">
                            {roleData.permissions && roleData.permissions.length > 0 ? (
                                roleData.permissions.map((permission, index) => (
                                    <div key={permission._id} className="space-y-1">
                                        <p>{permission.name}</p>
                                        {index !== roleData.permissions.length - 1 && (
                                            <hr className="border-blue-200 my-2" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No permissions available.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500">No user role information available.</p>
            )}
        </div>
    );
};

export default Role;
