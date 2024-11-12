import React from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

const RoleForm = ({ onClose, onSubmit, initialData = {}, permissions }) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: initialData.name || "",
            description: initialData.description || "",
            permissions:
                initialData.permissions?.map((perm) => ({
                    value: perm._id,
                    label: perm.name,
                })) || [],
        },
    });

    const submitHandler = (data) => {
        const formattedData = {
            ...data,
            permissions: data.permissions.map((perm) => perm.value),
        };
        onSubmit(formattedData);
        reset();
    };

    // Format permissions options for React Select
    const permissionOptions = permissions.map((permission) => ({
        value: permission._id,
        label: permission.name,
    }));

    const selectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: errors.permissions ? "#dc2626" : "#d1d5db", // Red on error (#dc2626) and light gray on default (#d1d5db)
            boxShadow: errors.permissions ? "0 0 0 0px #dc2626" : "none",
            "&:hover": { borderColor: errors.permissions ? "#dc2626" : "#9ca3af" }, // Darker gray on hover
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: errors.permissions ? "#fee2e2" : "#e5e7eb", // Light red (#fee2e2) if error, light gray (#e5e7eb) otherwise
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: errors.permissions ? "#b91c1c" : "#374151", // Dark red (#b91c1c) if error, dark gray (#374151) otherwise
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: errors.permissions ? "#b91c1c" : "#374151", // Dark red for remove icon if error, dark gray otherwise
            ":hover": { backgroundColor: errors.permissions ? "#fee2e2" : "#d1d5db" }, // Light red on hover if error, medium gray otherwise
        }),
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{initialData._id ? "Edit User Role" : "Add User Role"}</h3>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.name ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Role name"
                            {...register("name", { required: { value: true, message: "Role name is required" } })}
                            type="text"
                        />
                        {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col mb-4">
                        <textarea
                            className="w-full border rounded p-2 outline-none border-gray-300"
                            placeholder="Role description (Optional)"
                            {...register("description")}></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1">Permissions</label>
                        <Controller
                            name="permissions"
                            control={control}
                            rules={{ required: "At least one permission is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    isMulti
                                    options={permissionOptions}
                                    classNamePrefix="react-select"
                                    placeholder="Select permissions"
                                    styles={selectStyles}
                                    onChange={(selectedOptions) => field.onChange(selectedOptions)}
                                    value={field.value}
                                />
                            )}
                        />
                        {errors.permissions && <p className="text-red-500 text-sm">{errors.permissions.message}</p>}
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

export default RoleForm;
