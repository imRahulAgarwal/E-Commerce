import React from "react";
import { Controller, useForm } from "react-hook-form";
import adminPanelService from "../../../api/admin/api-admin";
import { toast } from "react-toastify";
import toastCss from "../../../config/toast";

const ProductSizeModal = ({ onClose, initialData = {}, colourId, productId }) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            size: initialData.size || "",
            quantity: initialData.quantity || "",
            description: initialData.description || "",
            isActive: initialData.isActive,
        },
    });

    const submitHandler = (data) => {
        if (!productId) {
            return toast.error("Product ID is required", toastCss);
        }
        if (!colourId) {
            return toast.error("Colour ID is required", toastCss);
        }

        if (initialData._id) {
            adminPanelService.updateProductSize(initialData._id, productId, colourId, data).then(({ data }) => {});
        } else {
            adminPanelService.createProductSize(productId, colourId, data).then(({ data }) => {});
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-96 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">
                    {initialData._id ? "Edit Product Size" : "Add Product Size"}
                </h3>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="flex flex-col mb-4">
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.size ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Product Size"
                            {...register("size", {
                                required: { value: true, message: "Product size is required" },
                            })}
                            type="text"
                        />
                        {errors.size && <span className="text-red-600 text-sm mt-1">{errors.size.message}</span>}
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
                                errors.quantity ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Product Quantity"
                            {...register("quantity", {
                                required: { value: true, message: "Product quantity is required" },
                            })}
                            type="number"
                        />
                        {errors.quantity && (
                            <span className="text-red-600 text-sm mt-1">{errors.quantity.message}</span>
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

export default ProductSizeModal;
