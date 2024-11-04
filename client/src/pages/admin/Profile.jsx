import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [loginTokens, setLoginTokens] = useState([
        { id: 1, time: "2023-11-01 10:30 AM" },
        { id: 2, time: "2023-11-02 11:00 AM" },
    ]);

    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordSubmit = async (data) => {
        console.log("Changing password...", data);
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate async operation
        console.log("Password changed!");
    };

    const handleRemoveToken = async (id) => {
        console.log("Removing token...", id);
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate async operation
        setLoginTokens((tokens) => tokens.filter((token) => token.id !== id));
    };

    const tabs = [
        { name: "Profile", content: ProfileTabContent() },
        { name: "Change Password", content: ChangePasswordTabContent() },
        { name: "Login Tokens", content: LoginTokensTabContent() },
    ];

    // Profile Tab Content
    function ProfileTabContent() {
        return (
            <div className="flex flex-col items-center lg:items-start w-full space-y-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
                <div className="w-full space-y-2 text-gray-700">
                    <div className="bg-gray-100 p-3 rounded-md">Name: John Doe</div>
                    <div className="bg-gray-100 p-3 rounded-md">Email: john@example.com</div>
                    <div className="bg-gray-100 p-3 rounded-md">Phone Number: +1234567890</div>
                    <div className="bg-gray-100 p-3 rounded-md">Role: Admin</div>
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

    // Login Tokens Tab Content
    function LoginTokensTabContent() {
        return (
            <div className="space-y-4 w-full">
                {loginTokens.map((token) => (
                    <div
                        key={token.id}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border p-3 rounded-md">
                        <div>
                            <span>Time: </span>
                            <span className="font-medium">{token.time}</span>
                        </div>
                        <button
                            onClick={() => handleRemoveToken(token.id)}
                            className="flex items-center text-red-600 border border-red-600 p-2 rounded-md hover:bg-red-100">
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Remove
                        </button>
                    </div>
                ))}
            </div>
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
