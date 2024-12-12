import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import ProductColourModal from "../../components/admin/ProductColourModal/ProductColourModal";
import ProductSizeModal from "../../components/admin/ProductSizeModal/ProductSizeModal";
import ConfirmationModal from "../../components/admin/ConfirmationModal/ConfirmationModal";
import Loader from "../../components/Loader/Loader";

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isColourModalOpen, setIsColourModalOpen] = useState(false);
    const [currentColour, setCurrentColour] = useState(null);
    const [colourToDelete, setColourToDelete] = useState("");

    const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState(null);
    const [colourId, setColourId] = useState("");

    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const fetchProduct = () => {
        adminPanelService
            .getProduct(productId)
            .then(async ({ data }) => {
                if (data) {
                    setProduct(data.product);
                }
            })
            .finally(() => setLoading(false));
    };

    const closeConfirmationModal = useCallback(() => {
        setIsConfirmationOpen(false);
        setColourToDelete("");
    }, []);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const handleColourModalClose = useCallback(() => {
        setIsColourModalOpen(false);
        setCurrentColour(null);
    }, []);

    const handleSizeModalClose = useCallback(() => {
        setIsSizeModalOpen(false);
        setCurrentSize(null);
        setColourId("");
    }, []);

    const handleSizeModalOpen = useCallback((colourId) => {
        setIsSizeModalOpen(true);
        setColourId(colourId);
    }, []);

    const handleEditSize = useCallback((colourId, size) => {
        setIsSizeModalOpen(true);
        setColourId(colourId);
        setCurrentSize(size);
    }, []);

    const handleEditColour = useCallback(
        (colourId) => {
            const colourToEdit = product.colours.find((colour) => colour._id === colourId);
            setCurrentColour(colourToEdit);
            setIsColourModalOpen(true);
        },
        [product]
    );

    const handleDeleteColour = useCallback((colourId) => {
        setColourToDelete(colourId);
        setIsConfirmationOpen(true);
    }, []);

    const deleteProduct = useCallback(async () => {
        if (colourToDelete) {
            const result = await adminPanelService.deleteProductColour(colourToDelete);
            if (result) {
                fetchProduct(); // Reload data to ensure pagination is accurate
            }
            closeConfirmationModal(); // Close the confirmation modal
        }
    }, [colourToDelete]);

    const handleProductColourSave = async (data) => {
        if (currentColour) {
            await adminPanelService.updateProductColour(productId, currentColour._id, data);
        } else {
            await adminPanelService.createProductColour(productId, data);
        }
        handleColourModalClose();
        fetchProduct();
    };

    const handleProductSizeSave = async (data) => {
        if (currentSize) {
            await adminPanelService.updateProductSize(currentSize._id, productId, colourId, data);
        } else {
            await adminPanelService.createProductSize(productId, colourId, data);
        }
        handleSizeModalClose();
        fetchProduct();
    };

    return (
        <div className="bg-white shadow-lg rounded-lg w-full p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Product Details</h1>

            {loading ? (
                <div className="mb-4">
                    <Loader />
                </div>
            ) : product ? (
                <div className="space-y-8">
                    {/* Product Information Section */}
                    <div className="border-b pb-4">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Product Information</h2>
                        <div className="text-lg text-gray-700 space-y-2">
                            <p>
                                <span className="font-semibold">Name:</span> {product.name}
                            </p>
                            <p>
                                <span className="font-semibold">Price:</span> Rs. {product.price}
                            </p>
                            <p>
                                <span className="font-semibold">Description:</span> {product.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-blue-500">Colours</h2>
                            <button
                                onClick={() => setIsColourModalOpen(true)}
                                className="text-blue-500 hover:text-blue-700 flex items-center gap-2">
                                <FontAwesomeIcon icon={faPlus} /> Add Colour
                            </button>
                        </div>

                        {product.colours.length ? (
                            product.colours.map((colour) => (
                                <div key={colour._id} className="bg-gray-100 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-semibold text-blue-700">{colour.colour}</h3>
                                        <div className="space-x-3">
                                            <button onClick={() => handleEditColour(colour._id)}>
                                                <FontAwesomeIcon icon={faEdit} className="text-green-500" />
                                            </button>
                                            <button onClick={() => handleDeleteColour(colour._id)}>
                                                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display Images */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                        {colour.images && colour.images.length > 0 ? (
                                            colour.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.file}
                                                    alt={`Colour ${colour.colour} Image ${index + 1}`}
                                                    className="object-cover rounded-md shadow-md"
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No images available.</p>
                                        )}
                                    </div>

                                    {/* Size Table */}
                                    <table className="table-auto w-full bg-white rounded-lg mt-4">
                                        <thead>
                                            <tr className="bg-blue-100 text-left">
                                                <th className="px-4 py-2">Size</th>
                                                <th className="px-4 py-2">Quantity</th>
                                                <th className="px-4 py-2">Sold</th>
                                                <th className="px-4 py-2">Is Active</th>
                                                <th className="px-4 py-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {colour.sizes.length > 0 ? (
                                                colour.sizes.map((size) => (
                                                    <tr key={size._id} className="border-t">
                                                        <td className="px-4 py-2">{size.size}</td>
                                                        <td className="px-4 py-2">{size.quantity}</td>
                                                        <td className="px-4 py-2">{size.sold}</td>
                                                        <td className="px-4 py-2">{size.isActive ? "Yes" : "No"}</td>
                                                        <td className="px-4 py-2">
                                                            <div className="space-x-3">
                                                                <button
                                                                    onClick={() => handleEditSize(colour._id, size)}>
                                                                    <FontAwesomeIcon
                                                                        icon={faEdit}
                                                                        className="text-green-500"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-2 text-gray-500">
                                                        No sizes available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    <div className="text-right mt-2">
                                        <button
                                            onClick={() => handleSizeModalOpen(colour._id)}
                                            className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faPlus} /> Add Size
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">No product colours found.</div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">No product information found.</div>
            )}

            {isColourModalOpen && (
                <ProductColourModal
                    onClose={handleColourModalClose}
                    initialData={currentColour}
                    productId={productId}
                    onSave={handleProductColourSave}
                />
            )}

            {isSizeModalOpen && (
                <ProductSizeModal
                    initialData={currentSize || {}}
                    onClose={handleSizeModalClose}
                    productId={productId}
                    colourId={colourId}
                    onSave={handleProductSizeSave}
                />
            )}

            {isConfirmationOpen && (
                <ConfirmationModal
                    onClose={closeConfirmationModal}
                    onConfirm={deleteProduct}
                    message="Are you sure you want to delete this product?"
                />
            )}
        </div>
    );
};

export default ProductDetails;
