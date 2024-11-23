import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import userService from "../../api/user/api";
import { Link } from "react-router-dom";

const Shop = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch products from the API
    const fetchProducts = async (page, isSearch = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const { data } = await userService.getProducts({ page, search });
            const newProducts = data.products || [];
            setProducts((prev) => (isSearch ? newProducts : [...prev, ...newProducts]));
            setTotalPages(data.pages);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination when scrolling
    const handleScroll = () => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const bottomOffset = document.documentElement.offsetHeight - 100;

        if (scrollPosition >= bottomOffset && !loading && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    // Clear search input and trigger search
    const handleClearSearch = () => {
        setSearch("");
        setProducts([]);
        setCurrentPage(1);
    };

    // Trigger search when search input changes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setProducts([]);
            setCurrentPage(1);
            fetchProducts(1, true);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    // Load more products when the page changes
    useEffect(() => {
        if (currentPage > 1) {
            fetchProducts(currentPage);
        }
    }, [currentPage]);

    // Attach scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, currentPage, totalPages]);

    return (
        <div className="flex-1 bg-gray-50 flex flex-col">
            <div className="shop-hero text-center flex justify-center items-center">
                <div className="z-30 relative w-full">
                    <h2 className="text-3xl font-bold text-white">Shop</h2>
                    <div className="relative max-w-xl w-full mx-auto">
                        <div className="relative w-full py-10">
                            <label
                                htmlFor="search"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FontAwesomeIcon icon={faSearch} />
                            </label>
                            <input
                                type="text"
                                id="search"
                                name="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border border-gray-300 px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Search..."
                            />
                            {search && (
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    onClick={handleClearSearch}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-black opacity-70"></div>
            </div>
            <div className="container mx-auto py-10">
                <div className="text-center">
                    <div className="flex flex-col max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                            <span className="text-lg text-left">Showing {products.length} Results</span>
                            <div className="flex items-center gap-2">
                                <span>Sort By :</span>
                                <select className="border border-gray-300 px-3 py-2 rounded-lg bg-white text-gray-700 focus:outline-none shadow-sm hover:shadow-md transition-all">
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Relevance</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {products.map((product) => (
                                <Link to={`/product/${product.colorId}`} key={product.colorId} className="w-full group">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full transition-transform duration-300 group-hover:scale-[1.02] border border-black-opacity-20"
                                    />
                                    <div className="text-base flex flex-col text-left mt-4">
                                        <span className="font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-2">
                                            {product.name} - {product.category} ({product.color})
                                        </span>
                                        <span className="text-sm text-gray-500">₹ {product.price}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {loading && (
                            <div className="text-center py-4">
                                <span className="text-gray-500">Loading...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
