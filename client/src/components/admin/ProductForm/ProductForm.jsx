import React from "react";
import { Controller, useForm } from "react-hook-form";

const ProductForm = ({ onClose, onSubmit, initialData = {}, categories }) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: initialData.name || "",
            description: initialData.description || "",
            isActive: initialData.isActive || true,
            price: initialData.price || "",
            categoryId: initialData.category?._id || "",
        },
    });

    const submitHandler = (data) => {
        onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">{initialData._id ? "Edit Product" : "Add Product"}</h3>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.name ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Product Name"
                            {...register("name", { required: { value: true, message: "Product name is required" } })}
                            type="text"
                        />
                        {errors.name && <span className="text-red-600 text-sm mt-1">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col mb-4">
                        <textarea
                            className={`w-full border rounded p-2 outline-none ${
                                errors.description ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Product description"
                            {...register("description", {
                                required: { value: true, message: "Product description is required" },
                            })}></textarea>
                        {errors.description && (
                            <span className="text-red-600 text-sm mt-1">{errors.description.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.price ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Product Price"
                            {...register("price", { required: { value: true, message: "Product price is required" } })}
                            type="number"
                        />
                        {errors.price && <span className="text-red-600 text-sm mt-1">{errors.price.message}</span>}
                    </div>

                    <div className="flex flex-col mb-4">
                        <Controller
                            name="categoryId"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className={`w-full border rounded p-2 outline-none ${
                                        errors.categoryId ? "border-red-600" : "border-gray-300"
                                    }`}>
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.categoryId && (
                            <span className="text-red-600 text-sm mt-1">{errors.categoryId.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col mb-4">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <select {...field} className="w-full border rounded p-2 outline-none border-gray-300">
                                    {[
                                        { name: "Yes", value: "true" },
                                        { name: "No", value: "false" },
                                    ].map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
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

export default ProductForm;
