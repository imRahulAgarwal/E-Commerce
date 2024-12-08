import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

const ProductColourModal = ({ onClose, initialData, onSave }) => {
    const [mainImage, setMainImage] = useState(null);
    const [otherImages, setOtherImages] = useState([]); // Start with an empty array for other images
    const [removeImages, setRemoveImages] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            colour: initialData?.colour || "",
        },
    });

    // Handler for main image selection
    const handleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setMainImage(file);
            clearErrors("mainImage");
        }
    };

    // Handler to remove the selected main image
    const handleRemoveMainImage = () => {
        setMainImage(null);
    };

    // Handler for other images
    const handleOtherImageChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            setOtherImages((prev) => prev.map((img) => (img.id === id ? { ...img, file } : img)));
        }
    };

    // Handler to add a new other image input
    const addOtherImageField = () => {
        if (otherImages.length < 3) {
            setOtherImages((prev) => [...prev, { id: Date.now(), file: null }]);
        }
    };

    // Handler to remove a specific other image
    const handleRemoveOtherImage = (id) => {
        setOtherImages((prev) => prev.map((img) => (img.id === id ? { ...img, file: null } : img)));
        if (initialData && initialData.images.some((img) => img.id === id) && !removeImages.includes(id)) {
            setRemoveImages((prev) => [...prev, id]);
        }
    };

    // Handler to remove an other image field entirely
    const removeOtherImageField = (id) => {
        setOtherImages((prev) => prev.filter((img) => img.id !== id));
    };

    const submitHandler = async (data) => {
        if (!mainImage) {
            setError("mainImage", {
                type: "manual",
                message: "Product main image is required",
            });
            return;
        }

        const formData = new FormData();

        formData.append("colour", data.colour);

        if (mainImage instanceof File) {
            formData.append("main-image", mainImage);
        }

        otherImages.forEach((image, index) => {
            if (image.file && !String(image.id).startsWith("removed-")) {
                // Only add images that haven’t been marked as removed
                formData.append(`other-image`, image.file);
            }
        });

        if (initialData) {
            // Send only unique removeImages to the server
            const uniqueRemoveImages = Array.from(new Set(removeImages));
            uniqueRemoveImages.forEach((id) => {
                formData.append("removeImages", id);
            });
        }

        await onSave(formData);
        reset();
    };

    useEffect(() => {
        if (initialData) {
            const isDefault = initialData.images.find((image) => image.isDefault);
            if (isDefault) {
                setMainImage(isDefault.file);
            }
            const isNotDefault = initialData.images
                .filter((image) => !image.isDefault)
                .map(({ file, id }) => ({ file, id }));
            setOtherImages(isNotDefault);
        }
    }, [initialData]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{initialData ? "Edit" : "Add"} Product Colour</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <form onSubmit={handleSubmit(submitHandler)}>
                    {/* Colour Input */}
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700 mb-1">Colour</label>
                        <input
                            className={`w-full border rounded p-2 outline-none ${
                                errors.colour ? "border-red-600" : "border-gray-300"
                            }`}
                            placeholder="Enter Product Colour"
                            {...register("colour", {
                                required: { value: true, message: "Product colour is required" },
                            })}
                            type="text"
                        />
                        {errors.colour && <span className="text-red-600 text-sm mt-1">{errors.colour.message}</span>}
                    </div>

                    {/* Main Image Input */}
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700 mb-1">Main Image (required)</label>
                        {mainImage ? (
                            <div className="relative">
                                <img
                                    src={mainImage.name ? URL.createObjectURL(mainImage) : mainImage}
                                    alt="Selected"
                                    className="w-full h-auto mb-2 rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveMainImage}
                                    className="w-full bg-red-500 text-white p-2 rounded">
                                    Remove Image
                                </button>
                            </div>
                        ) : (
                            <input
                                className={`w-full border rounded p-2 outline-none ${
                                    errors.mainImage ? "border-red-600" : "border-gray-300"
                                }`}
                                type="file"
                                onChange={handleMainImageChange}
                            />
                        )}
                        {errors.mainImage && (
                            <span className="text-red-600 text-sm mt-1">{errors.mainImage.message}</span>
                        )}
                    </div>

                    {/* Other Images Section */}
                    <div className="flex flex-col mb-4">
                        <label className="text-gray-700 mb-1">Other Images (optional, max 3)</label>
                        {otherImages.map((image, index) => (
                            <div key={image.id} className="mb-2">
                                {image.file ? (
                                    <div className="relative">
                                        <img
                                            src={image.file.name ? URL.createObjectURL(image.file) : image.file}
                                            alt={`Other Image ${index + 1}`}
                                            className="w-full h-auto mb-2 rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOtherImage(image.id)}
                                            className="w-full bg-red-500 text-white p-2 rounded">
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <input
                                            className="w-full border rounded p-2 outline-none border-gray-300"
                                            type="file"
                                            onChange={(event) => handleOtherImageChange(image.id, event)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeOtherImageField(image.id)}
                                            className="ml-2 text-red-500 hover:text-red-700">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {otherImages.length < 3 && (
                            <button
                                type="button"
                                onClick={addOtherImageField}
                                className="w-full bg-blue-500 text-white p-2 rounded mt-2">
                                Add Image
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md mt-4">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductColourModal;
