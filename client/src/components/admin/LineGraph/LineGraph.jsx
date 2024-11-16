import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import adminPanelService from "../../../api/admin/api-admin";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraph = ({ title, apiKey }) => {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState("month");

    const generateChartData = (label, dataset, filterType) => ({
        datasets: [
            {
                label,
                data: dataset,
                borderColor: "#2563eb",
                backgroundColor: "rgba(37, 99, 235, 0.5)",
                tension: 0.4,
            },
        ],
    });

    useEffect(() => {
        setLoading(true);
        const fetchReports = async () => {
            let response;
            switch (apiKey) {
                case "orders":
                    response = await adminPanelService.orderReports(filter);
                    break;
                case "customers":
                    response = await adminPanelService.customerReports(filter);
                    break;
                case "revenue":
                    response = await adminPanelService.revenueReports(filter);
                    break;
                default:
                    break;
            }
            if (response?.data) {
                setReports(response.data.reports || []);
            }
            setLoading(false);
        };
        fetchReports();
    }, [filter, apiKey]);

    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-500">{title}</h2>
                <select
                    className="border border-blue-300 rounded px-2 py-1 text-gray-600"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}>
                    <option value="7days">Past 7 Days</option>
                    <option value="month">Month Wise</option>
                    <option value="year">Year Wise</option>
                </select>
            </div>
            {!loading && reports.length ? (
                <Line
                    data={generateChartData(title, reports, filter)}
                    options={{
                        responsive: true,
                        parsing: {
                            xAxisKey: "id",
                            yAxisKey: "data",
                        },
                        plugins: {
                            legend: { display: true },
                            tooltip: { enabled: true },
                        },
                    }}
                />
            ) : (
                <p className="min-h-40">{loading ? "Loading Data..." : "No data available"}</p>
            )}
        </div>
    );
};

export default LineGraph;
