import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../../api/user/api";

const formFields = [
    { fieldName: "fName", placeholder: "First Name", inputType: "text" },
    { fieldName: "lName", placeholder: "Last Name", inputType: "text" },
    { fieldName: "email", placeholder: "Email", inputType: "email" },
    { fieldName: "number", placeholder: "Number", inputType: "text" },
];

const ProfileForm = () => {
    const user = useSelector((state) => state.userAuth.user);
    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm({
        defaultValues: user,
    });
    const dispatch = useDispatch();

    const handleProfileUpdate = (data) => {
        userService.updateProfile(data).then(({ data }) => {
            if (data) {
                dispatch(userLogin(data.user));
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Profile</h2>
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
                Update Profile
            </button>
        </form>
    );
};

export default ProfileForm;
