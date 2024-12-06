import React, { useEffect, useState } from "react";
import adminPanelService from "../../api/admin/api-admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faUsers,
    faDollarSign,
    faBagShopping,
    faUserPlus,
    faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const DashboardCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white shadow rounded-lg p-6 flex items-center space-x-4">
            <div className="text-3xl text-blue-500">
                <FontAwesomeIcon icon={icon} />
            </div>
            <div>
                <p className="text-gray-500">{title}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState({});

    useEffect(() => {
        adminPanelService.dashboardInfo().then(({ data }) => {
            if (data) {
                setData(data);
            }
        });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold mb-4">Total Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardCard title="Total Orders" value={data.totalOrders} icon={faShoppingCart} />
                    <DashboardCard title="Total Customers" value={data.totalCustomers} icon={faUsers} />
                    <DashboardCard title="Total Revenue" value={`₹ ${data.totalRevenue}`} icon={faDollarSign} />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Today's Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardCard title="Today's Orders" value={data.todayOrders} icon={faBagShopping} />
                    <DashboardCard title="Today's Customers" value={data.todayCustomers} icon={faUserPlus} />
                    <DashboardCard title="Today's Revenue" value={`₹ ${data.todayRevenue}`} icon={faChartLine} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
