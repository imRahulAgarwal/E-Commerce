import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTachometerAlt,
    faUserFriends,
    faBox,
    faTags,
    faUserShield,
    faUsersCog,
    faChartLine,
    faClipboardList,
    faSignOutAlt,
    faList,
    faAddressBook,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import adminPanelService from "../../../api/admin/api-admin";
import { logout } from "../../../store/auth/adminAuthSlice";

const navLinks = [
    { icon: faTachometerAlt, text: "Dashboard", path: "/panel/dashboard", permission: "" },
    { icon: faUserFriends, text: "Customers", path: "/panel/customers", permission: "manage_customer" },
    { icon: faBox, text: "Orders", path: "/panel/orders", permission: "manage_order" },
    { icon: faList, text: "Categories", path: "/panel/categories", permission: "manage_product" },
    { icon: faTags, text: "Products", path: "/panel/products", permission: "manage_product" },
    { icon: faUserShield, text: "Roles", path: "/panel/roles", permission: "manage_role" },
    { icon: faUsersCog, text: "Panel Users", path: "/panel/panel-users", permission: "manage_panel_user" },
    { icon: faChartLine, text: "Reports", path: "/panel/reports", permission: "manage_report" },
    { icon: faClipboardList, text: "Audits", path: "/panel/audits", permission: "manage_audit" },
    { icon: faAddressBook, text: "Contact Us", path: "/panel/contact-us", permission: "manage_query" },
];

const Sidebar = ({ isOpen }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.adminAuth);

    const handleLogout = () => {
        adminPanelService.logout().then((data) => {
            if (data) {
                dispatch(logout());
            }
        });
    };

    const accessibleLinks = navLinks.filter(
        (link) => link.permission === "" || user.permissions.includes(link.permission)
    );
    return (
        <div
            className={`fixed top-0 border-r border-black-opacity-20 left-0 bottom-0 z-50 w-60 bg-white shadow-md transition-transform duration-300 transform ${
                isOpen ? "translate-x-0" : "-translate-x-60"
            }`}>
            {/* Website Name */}
            <div className="flex items-center justify-center text-black font-semibold text-lg max-h-20 h-full border-b border-black-opacity-20">
                E-Commerce Store
            </div>

            {/* Navigation Links */}
            <nav className="overflow-y-auto h-[calc(100vh-5rem)]">
                {accessibleLinks.map((link, index) => (
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
                <button
                    key={navLinks.length}
                    onClick={handleLogout}
                    className="w-full flex items-center p-4 cursor-pointer text-gray-700 gap-2 hover:bg-blue-50">
                    <span className="w-6 flex justify-center">
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-lg text-blue-600" />
                    </span>
                    <span className="text-md">Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
