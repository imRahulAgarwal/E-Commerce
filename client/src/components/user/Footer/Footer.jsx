import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
    const userLoginStatus = useSelector((state) => state.userAuth?.status) || false;

    const navLinks = [
        { title: "Home", to: "/" },
        { title: "Shop", to: "/shop" },
        {
            title: "My Account",
            to: userLoginStatus ? "/profile" : "/login",
        },
    ];

    const helpfulLinks = [
        { title: "Privacy Policy", to: "/privacy-policy" },
        { title: "Terms and Conditions", to: "/terms-and-conditions" },
        { title: "Contact Us", to: "/contact-us" },
    ];

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="font-bold text-2xl text-blue-400">E-Commerce Store</div>
                        <p className="mt-2 text-gray-400 text-sm">The best place to shop and explore.</p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="font-medium text-lg mb-4">Navigation</h3>
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.title}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `text-sm ${isActive ? "text-blue-400" : "hover:text-blue-300"}`
                                    }>
                                    {link.title}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Helpful Links */}
                    <div>
                        <h3 className="font-medium text-lg mb-4">Helpful Links</h3>
                        <div className="flex flex-col gap-2">
                            {helpfulLinks.map((link) => (
                                <NavLink
                                    key={link.title}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `text-sm ${isActive ? "text-blue-400" : "hover:text-blue-300"}`
                                    }>
                                    {link.title}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>

                {/* All Rights Reserved */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} E-Commerce Store. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default React.memo(Footer);
