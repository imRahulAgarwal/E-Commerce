import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faTimes,
    faShoppingBag,
    faUser,
    faChevronDown,
    faSearch,
    faTimesCircle,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../../store/auth/userAuthSlice";
import userService from "../../../api/user/api";
import Cart from "../Cart/Cart";
import Wishlist from "../../../pages/user/Wishlist";

const Header = () => {
    const userLoginStatus = useSelector((state) => state.userAuth?.status);
    const cart = useSelector((state) => state.userAuth.cart);
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
    const [isMdScreen, setIsMdScreen] = useState(window.innerWidth >= 768);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isProfileDropdownMobileOpen, setIsProfileDropdownMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]); // New state for search results
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const navLinks = [
        { title: "Home", to: "/", showNavLink: true },
        { title: "Shop", to: "/shop", showNavLink: true },
    ];

    useEffect(() => {
        const handleResize = () => setIsMdScreen(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = useCallback(() => {
        userService.logout().then((data) => {
            if (data) {
                dispatch(userLogout());
            }
        });
    }, [dispatch]);

    const clearSearch = useCallback(() => setSearchQuery(""), []);

    const searchProducts = () => {
        userService.getProducts({ limit: 5, search: searchQuery }).then(({ data }) => {
            if (data) {
                setSearchResults(data.products);
            }
        });
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery) {
                searchProducts();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const navigateToShop = useCallback(() => {
        navigate("/shop");
    }, []);

    const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
    const toggleWishlist = useCallback(() => setIsWishlistOpen((prev) => !prev), []);

    const handleProceedToCheckout = useCallback(() => {
        if (cart.length) {
            navigate("/checkout", { state: { products: cart, isBuyNow: false } });
            toggleCart();
            setIsOffCanvasOpen(false);
        }
    }, [cart.length]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky left-0 right-0 top-0 bg-white shadow-md px-4 z-[9999]">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between min-h-20 h-auto max-md:py-4">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="font-bold text-2xl text-gray-800">E-Commerce Store</div>
                    {!isMdScreen && (
                        <button className="text-gray-600 focus:outline-none" onClick={() => setIsOffCanvasOpen(true)}>
                            <FontAwesomeIcon icon={faBars} className="text-2xl" />
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className={`mt-4 md:mt-0 flex items-center w-full md:w-1/3 ${isMdScreen ? "justify-center" : ""}`}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border rounded-md pl-10 pr-10 py-2 text-gray-700 focus:outline-none"
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        {searchQuery && (
                            <FontAwesomeIcon
                                icon={faTimesCircle}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                onClick={clearSearch}
                            />
                        )}

                        {/* Search Results Dropdown */}
                        {searchQuery && searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-w-full">
                                <ul className="py-2 max-w-full">
                                    {searchResults.map((result) => (
                                        <li
                                            key={result.colorId}
                                            className="hover:bg-gray-100 flex items-center px-2 py-2">
                                            <img
                                                src={result.image}
                                                alt={`${result.name}-${result.color}`}
                                                className="w-12 h-12 object-cover rounded mr-2"
                                            />
                                            <NavLink
                                                to={`/product/${result.colorId}`}
                                                onClick={clearSearch}
                                                className="block flex-1 text-sm text-gray-700 truncate">
                                                {result.name} - {result.color} ({result.category})
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* No Results Found */}
                        {searchQuery && searchResults.length === 0 && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
                                <div className="py-2 px-4 text-sm text-gray-500">No results found</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Inline Navigation for Larger Screens */}
                {isMdScreen && (
                    <nav className="flex items-center gap-6 mt-4 md:mt-0">
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
                            {/* User Icon */}
                            <div className="relative" ref={dropdownRef}>
                                {userLoginStatus ? (
                                    <>
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
                                                <NavLink
                                                    to="/orders"
                                                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                                                    onClick={() => setIsProfileDropdownOpen(false)}>
                                                    Orders
                                                </NavLink>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className="text-gray-600 hover:text-blue-500 transition focus:outline-none">
                                        <FontAwesomeIcon icon={faUser} className="text-xl" />
                                    </NavLink>
                                )}
                            </div>

                            {userLoginStatus ? (
                                <button
                                    className="text-gray-600 hover:text-blue-500 transition relative"
                                    onClick={toggleCart}>
                                    <FontAwesomeIcon icon={faShoppingBag} className="text-2xl" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cart?.reduce((prev, current) => prev + current.quantity, 0)}
                                    </span>
                                </button>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-500 transition focus:outline-none">
                                    <FontAwesomeIcon icon={faShoppingBag} className="text-2xl" />
                                </NavLink>
                            )}

                            {userLoginStatus ? (
                                <button
                                    className="mr-auto block text-gray-700 font-medium hover:text-blue-500 transition relative"
                                    onClick={toggleWishlist}>
                                    <FontAwesomeIcon icon={faHeart} className="text-2xl" />
                                </button>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-500 transition focus:outline-none">
                                    <FontAwesomeIcon icon={faHeart} className="text-2xl" />
                                </NavLink>
                            )}
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
                            {userLoginStatus ? (
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
                                            <NavLink
                                                to="/orders"
                                                className="block p-2 hover:bg-gray-100 transition rounded"
                                                onClick={() => setIsOffCanvasOpen(false)}>
                                                Orders
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
                            ) : (
                                <NavLink
                                    to="/login"
                                    onClick={() => setIsOffCanvasOpen(false)}
                                    className="block text-gray-700 font-medium hover:text-blue-500 transition">
                                    Login
                                </NavLink>
                            )}

                            <button
                                className="mr-auto block text-gray-700 font-medium hover:text-blue-500 transition relative"
                                onClick={toggleCart}>
                                <FontAwesomeIcon icon={faShoppingBag} className="text-2xl" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {cart?.reduce((prev, current) => prev + current.quantity, 0)}
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {((!isMdScreen && isOffCanvasOpen) || isCartOpen || isWishlistOpen) && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() =>
                            isCartOpen ? toggleCart() : isWishlistOpen ? toggleWishlist() : setIsOffCanvasOpen(false)
                        }></div>
                )}

                <Cart
                    isCartOpen={isCartOpen}
                    closeCart={toggleCart}
                    navigateToShop={navigateToShop}
                    handleProceedToCheckout={handleProceedToCheckout}
                />

                <Wishlist
                    isWishlistOpen={isWishlistOpen}
                    closeWishlist={toggleWishlist}
                    navigateToShop={navigateToShop}
                />
            </div>
        </header>
    );
};

export default Header;
