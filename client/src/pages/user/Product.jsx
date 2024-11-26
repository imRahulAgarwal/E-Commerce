import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faShoppingBag, faHeart as faFilledHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import userService from "../../api/user/api";
import { useDispatch, useSelector } from "react-redux";
import { setUserCart, setUserWishlist } from "../../store/auth/userAuthSlice";
import { toast } from "react-toastify";
import toastCss from "../../config/toast";

const Product = () => {
    const userWishlist = useSelector((state) => state.userAuth.wishlist);
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        userService.updateCartItems({ productSizeId: selectedSizeId }).then((data) => {
            if (data.success) {
                userService.readCartItems().then(({ data }) => {
                    if (data) {
                        dispatch(setUserCart(data));
                    }
                });
            }
        });
    };

    const handleAddToWishlist = () => {
        userService.updateWishlist({ productSizeId: selectedSizeId }).then((data) => {
            if (data.success) {
                userService.readWishlist().then(({ data }) => {
                    if (data) {
                        dispatch(setUserWishlist(data));
                    }
                });
            }
        });
    };

    const handleBuyNow = () => {
        if (!selectedSizeId) {
            return toast.error("Select a size", toastCss);
        }

        navigate("/checkout", {
            state: {
                products: [
                    {
                        name: product.name,
                        colour: product.colour,
                        price: product.price,
                        size: product.sizes.find((size) => size._id === selectedSizeId).size,
                        quantity: 1,
                        image: product.images[0],
                        productSizeId: product.sizes.find((size) => size._id === selectedSizeId)._id,
                    },
                ],
                isBuyNow: true,
            },
        });
    };

    useEffect(() => {
        userService.getProduct(productId).then(({ data }) => {
            setProduct(data.product);
        });
    }, [productId]);

    if (!product._id) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Product Page Wrapper */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Carousel Section */}
                <div className="lg:w-1/2 flex flex-col gap-4">
                    {/* Main Image */}
                    <div className="flex-1 relative">
                        <img
                            src={product.images[selectedImage]}
                            alt="Selected Image"
                            className="w-full rounded-md max-h-[500px] object-contain"
                        />
                        {/* Control Buttons */}
                        <button
                            onClick={() =>
                                setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)
                            }
                            className="sm:hidden absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm">
                            &lt;
                        </button>
                        <button
                            onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                            className="sm:hidden absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm">
                            &gt;
                        </button>
                    </div>
                    {/* Thumbnails */}
                    <div className="gap-4 mx-auto hidden sm:flex">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                                }`}
                                onClick={() => setSelectedImage(index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Information Section */}
                <div className="lg:w-1/2">
                    {/* Category Name */}
                    <span className="text-sm text-gray-500 uppercase font-semibold">{product.category}</span>
                    {/* Product Name */}
                    <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                    {/* Product Description */}
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    {/* Price */}
                    <p className="text-xl font-semibold text-blue-600 mb-6">₹ {product.price.toFixed(2)}</p>

                    {/* Colors */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Colors:</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {product.colours.map((color, index) => (
                                <Link
                                    to={`/product/${color._id}`}
                                    key={index}
                                    className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded ${
                                        product._id == color._id ? "bg-gray-300" : "bg-gray-100 hover:bg-gray-200"
                                    }`}>
                                    <span className="text-gray-700">{color.colour}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Sizes:</h3>
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(60px,_1fr))] gap-4">
                            {product.sizes.map((size, index) => {
                                return size.isAvailable ? (
                                    <button
                                        key={index}
                                        className={`px-4 py-2 text-gray-700 rounded-lg cursor-pointer ${
                                            selectedSizeId === size._id
                                                ? "bg-gray-300"
                                                : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                        onClick={() => setSelectedSizeId(size._id)}>
                                        {size.size}
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        key={index}
                                        className={`px-4 py-2 text-gray-700 rounded-lg bg-red-50 disabled:cursor-not-allowed`}>
                                        {size.size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToWishlist}
                            className="flex-1 bg-gray-300 py-3 rounded-lg shadow-md group flex items-center justify-center gap-2">
                            <FontAwesomeIcon
                                icon={
                                    userWishlist.some((product) => product.id === selectedSizeId)
                                        ? faFilledHeart
                                        : faHeart
                                }
                            />
                            Add to wishlist
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faShoppingBag} />
                            Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faCartShopping} />
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Related Products</h2>
                <div
                    className={`grid grid-cols-1 ${
                        product.relatedProducts?.length ? "sm:grid-cols-2 md:grid-cols-4 gap-8" : ""
                    }`}>
                    {product.relatedProducts?.length ? (
                        product.relatedProducts?.map((relatedProduct) => (
                            <div key={relatedProduct.id} className="w-full group">
                                <img
                                    src={relatedProduct.image}
                                    alt={relatedProduct.name}
                                    className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="text-base flex flex-col text-left mt-4">
                                    <span className="font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-2">
                                        {relatedProduct.name}
                                    </span>
                                    <span className="text-sm text-gray-500">${relatedProduct.price.toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="border bg-gray-100 w-full py-3 text-center text-lg rounded shadow">
                            <p>Inventory is updating, Stay Tuned!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Product;
