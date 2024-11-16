import React from "react";
import LineGraph from "../../components/admin/LineGraph/LineGraph";

const Reports = () => {
    const graphData = [
        { title: "Total Orders", apiKey: "orders" },
        { title: "Total Customers", apiKey: "customers" },
        { title: "Total Revenue", apiKey: "revenue" },
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full min-h-full">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Reports</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {graphData.map(({ title, apiKey }) => (
                    <LineGraph key={apiKey} title={title} apiKey={apiKey} />
                ))}
            </div>
        </div>
    );
};

export default Reports;
