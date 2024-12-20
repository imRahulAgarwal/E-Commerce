import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";
import Loader from "../../components/Loader/Loader";

const PanelUser = () => {
    const { panelUserId } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminPanelService
            .getPanelUser(panelUserId)
            .then(async ({ data }) => {
                if (data) {
                    setUserData(data.panelUser);
                }
            })
            .finally(() => setLoading(false));
    }, [panelUserId]);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full p-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">User Information</h1>

            {loading ? (
                <div className="mb-4">
                    <Loader />
                </div>
            ) : userData ? (
                <div className="pt-4 border-t border-blue-200">
                    {/* Personal Information Section */}
                    <div className="pb-4 border-b border-blue-200">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Personal Information</h2>
                        <div className="flex flex-col gap-2 text-black">
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Name:</span> {userData.fName}{" "}
                                {userData.lName}
                            </p>
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Email:</span> {userData.email}
                            </p>
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Role:</span> {userData.role.name}
                            </p>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <div className="pt-4">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Permissions</h2>
                        <div className="text-black text-lg space-y-4">
                            {userData.role.permissions && userData.role.permissions.length > 0 ? (
                                userData.role.permissions.map((permission, index) => (
                                    <div key={index} className="space-y-1">
                                        <p>{permission.name}</p>
                                        {index !== userData.role.permissions.length - 1 && (
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
                <div className="mb-4">
                    <p className="text-gray-500">No panel user information found.</p>
                </div>
            )}
        </div>
    );
};

export default PanelUser;
