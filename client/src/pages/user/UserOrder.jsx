import React from "react";

const UserOrder = () => {
    const orderDetails = {
        orderId: "ORD12345",
        razorpayOrderId: "RAZOR12345",
        razorpayPaymentId: "PAY12345",
        product: [
            {
                productName: "T-shirt",
                productColor: "Blue",
                productQuantity: 1,
                productPrice: 499,
                productThumbnail: "https://via.placeholder.com/100",
                productCategory: "Clothing",
                productId: "PROD1",
                productColorId: "COL1",
                productSize: "L",
            },
            {
                productName: "Hoodie",
                productColor: "Black",
                productQuantity: 2,
                productPrice: 799,
                productThumbnail: "https://via.placeholder.com/100",
                productCategory: "Clothing",
                productId: "PROD2",
                productColorId: "COL2",
                productSize: "M",
            },
        ],
        totalAmount: 407,
        taxAmount: 99,
        roundoffamount: 9,
        address: {
            line1: "123 Main Street",
            line2: "Apt 4B",
            city: "New York",
            state: "NY",
            country: "USA",
            pincode: "10001",
        },
        paymentStatus: "Paid",
        paymentDateTime: "2024-11-15T10:30:00Z",
        deliveryStatus: "Shipped",
        trackingLink: "https://example.com/track",
    };

    const {
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        product,
        totalAmount,
        taxAmount,
        roundoffamount,
        address,
        paymentStatus,
        deliveryStatus,
    } = orderDetails;

    return (
        <div className="bg-gray-50 min-h-screen p-6 font-lato">
            <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Order Details</h1>

            {/* Order Details Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Order Details */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Order ID:</p>
                            <p className="font-bold text-lg">{orderId}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Payment Status:</p>
                            <p
                                className={`font-bold text-lg ${
                                    paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                                }`}>
                                {paymentStatus}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Delivery Status:</p>
                            <p className="font-bold text-lg">{deliveryStatus}</p>
                        </div>
                    </div>
                </div>

                {/* Razorpay Details */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Information</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Razorpay Order ID:</p>
                            <p className="font-bold text-lg">{razorpayOrderId}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Razorpay Payment ID:</p>
                            <p className="font-bold text-lg">{razorpayPaymentId}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
                <div className="space-y-6">
                    {product.map((item, index) => (
                        <div key={item.productId} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2">
                                <img
                                    src={item.productThumbnail}
                                    alt={item.productName}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{item.productName}</h3>
                                    <p className="text-sm text-gray-500">Category: {item.productCategory}</p>
                                    <p className="text-sm text-gray-500">Color: {item.productColor}</p>
                                    <p className="text-sm text-gray-500">Size: {item.productSize}</p>
                                    <p className="text-sm text-gray-500">Quantity: {item.productQuantity}</p>
                                    <p className="text-sm text-gray-500">Price: ₹{item.productPrice}</p>
                                </div>
                            </div>
                            {index < product.length - 1 && <hr className="my-4 border-gray-300" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Address and Payment Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Shipping Address */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                    <p className="text-gray-800 text-sm">{address.line1}</p>
                    {address.line2 && <p className="text-gray-800 text-sm">{address.line2}</p>}
                    <p className="text-gray-800 text-sm">
                        {address.city}, {address.state}, {address.pincode}
                    </p>
                    <p className="text-gray-800 text-sm">{address.country}</p>
                </div>

                {/* Payment Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <p className="text-gray-600 text-sm font-medium">Net Amount:</p>
                            <p className="font-bold text-lg">₹{totalAmount - taxAmount - roundoffamount}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600 text-sm font-medium">Tax Amount:</p>
                            <p className="font-bold text-lg">₹{taxAmount}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600 text-sm font-medium">Round-off Amount:</p>
                            <p className="font-bold text-lg">₹{roundoffamount}</p>
                        </div>
                        <hr className="my-2 border-gray-300" />
                        <div className="flex justify-between">
                            <p className="text-gray-600 text-sm font-medium">Total Amount:</p>
                            <p className="font-bold text-2xl text-blue-600">₹{totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrder;
