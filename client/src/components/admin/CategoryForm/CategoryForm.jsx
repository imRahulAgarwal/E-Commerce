import React from "react";
import { useForm } from "react-hook-form";

const CategoryForm = ({ onClose, onSubmit, initialData = {} }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: { name: initialData.name || "" },
    });

    const submitHandler = (data) => {
        onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{initialData._id ? "Edit Category" : "Add Category"}</h3>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.name ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Category Name"
                            {...register("name", { required: { value: true, message: "Category name is required" } })}
                            type="text"
                        />
                        {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name.message}</span>}
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

export default CategoryForm;
