import React from "react";
import { useForm } from "react-hook-form";
import userService from "../../../api/user/api";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../store/auth/userAuthSlice";

const formFields = [
    { fieldName: "oldPassword", placeholder: "Old Password", inputType: "password" },
    { fieldName: "newPassword", placeholder: "New Password", inputType: "password" },
    { fieldName: "confirmPassword", placeholder: "Confirm Password", inputType: "password" },
];

const ChangePassword = () => {
    const {
        formState: { errors },
        register,
        handleSubmit,
        reset,
    } = useForm();
    const dispatch = useDispatch();

    const handlePasswordChange = (data) => {
        userService.changePassword(data).then((data) => {
            if (data) {
                reset();
                window.localStorage.removeItem("token");
                dispatch(userLogout([]));
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Change Password</h2>
            {formFields.map((field) => (
                <div key={field.fieldName} className="flex flex-col mb-2">
                    <input
                        {...register(field.fieldName, {
                            required: { value: true, message: `${field.placeholder} is required.` },
                        })}
                        className={`w-full border rounded p-2 outline-none ${
                            errors[field.fieldName] ? "border-red-600" : "border-gray-300"
                        }`}
                        type={field.inputType}
                        placeholder={field.placeholder}
                    />
                    {errors[field.fieldName] && (
                        <p className="text-red-500 text-sm mt-1">{errors[field.fieldName].message}</p>
                    )}
                </div>
            ))}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Change Password
            </button>
        </form>
    );
};

export default ChangePassword;
