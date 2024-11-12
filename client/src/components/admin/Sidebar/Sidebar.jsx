import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTachometerAlt,
    faUserFriends,
    faBox,
    faMoneyCheckAlt,
    faTags,
    faWarehouse,
    faUserShield,
    faUsersCog,
    faChartLine,
    faClipboardList,
    faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const navLinks = [
    { icon: faTachometerAlt, text: "Dashboard", path: "/panel/dashboard" },
    { icon: faUserFriends, text: "Customers", path: "/panel/customers" },
    { icon: faBox, text: "Orders", path: "/panel/orders" },
    { icon: faTags, text: "Products", path: "/panel/products" },
    { icon: faWarehouse, text: "Inventory", path: "/panel/inventory" },
    { icon: faUserShield, text: "Roles", path: "/panel/roles" },
    { icon: faUsersCog, text: "Panel Users", path: "/panel/panel-users" },
    { icon: faChartLine, text: "Reports", path: "/panel/reports" },
    { icon: faClipboardList, text: "Audits", path: "/panel/audits" },
    { icon: faSignOutAlt, text: "Logout", path: "/panel/logout" },
];

const Sidebar = ({ isOpen }) => {
    return (
        <div
            className={`fixed top-0 border-r border-black-opacity-20 left-0 bottom-0 z-50 w-60 bg-white shadow-md transition-transform duration-300 transform ${
                isOpen ? "translate-x-0" : "-translate-x-60"
            }`}>
            {/* Website Name */}
            <div className="flex items-center justify-center text-black font-semibold text-lg max-h-20 h-full border-b border-black-opacity-20">
                Website Name
            </div>

            {/* Navigation Links */}
            <nav className="overflow-y-auto h-[calc(100vh-5rem)]">
                {navLinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center p-4 cursor-pointer text-gray-700 gap-2 ${
                                isActive ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-blue-50"
                            }`
                        }>
                        <span className="w-6 flex justify-center">
                            <FontAwesomeIcon icon={link.icon} className="text-lg text-blue-600" />
                        </span>
                        <span className="text-md">{link.text}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
