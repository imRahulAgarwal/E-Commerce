import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin"; // Replace with actual service for fetching products
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import loadingImage from "../../assets/loading.gif";
import ProductColourModal from "../../components/admin/ProductColourModal/ProductColourModal";
import ProductSizeModal from "../../components/admin/ProductSizeModal/ProductSizeModal";

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isColourModalOpen, setIsColourModalOpen] = useState(false);
    const [currentColour, setCurrentColour] = useState(null);

    const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState(null);
    const [colourId, setColourId] = useState("");

    useEffect(() => {
        adminPanelService.getProduct(productId).then(async ({ data }) => {
            setLoading(false);
            if (data) {
                setProduct(data.product);
            }
        });
    }, [productId]);

    const handleColourModalClose = () => {
        setIsColourModalOpen(false);
        setCurrentColour(null);
    };

    const handleSizeModalClose = () => {
        setIsSizeModalOpen(false);
        setCurrentSize(null);
        setColourId("");
    };

    const handleSizeModalOpen = (colourId) => {
        setIsSizeModalOpen(true);
        setColourId(colourId);
    };

    const handleEditSize = (colourId, size) => {
        setIsSizeModalOpen(true);
        setColourId(colourId);
        setCurrentSize(size);
    };

    const handleEditColour = (colourId) => {
        const colourToEdit = product.colours.find((colour) => colour._id === colourId);
        setCurrentColour(colourToEdit);
        setIsColourModalOpen(true);
    };

    const handleSaveColour = async (colourData) => {
        // Logic for saving colour to backend
        // Update state if necessary
        handleColourModalClose();
    };

    const handleDeleteColour = async (colourId) => {
        // Delete colour logic here, update product data afterward
    };

    const handleDeleteSize = async () => {};

    return (
        <div className="bg-white shadow-lg rounded-lg w-full p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Product Details</h1>

            {loading ? (
                <div className="mb-4">
                    <img src={loadingImage} height={40} width={40} alt="Loading GIF" className="mx-auto" />
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
                                            <button onClick={() => handleEditColour(colour)}>
                                                <FontAwesomeIcon icon={faEdit} className="text-green-500" />
                                            </button>
                                            <button onClick={() => handleDeleteColour(colour._id)}>
                                                <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Display Images */}
                                    <div className="grid grid-cols-4 gap-4 mt-4">
                                        {colour.images && colour.images.length > 0 ? (
                                            colour.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
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
                                                        <td className="px-4 py-2">
                                                            <div className="space-x-3">
                                                                <button
                                                                    onClick={() => handleEditSize(colour._id, size)}>
                                                                    <FontAwesomeIcon
                                                                        icon={faEdit}
                                                                        className="text-green-500"
                                                                    />
                                                                </button>
                                                                <button onClick={() => handleDeleteSize(size._id)}>
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="text-red-500"
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

            <ProductColourModal
                isOpen={isColourModalOpen}
                onClose={handleColourModalClose}
                onSave={handleSaveColour}
                initialData={currentColour}
                productId={productId}
            />

            {isSizeModalOpen && (
                <ProductSizeModal
                    initialData={currentSize || {}}
                    onClose={handleSizeModalClose}
                    productId={productId}
                    colourId={colourId}
                />
            )}
        </div>
    );
};

export default ProductDetails;
