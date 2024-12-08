import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import adminPanelService from "../../api/admin/api-admin";
import { logout } from "../../store/auth/adminAuthSlice";

const Profile = () => {
    const { user } = useSelector((state) => state.adminAuth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("Profile");
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordSubmit = async (data) => {
        adminPanelService.changePassword(data).then((result) => {
            if (result) {
                dispatch(logout());
                window.localStorage.removeItem("token");
            }
        });
    };

    const tabs = [
        { name: "Profile", content: ProfileTabContent() },
        { name: "Change Password", content: ChangePasswordTabContent() },
    ];

    // Profile Tab Content
    function ProfileTabContent() {
        return (
            <div className="flex flex-col items-center lg:items-start w-full space-y-4">
                <div className="w-full space-y-2 text-gray-700">
                    <div className="bg-gray-100 p-3 rounded-md">
                        Name: {user.fName} {user.lName}
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md">Email: {user.email}</div>
                    <div className="bg-gray-100 p-3 rounded-md">Role: {user.role}</div>
                </div>
            </div>
        );
    }

    // Change Password Tab Content
    function ChangePasswordTabContent() {
        return (
            <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4 w-full">
                {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
                    <div key={field} className="flex flex-col">
                        <div className="flex">
                            <input
                                type={showPassword[field] ? "text" : "password"}
                                {...register(field, {
                                    required: {
                                        value: true,
                                        message: `${
                                            field.split("Password")[0].substring(0, 1).toUpperCase() +
                                            field.split("Password")[0].substring(1)
                                        } password is required`,
                                    },
                                    minLength: {
                                        value: 6,
                                        message: `${
                                            field.split("Password")[0].substring(0, 1).toUpperCase() +
                                            field.split("Password")[0].substring(1)
                                        } password is too short`,
                                    },
                                })}
                                placeholder={`${
                                    field.split("Password")[0].substring(0, 1).toUpperCase() +
                                    field.split("Password")[0].substring(1)
                                } Password`}
                                className={`w-full border rounded-l border-r-0 p-2 outline-none ${
                                    errors[field] ? "border-red-600" : "border-black-opacity-20"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility(field)}
                                className={`p-2 bg-gray-200 rounded-r flex justify-center items-center border cursor-pointer ${
                                    errors[field] ? "border-red-600" : "border-black-opacity-20"
                                }`}>
                                <FontAwesomeIcon icon={showPassword[field] ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        {errors[field] && <span className="text-red-600 text-sm mt-1">{errors[field].message}</span>}
                    </div>
                ))}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold mt-4">
                    Change Password
                </button>
            </form>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg flex flex-col lg:flex-row w-full mx-auto h-full">
            {/* Sidebar Tabs */}
            <div className="flex overflow-x-auto flex-col md:flex-row lg:flex-col w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r p-2">
                {tabs.map((tab) => (
                    <div
                        key={tab.name}
                        className={`cursor-pointer px-2 py-1 lg:px-3 lg:py-2 text-base rounded-md ${
                            activeTab === tab.name ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab.name)}>
                        {tab.name}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-3/4 p-3 lg:p-6">
                <h2 className="text-lg lg:text-2xl font-semibold mb-2 lg:mb-4">{activeTab}</h2>
                <div className="text-sm lg:text-base text-gray-600">
                    {tabs.find((tab) => tab.name === activeTab).content}
                </div>
            </div>
        </div>
    );
};

export default Profile;
