import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminPanelService from "../../api/admin/api-admin";
import Loader from "../../components/Loader/Loader";

const Customer = () => {
    const { customerId } = useParams();
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminPanelService
            .getCustomer(customerId)
            .then(({ data }) => {
                if (data) {
                    setCustomerData(data.customer);
                }
            })
            .finally(() => setLoading(false));
    }, [customerId]);

    return (
        <div className="bg-white shadow-lg rounded-lg w-full p-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Customer Details</h1>

            {loading ? (
                <div className="mb-4">
                    <Loader />
                </div>
            ) : customerData ? (
                <div className="pt-4 border-t border-blue-200">
                    {/* Personal Information Section */}
                    <div className="pb-4 border-b border-blue-200">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Personal Information</h2>
                        <div className="flex flex-col gap-2 text-black">
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Name:</span> {customerData.fName}{" "}
                                {customerData.lName}
                            </p>
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Email:</span> {customerData.email}
                            </p>
                            <p className="text-lg">
                                <span className="font-medium text-blue-700">Phone:</span> {customerData.number}
                            </p>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="pt-4">
                        <h2 className="text-2xl font-bold text-blue-500 mb-4">Addresses</h2>
                        <div className="text-black text-lg space-y-4">
                            {customerData.addresses && customerData.addresses.length > 0 ? (
                                customerData.addresses.map((address, index) => (
                                    <div key={index} className="space-y-1">
                                        <p>{address.addressLine1}</p>
                                        <p>{address.addressLine2}</p>
                                        <p>
                                            {address.city}, {address.state}
                                        </p>
                                        <p>
                                            {address.country} - {address.pincode}
                                        </p>
                                        {customerData.addresses.length - 1 !== index && (
                                            <hr className="border-blue-200 my-2" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No address information available.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-4">
                    <p className="text-gray-500">No customer information found.</p>
                </div>
            )}
        </div>
    );
};

export default Customer;
