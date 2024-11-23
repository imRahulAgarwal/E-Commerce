import React, { useState } from "react";
import Addresses from "../../components/user/Addresses/Addresses";
import ChangePassword from "../../components/user/ChangePassword/ChangePassword";
import ProfileForm from "../../components/user/ProfileForm/ProfileForm";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="flex-1 bg-gray-50 p-4 flex flex-col">
            <div className=" grid grid-cols-12 bg-gray-100 rounded-lg shadow-md p-3 gap-4">
                <div className="col-span-12 md:col-span-3 md:border md:rounded border-gray-300 h-fit">
                    {["profile", "changePassword", "addresses"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`block w-full text-left px-4 py-3 font-medium ${
                                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
                            } border-b border-gray-300`}>
                            {tab === "profile" ? "Profile" : tab === "changePassword" ? "Change Password" : "Addresses"}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="col-span-12 md:col-span-9 bg-white p-6 rounded-lg shadow-sm">
                    {activeTab === "profile" && <ProfileForm />}
                    {activeTab === "changePassword" && <ChangePassword />}
                    {activeTab === "addresses" && <Addresses />}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
