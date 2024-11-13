import React from "react";
import { useForm, Controller } from "react-hook-form";

const PanelUserForm = ({ onClose, onSubmit, initialData = {}, roles = [] }) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fName: initialData.fName || "",
            lName: initialData.lName || "",
            email: initialData.email || "",
            roleId: initialData.role?._id || "",
        },
    });

    const submitHandler = async (data) => {
        await onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{initialData._id ? "Edit Panel User" : "Add Panel User"}</h3>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.fName ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="First name"
                            {...register("fName", { required: { value: true, message: "First name is required" } })}
                            type="text"
                        />
                        {errors.fName && <span className="text-red-600 text-sm mt-1">{errors.fName.message}</span>}
                    </div>

                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.lName ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Last name"
                            {...register("lName", { required: { value: true, message: "Last name is required" } })}
                            type="text"
                        />
                        {errors.lName && <span className="text-red-600 text-sm mt-1">{errors.lName.message}</span>}
                    </div>

                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.email ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Email"
                            {...register("email", { required: { value: true, message: "Email is required" } })}
                            type="text"
                        />
                        {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col mb-4">
                        <Controller
                            name="roleId"
                            control={control}
                            rules={{ required: "Role is required" }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full border rounded p-2 outline-none ${
                                        errors.roleId ? "border-red-600" : "border-gray-300"
                                    }`}>
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.roleId && <span className="text-red-600 text-sm mt-1">{errors.roleId.message}</span>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 rounded text-white">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PanelUserForm;
