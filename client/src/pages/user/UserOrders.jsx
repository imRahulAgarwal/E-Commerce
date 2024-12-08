import React, { useEffect, useState, useCallback } from "react";
import userService from "../../api/user/api";
import { Link } from "react-router-dom";
import moment from "moment";
import Loader from "../../components/Loader/Loader";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const [loading, setLoading] = useState(false);

    const fetchOrders = useCallback(async (page = 1, limit = 10) => {
        setLoading(true);
        try {
            const { data } = await userService.getOrders({ page, limit });
            if (data) {
                setOrders((prevOrders) => [...prevOrders, ...data.orders]);
                setPagination({ page: data.page, total: data.total, limit: data.limit, pages: data.pages });
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const loadMoreOrders = () => {
        if (pagination.page < pagination.pages) {
            fetchOrders(pagination.page + 1, pagination.limit);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <h1 className="text-4xl font-bold text-blue-700 mb-8">My Orders</h1>

            {orders.length > 0 ? (
                <>
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="mb-8 p-6 bg-white shadow-lg rounded-lg transition-transform hover:scale-[1.01]">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b pb-4">
                                <div className="flex gap-2 items-center">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-base">Order ID</p>
                                        <p className="bg-blue-100 text-blue-700 rounded px-3 py-1 font-semibold">
                                            {order._id}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-base">Order Date</p>
                                        <p className="bg-gray-200 text-gray-700 rounded px-3 py-1 font-semibold">
                                            {moment(order.createdAt).format("DD.MM.YYYY, hh:mm A")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-base">Payment Status</p>
                                        <p
                                            className={`rounded px-3 py-1 font-semibold w-40 ${
                                                order.paymentStatus === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {order.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <Link
                                        to={`/order/${order._id}`}
                                        className="bg-blue-600 text-white rounded px-6 py-2 text-sm font-medium hover:bg-blue-700 transition">
                                        View Order Details
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {order.products.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50 shadow-sm">
                                        <div className="relative">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.productName}
                                                className="w-24 h-24 object-cover rounded-md"
                                                loading="lazy"
                                            />
                                            <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white text-sm font-bold flex justify-center items-center rounded-full">
                                                x{product.quantity}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-lg font-semibold text-gray-800">
                                                {product.productName}
                                            </h2>
                                            <p className="text-sm text-gray-600">{product.category}</p>
                                            <p className="text-sm text-gray-500">Color: {product.productColour}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {pagination.page < pagination.pages && (
                        <div className="text-center mt-6">
                            <button
                                onClick={loadMoreOrders}
                                disabled={loading}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50">
                                {loading ? <Loader /> : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-gray-700 mb-4">No orders found. Start shopping!</p>
                    <Link
                        to="/shop"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                        Shop Now
                    </Link>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
