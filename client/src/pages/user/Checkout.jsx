import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import userService from "../../api/user/api";
import { setAddresses, setUserCart } from "../../store/auth/userAuthSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import toastCss from "../../config/toast";

const Checkout = () => {
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.userAuth.addresses);
    const [step, setStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

    const location = useLocation();
    const navigate = useNavigate();
    const products = location.state?.products || [];
    const isBuyNow = location.state?.isBuyNow;
    const taxableAmount = products.reduce((prev, curr) => prev + curr.quantity * curr.price, 0);
    const taxAmount = Number((taxableAmount * 0.05).toFixed(2));
    const totalAmount = Math.round(Number(taxableAmount + taxAmount).toFixed(2));
    const roundOffAmount = Number((totalAmount - (taxableAmount + taxAmount)).toFixed(2));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleAddAddress = (data) => {
        userService.addAddress(data).then(({ data }) => {
            if (data) {
                dispatch(setAddresses([...addresses, data.address]));
                setShowModal(false);
                reset();
            }
        });
    };

    const handleAddressModalClose = () => {
        setShowModal(false);
        reset();
    };

    // New function to handle payment
    const handlePayment = async () => {
        if (!selectedAddress) {
            toast.error("Please select an address before proceeding.", toastCss);
            return;
        }

        const paymentData = {
            isBuyNow,
            addressId: selectedAddress._id,
        };

        if (isBuyNow) {
            paymentData.productSizeId = products[0].productSizeId;
        }

        try {
            const response = await userService.createOrder(paymentData);
            if (response.success) {
                const options = {
                    key: response.data.key,
                    amount: response.data.order.amount,
                    currency: response.data.order.currency,
                    name: "Website",
                    description: "Product Purchase",
                    order_id: response.data.order.id,
                    handler: async function (response) {
                        userService.verifyPayment(response).then((data) => {
                            if (data && !isBuyNow) {
                                dispatch(setUserCart([]));
                            }
                            navigate("/");
                        });
                    },
                    prefill: {
                        name: response.data.customer.name,
                        email: response.data.customer.email,
                        contact: response.data.customer.number,
                    },
                    theme: {
                        color: "#61dafb",
                    },
                };

                const razorPay = new Razorpay(options);
                razorPay.open();
            }
        } catch (error) {
            toast.error("An error occurred during payment.", toastCss);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!products.length) {
        toast.error("Cannot access directly", toastCss);
        return navigate("/shop");
    }

    return (
        <div className="container mx-auto p-6">
            {isLargeScreen ? (
                <div className="grid grid-cols-2 gap-6">
                    {/* Address Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Select Address</h2>
                            <button
                                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                onClick={() => setShowModal(true)}>
                                Add New Address
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {addresses.map((address, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedAddress(address)}
                                    className={`border rounded p-4 cursor-pointer ${
                                        selectedAddress === address ? "border-blue-500" : ""
                                    }`}>
                                    <p>{address.addressLine1}</p>
                                    <p>{address.addressLine2}</p>
                                    <p>
                                        {address.city}, {address.state}
                                    </p>
                                    <p>
                                        {address.country} - {address.pincode}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product & Order Details */}
                    <div>
                        <div className="flex-1 space-y-4">
                            <h2 className="text-xl font-bold">Your Products</h2>
                            {products.map((product, index) => (
                                <div key={index} className="flex items-center gap-4 border rounded p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-16 w-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{product.name}</p>
                                        <p className="text-gray-500">
                                            {product.colour} - {product.size}
                                        </p>
                                    </div>
                                    <p>
                                        ₹{product.price} x {product.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 border rounded p-6 space-y-4">
                            <h2 className="text-xl font-bold">Order Summary</h2>
                            <div className="flex justify-between">
                                <span>Total Taxable Amount:</span>
                                <span>₹{taxableAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax Amount:</span>
                                <span>₹{taxAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Round-Off:</span>
                                <span>₹{roundOffAmount}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount:</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <button
                                className={`w-full mt-4 px-6 py-2 text-white rounded ${
                                    selectedAddress
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                onClick={handlePayment}
                                disabled={!selectedAddress}>
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {step === 1 && (
                        <div>
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Select Address</h2>
                                <button
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                                    onClick={() => setShowModal(true)}>
                                    Add New Address
                                </button>
                            </div>
                            <div className="grid gap-4 mt-4">
                                {addresses.map((address, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedAddress(address)}
                                        className={`border rounded p-4 cursor-pointer ${
                                            selectedAddress === address ? "border-blue-500" : ""
                                        }`}>
                                        <p>{address.addressLine1}</p>
                                        <p>{address.addressLine2}</p>
                                        <p>
                                            {address.city}, {address.state}
                                        </p>
                                        <p>
                                            {address.country} - {address.pincode}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <button
                                className={`mt-6 w-full px-6 py-2 text-white rounded ${
                                    selectedAddress
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                onClick={() => selectedAddress && setStep(2)}
                                disabled={!selectedAddress}>
                                Next
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-center">Your Products</h2>
                                {products.map((product, index) => (
                                    <div key={index} className="flex items-center gap-4 border rounded p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-16 w-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-gray-500">
                                                {product.colour} - {product.size}
                                            </p>
                                        </div>
                                        <p>
                                            ₹{product.price} x {product.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 border rounded p-6 space-y-4">
                                <h2 className="text-xl font-bold">Order Summary</h2>
                                <div className="flex justify-between">
                                    <span>Total Taxable Amount:</span>
                                    <span>₹{taxableAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax Amount:</span>
                                    <span>₹{taxAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Round-Off:</span>
                                    <span>₹{roundOffAmount}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Amount:</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <button
                                    className={`w-full mt-4 px-6 py-2 text-white rounded ${
                                        selectedAddress
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-300 cursor-not-allowed"
                                    }`}
                                    onClick={handlePayment}
                                    disabled={!selectedAddress}>
                                    Pay Now
                                </button>
                            </div>
                        </>
                    )}
                    <div className="flex justify-center gap-2 mt-4">
                        {[1, 2].map((page) => (
                            <span
                                key={page}
                                className={`h-3 w-3 rounded-full ${step === page ? "bg-blue-500" : "bg-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white rounded-lg w-[36rem] p-6">
                        <h2 className="text-xl font-bold mb-4">Add Address</h2>
                        <form onSubmit={handleSubmit(handleAddAddress)} className="space-y-4">
                            <div>
                                <input
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Address Line 1"
                                    {...register("addressLine1", { required: true })}
                                />
                                {errors.addressLine1 && (
                                    <span className="text-red-500 text-sm">Address Line 1 is required.</span>
                                )}
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Address Line 2"
                                    {...register("addressLine2")}
                                />
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="City"
                                    {...register("city", { required: true })}
                                />
                                {errors.city && <span className="text-red-500 text-sm">City is required.</span>}
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="State"
                                    {...register("state", { required: true })}
                                />
                                {errors.state && <span className="text-red-500 text-sm">State is required.</span>}
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Country"
                                    {...register("country", { required: true })}
                                />
                                {errors.country && <span className="text-red-500 text-sm">Country is required.</span>}
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Pincode"
                                    {...register("pincode", { required: true })}
                                />
                                {errors.pincode && <span className="text-red-500 text-sm">Pincode is required.</span>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-500"
                                    onClick={handleAddressModalClose}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
