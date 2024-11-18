import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faShoppingCart, faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../../store/auth/userAuthSlice";
import userService from "../../../api/user/api";

const Header = () => {
    const userLoginStatus = useSelector((state) => state.userAuth?.status);
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isProfileDropdownMobileOpen, setIsProfileDropdownMobileOpen] = useState(false);

    const dispatch = useDispatch();

    const navLinks = [
        { title: "Home", to: "/", showNavLink: true },
        { title: "Shop", to: "/shop", showNavLink: true },
        { title: "Login", to: "/login", showNavLink: !userLoginStatus },
        { title: "Register", to: "/register", showNavLink: !userLoginStatus },
    ];

    useEffect(() => {
        const handleResize = () => setIsMdScreen(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        userService.logout().then((data) => {
            if (data) {
                dispatch(userLogout());
            }
        });
    };

    return (
        <header className="sticky left-0 right-0 top-0 bg-white shadow-md px-4 z-[9999]">
            <div className="container mx-auto flex items-center justify-between h-20">
                {/* Logo */}
                <div className="font-bold text-2xl text-gray-800">Website</div>

                {/* Hamburger Icon */}
                {!isMdScreen && (
                    <button className="text-gray-600 focus:outline-none" onClick={() => setIsOffCanvasOpen(true)}>
                        <FontAwesomeIcon icon={faBars} className="text-2xl" />
                    </button>
                )}

                {/* Inline Navigation for Larger Screens */}
                {isMdScreen && (
                    <nav className="flex items-center gap-6">
                        {/* Main Navigation Links */}
                        {navLinks
                            .filter((navLink) => navLink.showNavLink)
                            .map((navLink) => (
                                <NavLink
                                    key={navLink.title}
                                    to={navLink.to}
                                    className={({ isActive }) =>
                                        `text-gray-700 text-lg transition font-medium ${
                                            isActive ? "font-semibold text-blue-600" : "hover:text-blue-500 "
                                        }`
                                    }>
                                    {navLink.title}
                                </NavLink>
                            ))}

                        {/* Cart and Profile Dropdown */}
                        <div className="flex items-center gap-6">
                            {/* Profile Dropdown */}
                            {userLoginStatus && (
                                <div className="relative">
                                    <button
                                        className="text-gray-600 hover:text-blue-500 transition focus:outline-none"
                                        onClick={() => setIsProfileDropdownOpen((prev) => !prev)}>
                                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 bg-white border shadow-lg p-2 rounded-md mt-2 w-48 text-sm">
                                            <NavLink
                                                to="/profile"
                                                className="block px-4 py-2 hover:bg-gray-100 rounded"
                                                onClick={() => setIsProfileDropdownOpen(false)}>
                                                Profile
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Cart Icon */}
                            <NavLink to="/cart" className="text-gray-600 hover:text-blue-500 transition">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                            </NavLink>
                        </div>
                    </nav>
                )}

                {/* Offcanvas for Smaller Screens */}
                {!isMdScreen && (
                    <div
                        className={`fixed z-50 top-0 right-0 h-full bg-white shadow-lg p-4 w-64 transform transition-transform duration-300 ${
                            isOffCanvasOpen ? "translate-x-0" : "translate-x-full"
                        }`}>
                        <button
                            className="absolute top-4 right-4 text-gray-600"
                            onClick={() => setIsOffCanvasOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} className="text-2xl" />
                        </button>
                        <div className="mt-10 flex flex-col gap-4">
                            {navLinks
                                .filter((navLink) => navLink.showNavLink)
                                .map((navLink) => (
                                    <NavLink
                                        key={navLink.title}
                                        to={navLink.to}
                                        className={({ isActive }) =>
                                            `block font-medium transition ${
                                                isActive
                                                    ? "font-semibold text-blue-500"
                                                    : "text-gray-700 hover:text-blue-500"
                                            }`
                                        }
                                        onClick={() => setIsOffCanvasOpen(false)}>
                                        {navLink.title}
                                    </NavLink>
                                ))}

                            {/* Profile Dropdown */}
                            {userLoginStatus && (
                                <div className="flex flex-col">
                                    <button
                                        className="flex justify-between items-center py-2 text-gray-700 transition rounded"
                                        onClick={() => setIsProfileDropdownMobileOpen((prev) => !prev)}>
                                        <span>Profile</span>
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            className={`transition-transform ${
                                                isProfileDropdownMobileOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    {isProfileDropdownMobileOpen && (
                                        <div className="flex flex-col px-2">
                                            <NavLink
                                                to="/profile"
                                                className="block p-2 hover:bg-gray-100 transition rounded"
                                                onClick={() => setIsOffCanvasOpen(false)}>
                                                Profile
                                            </NavLink>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsOffCanvasOpen(false);
                                                }}
                                                className="block text-left p-2 hover:bg-gray-100 transition rounded">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <NavLink
                                to="/cart"
                                onClick={() => setIsOffCanvasOpen(false)}
                                className="block text-gray-700 font-medium hover:text-blue-500 transition">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-lg" /> Cart
                            </NavLink>
                        </div>
                    </div>
                )}

                {/* Overlay */}
                {!isMdScreen && isOffCanvasOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOffCanvasOpen(false)}></div>
                )}
            </div>
        </header>
    );
};

export default Header;
