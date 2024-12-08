import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import userService from "../../api/user/api";
import Loader from "../../components/Loader/Loader";

const UserOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        userService
            .getOrder(orderId)
            .then(({ data }) => {
                if (data) {
                    setOrder(data.order);
                }
            })
            .finally(() => setLoading(false));
    }, [orderId]);

    if (loading) {
        return <Loader />;
    }

    if (!order?._id) {
        return navigate("/orders");
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 mb-6 sm:mb-8">Order Details</h1>

            {/* Order Details Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* General Order Details */}
                    <div className="space-y-2 sm:space-y-4">
                        <div>
                            <p className="text-gray-500 font-medium">Order ID:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">{order.razorpay_order_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Payment Status:</p>
                            <p
                                className={`text-base sm:text-xl font-bold ${
                                    order.paymentStatus === "Completed" ? "text-green-500" : "text-red-500"
                                }`}>
                                {order.paymentStatus}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Order Place Time:</p>
                            <p className="text-base sm:text-xl font-bold">{order.createdAt}</p>
                        </div>
                    </div>

                    {/* Razorpay Details */}
                    <div className="space-y-2 sm:space-y-4">
                        <div>
                            <p className="text-gray-500 font-medium">Razorpay Order ID:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">{order.razorpay_order_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Razorpay Payment ID:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">{order.razorpay_payment_id}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Payment Time:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">{order.paymentDateTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Products</h2>
                <div className="space-y-4 sm:space-y-6">
                    {order.products.map((item) => (
                        <div
                            key={item.productSizeId}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b pb-4 sm:pb-6">
                            <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-20 sm:w-24 h-20 sm:h-24 rounded-xl shadow-md object-cover"
                            />
                            <div className="flex-1 space-y-2">
                                <Link to={`/product/${item.productColourId}`}>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-800 hover:text-blue-600">
                                        {item.productName}
                                    </h3>
                                </Link>
                                <p className="text-sm sm:text-base text-gray-500">Category: {item.productCategory}</p>
                                <p className="text-sm sm:text-base text-gray-500">Color: {item.productColour}</p>
                                <p className="text-sm sm:text-base text-gray-500">Size: {item.productSize}</p>
                                <p className="text-sm sm:text-base text-gray-500">Quantity: {item.productQuantity}</p>
                                <p className="text-sm sm:text-base text-gray-500">Price: ₹{item.productPrice}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Address and Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">Shipping Address</h2>
                    <p className="text-sm sm:text-base text-gray-700">
                        {order.address.addressLine1}, {order.address.addressLine2 && `${order.address.addressLine2}, `}
                        {order.address.city}, {order.address.state}, {order.address.pincode}, {order.address.country}
                    </p>
                </div>

                {/* Payment Details */}
                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">Payment Details</h2>
                    <div className="space-y-2 sm:space-y-4">
                        <div className="flex justify-between">
                            <p className="text-gray-500 font-medium">Net Amount:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">₹{order.taxableAmount}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-500 font-medium">Tax Amount:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">₹{order.taxAmount}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-500 font-medium">Round-off Amount:</p>
                            <p className="text-base sm:text-xl font-bold text-gray-800">₹{order.roundOffAmount}</p>
                        </div>
                        <div className="flex justify-between border-t pt-4 mt-4">
                            <p className="text-gray-500 font-medium">Total Amount:</p>
                            <p className="text-xl sm:text-2xl font-bold text-blue-600">₹{order.totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrder;
