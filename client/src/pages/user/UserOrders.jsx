import React from "react";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
    const navigate = useNavigate();

    const orders = [];

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <h1 className="text-2xl font-bold text-blue-600">My Orders</h1>

                {orders.length ? (
                    <div className="flex items-center gap-2">
                        <label htmlFor="filterYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Year:
                        </label>
                        <select id="filterYear" className="border border-gray-300 rounded-md p-2">
                            <option value="all">All Years</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                    </div>
                ) : (
                    ""
                )}
            </div>

            <div className={`grid ${orders.length ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : ""}`}>
                {orders.length ? (
                    orders.map((product, index) => (
                        <div
                            key={`${product.orderId}-${product.id}-${index}`}
                            className="border border-gray-200 rounded-lg bg-white p-4 shadow-md hover:shadow-lg hover:bg-blue-50 transition duration-300 cursor-pointer"
                            onClick={() => navigate(`/orders/${product.orderId}`)}>
                            <div className="flex flex-col sm:flex-row items-start gap-x-4 gap-y-2">
                                <div className="relative">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.name}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        x{product.quantity}
                                    </span>
                                </div>

                                {/* Product Details */}
                                <div className="space-y-2">
                                    <h2 className="font-bold text-lg text-gray-800">{product.name}</h2>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                    <p>
                                        <span className="text-gray-600">Order ID: </span>
                                        <span className="font-bold">{product.orderId}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-600">Order Date: </span>
                                        <span className="font-bold">
                                            {new Date(product.orderDate).toLocaleDateString()}
                                        </span>
                                    </p>
                                    <p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                product.paymentStatus === "Paid"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                            }`}>
                                            {product.paymentStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="border bg-gray-100 w-full py-3 text-center text-lg rounded shadow flex flex-col gap-2">
                        <p>No orders found, Start shopping!</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded mx-auto"
                            onClick={() => navigate("/shop")}>
                            Shop Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
